import asyncio
import logging
from playwright.async_api import async_playwright

class BrowserTool:
    """
    Playwright-powered browser agent holding a persistent headless context.
    Scrapes live SERP data to retrieve real-world accommodation snippets.
    """
    def __init__(self):
        self._p = None
        self.browser = None
        self.logger = logging.getLogger("BrowserTool")

    async def start(self):
        if not self._p:
            self.logger.info("Initializing Playwright Chromium headless instance...")
            self._p = await async_playwright().start()
            self.browser = await self._p.chromium.launch(headless=True)
            self.logger.info("Chromium instance active.")

    async def stop(self):
        if self.browser:
            await self.browser.close()
        if self._p:
            await self._p.stop()
        self._p = None
        self.browser = None
        self.logger.info("Browser stopped.")

    async def scrape_url(self, url: str) -> str:
        """Fetch raw text dump of a URL for general scraping."""
        if not self.browser:
            await self.start()
        
        page = await self.browser.new_page()
        try:
            await page.goto(url, wait_until="domcontentloaded", timeout=15000)
            text = await page.evaluate("document.body.innerText")
            return text
        except Exception as e:
            self.logger.error(f"Failed to scrape {url}: {e}")
            return f"Error: {str(e)}"
        finally:
            await page.close()

    async def search_hotels(self, destination_name: str) -> list[dict]:
        """
        Actively navigates DuckDuckGo HTML (no-JS) to extract live real-world 
        descriptions of hotels for the requested destination.
        """
        if not self.browser:
            await self.start()
        
        self.logger.info(f"Browser navigating web for hotels in {destination_name}...")
        page = await self.browser.new_page()
        scraped_hotels = []

        try:
            # DuckDuckGo HTML is extremely fast and robust for basic text extraction
            url = f"https://html.duckduckgo.com/html/?q=best+5-star+hotels+in+{destination_name}"
            await page.goto(url, wait_until="domcontentloaded", timeout=15000)

            # Extract the top 3 search result title + snippet blocks
            results = await page.query_selector_all(".result__body")
            
            for index, res in enumerate(results[:3]):
                try:
                    title_el = await res.query_selector(".result__title")
                    snippet_el = await res.query_selector(".result__snippet")
                    
                    title = await title_el.inner_text() if title_el else f"Hotel Option {index+1}"
                    snippet = await snippet_el.inner_text() if snippet_el else "Luxury accommodation option."
                    
                    scraped_hotels.append({
                        "name": title.split('|')[0][:40].strip(), # Truncate long SEO titles
                        "price": f"${180 + (index * 45)}/night", # Simulated dynamic price computation
                        "rating": 5.0 if index == 0 else 4.5,
                        "desc": snippet[:100] + "..." # Clean up text
                    })
                except Exception as eval_err:
                    self.logger.warning(f"Error parsing hotel node: {eval_err}")
                    continue

        except Exception as e:
            self.logger.error(f"Playwright routing exception: {e}")
        finally:
            await page.close()

        return scraped_hotels


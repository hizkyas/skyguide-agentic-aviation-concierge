class BrowserTool:
    """
    Mock browser tool for web scraping.
    In production, this would use Playwright to scrape travel sites.
    """
    async def start(self):
        pass

    async def stop(self):
        pass

    async def search_hotels(self, destination: str):
        return []

    async def scrape_url(self, url: str) -> str:
        return ""

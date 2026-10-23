"""Render the store pictures in demo-studio/store/*.html to PNG (1080 x 1920), next to each page.

    python3 demo-studio/tools/render_store.py            # every page
    python3 demo-studio/tools/render_store.py accept-cards-MX
"""
import asyncio
import glob
import os
import sys

from playwright.async_api import async_playwright

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "store")


async def main(names):
    pages = sorted(glob.glob(os.path.join(ROOT, "*.html")))
    if names:
        pages = [p for p in pages if os.path.splitext(os.path.basename(p))[0] in names]
    async with async_playwright() as pw:
        b = await pw.chromium.launch()
        pg = await b.new_page(viewport={"width": 1080, "height": 1920}, device_scale_factor=1)
        for p in pages:
            await pg.goto("file://" + os.path.abspath(p))
            await pg.wait_for_timeout(1500)   # web fonts
            out = os.path.splitext(p)[0] + ".png"
            await pg.screenshot(path=out)
            print(out)
        await b.close()


asyncio.run(main(sys.argv[1:]))

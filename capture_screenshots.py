import asyncio
from playwright.async_api import async_playwright
import os

BASE_URL = "http://127.0.0.1:8000"

async def take_screenshots():
    os.makedirs('Showcase', exist_ok=True)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={'width': 1280, 'height': 800})
        page = await context.new_page()

        print("Capturing Login Screen...")
        await page.goto(f"{BASE_URL}/")
        # Ensure the page is fully loaded before capture
        await page.wait_for_load_state("networkidle")
        await page.screenshot(path="Showcase/Screenshot_01.png")

        # Function to login and screenshot
        async def login_and_capture(email, password, screenshot_name, role_name):
            print(f"Logging in as {role_name}...")
            await page.goto(f"{BASE_URL}/")
            await page.fill('input[name="email"]', email)
            await page.fill('input[name="password"]', password)
            await page.click('button[type="submit"]')
            await page.wait_for_load_state("networkidle")
            # Wait an extra second for animations to settle
            await page.wait_for_timeout(1000)
            
            print(f"Capturing {role_name} Dashboard...")
            await page.screenshot(path=f"Showcase/{screenshot_name}")
            
            print(f"Logging out {role_name}...")
            # Using specific locator for logout based on the previous template edits
            await page.goto(f"{BASE_URL}/logout_user")
            await page.wait_for_load_state("networkidle")

        # Admin
        try:
            await login_and_capture('admin@college.com', 'admin', 'Screenshot_02.png', 'Admin')
        except Exception as e:
            print(f"Failed Admin: {e}")

        # Staff
        try:
            await login_and_capture('staffone@staff.com', 'staffone', 'Screenshot_03.png', 'Staff')
        except Exception as e:
            print(f"Failed Staff: {e}")

        # Student
        try:
            await login_and_capture('studentone@student.com', 'studentone', 'Screenshot_04.png', 'Student')
        except Exception as e:
            print(f"Failed Student: {e}")

        await browser.close()
        print("All screenshots successfully captured!")

if __name__ == "__main__":
    asyncio.run(take_screenshots())

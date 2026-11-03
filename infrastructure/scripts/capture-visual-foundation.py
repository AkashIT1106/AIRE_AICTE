#!/usr/bin/env python3
"""
Capture browser screenshots for AIRE Visual Foundation Preview & Landing Page.
Tests viewports specified in design.md §14.1:
- Desktop: 1440x900
- Tablet: 1024x768
- Mobile: 390x844
"""

import os
import signal
import subprocess
import sys
import time
import urllib.request
from playwright.sync_api import sync_playwright

PORT = 4173
BASE_URL = f"http://127.0.0.1:{PORT}"
CHROME_PATH = "/usr/bin/google-chrome-stable"

VIEWPORTS = [
    {"name": "desktop-1440", "width": 1440, "height": 900},
    {"name": "tablet-1024", "width": 1024, "height": 768},
    {"name": "mobile-390", "width": 390, "height": 844},
]

def ensure_server():
    try:
        with urllib.request.urlopen(BASE_URL, timeout=1) as resp:
            if resp.status == 200:
                print(f"[PREVIEW] Server already running at {BASE_URL}")
                return None
    except Exception:
        pass

    repo_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    client_dir = os.path.join(repo_root, "client")

    print(f"[PREVIEW] Starting Vite preview at {BASE_URL}...")
    proc = subprocess.Popen(
        ["pnpm", "preview", "--port", str(PORT), "--host", "127.0.0.1"],
        cwd=client_dir,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        preexec_fn=os.setsid,
    )

    deadline = time.time() + 15
    while time.time() < deadline:
        try:
            with urllib.request.urlopen(BASE_URL, timeout=1) as resp:
                if resp.status == 200:
                    print("[PREVIEW] Server is ready.")
                    return proc
        except Exception:
            time.sleep(0.5)

    print("[ERROR] Timed out waiting for preview server", file=sys.stderr)
    try:
        os.killpg(os.getpgid(proc.pid), signal.SIGTERM)
    except Exception:
        pass
    sys.exit(1)

def main():
    server_proc = ensure_server()
    repo_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    output_dir = os.path.join(repo_root, "test-results", "screenshots")
    os.makedirs(output_dir, exist_ok=True)

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(
                executable_path=CHROME_PATH,
                headless=True,
                args=["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
            )

            for vp in VIEWPORTS:
                context = browser.new_context(
                    viewport={"width": vp["width"], "height": vp["height"]},
                    device_scale_factor=1,
                )
                page = context.new_page()

                # 1. Preview Page
                preview_url = f"{BASE_URL}/preview"
                page.goto(preview_url, wait_until="networkidle")
                page.wait_for_timeout(1000)

                preview_path = os.path.join(output_dir, f"visual-foundation-{vp['name']}.png")
                page.screenshot(path=preview_path, full_page=True)
                print(f"[SAVED] {preview_path} ({vp['width']}x{vp['height']})")

                # 2. Public Landing Page
                landing_url = f"{BASE_URL}/"
                page.goto(landing_url, wait_until="networkidle")
                page.wait_for_timeout(1000)

                landing_path = os.path.join(output_dir, f"landing-page-{vp['name']}.png")
                page.screenshot(path=landing_path, full_page=True)
                print(f"[SAVED] {landing_path} ({vp['width']}x{vp['height']})")

                context.close()

            browser.close()
            print("[SUCCESS] All screenshots captured successfully.")

    finally:
        if server_proc:
            print("[PREVIEW] Stopping spawned Vite server...")
            try:
                os.killpg(os.getpgid(server_proc.pid), signal.SIGTERM)
            except Exception:
                pass

if __name__ == "__main__":
    main()

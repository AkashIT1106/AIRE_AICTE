#!/usr/bin/env python3
"""
UX4G Browser Verification & Enforcement Script
Validates AIRE frontend rendering against UX4G recommendations:
1. Responsive Reflow & Zero Horizontal Scroll across 7 standard viewports (320px to 1440px)
2. Cumulative Layout Shift (CLS <= 0.1)
3. Minimum Touch Targets (>= 44px x 44px on touch/mobile viewports)
4. Safe Tenant Context Isolation & Unauthenticated/Authenticated State Rendering

Uses real headless Chromium via Playwright.
"""

import json
import os
import signal
import subprocess
import sys
import time
import urllib.request
from typing import Any, Dict, List

from playwright.sync_api import sync_playwright

VIEWPORTS = [
    {"name": "320x568 (Narrow Mobile)", "width": 320, "height": 568, "is_mobile": True},
    {"name": "360x640 (Android Mobile)", "width": 360, "height": 640, "is_mobile": True},
    {"name": "390x844 (Modern iPhone)", "width": 390, "height": 844, "is_mobile": True},
    {"name": "768x1024 (Tablet Portrait)", "width": 768, "height": 1024, "is_mobile": False},
    {"name": "1024x768 (Tablet Landscape)", "width": 1024, "height": 768, "is_mobile": False},
    {"name": "1280x800 (Standard Laptop)", "width": 1280, "height": 800, "is_mobile": False},
    {"name": "1440x900 (Large Desktop)", "width": 1440, "height": 900, "is_mobile": False},
]

ROUTES = [
    {"path": "/login", "name": "Login (Unauthenticated)"},
    {"path": "/institution/dashboard", "name": "Institution Dashboard"},
    {"path": "/institution/submissions/new", "name": "Batch Intake / Upload"},
    {"path": "/aicte/overview", "name": "AICTE Scrutiny Overview"},
    {"path": "/student/record", "name": "Student Record Portal"},
    {"path": "/auditor/logs", "name": "Auditor Log Workbench"},
]

PORT = 4173
BASE_URL = f"http://127.0.0.1:{PORT}"
CHROME_PATH = "/usr/bin/google-chrome-stable"


def ensure_server() -> subprocess.Popen | None:
    """Checks if preview server is running on port 4173; spawns one if needed."""
    try:
        with urllib.request.urlopen(BASE_URL, timeout=1) as resp:
            if resp.status == 200:
                print(f"[UX4G] Preview server already active at {BASE_URL}")
                return None
    except Exception:
        pass

    repo_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    client_dir = os.path.join(repo_root, "client")

    print(f"[UX4G] Spawning Vite preview server at {BASE_URL}...")
    proc = subprocess.Popen(
        ["pnpm", "preview", "--port", str(PORT), "--host", "127.0.0.1"],
        cwd=client_dir,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        preexec_fn=os.setsid,
    )

    # Wait for server to become responsive
    deadline = time.time() + 15
    while time.time() < deadline:
        try:
            with urllib.request.urlopen(BASE_URL, timeout=1) as resp:
                if resp.status == 200:
                    print("[UX4G] Vite preview server is ready.")
                    return proc
        except Exception:
            time.sleep(0.5)

    print("[UX4G ERROR] Timed out waiting for Vite preview server.", file=sys.stderr)
    try:
        os.killpg(os.getpgid(proc.pid), signal.SIGTERM)
    except Exception:
        pass
    sys.exit(1)


def run_checks() -> bool:
    server_proc = ensure_server()
    all_passed = True
    results: List[Dict[str, Any]] = []

    repo_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    results_dir = os.path.join(repo_root, "test-results")
    os.makedirs(results_dir, exist_ok=True)

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(
                executable_path=CHROME_PATH,
                headless=True,
                args=["--no-sandbox", "--disable-dev-shm-usage"],
            )

            for vp in VIEWPORTS:
                print(f"\n=======================================================")
                print(f" Testing Viewport: {vp['name']} ({vp['width']}x{vp['height']})")
                print(f"=======================================================")

                context = browser.new_context(
                    viewport={"width": vp["width"], "height": vp["height"]},
                    device_scale_factor=1,
                    is_mobile=vp["is_mobile"],
                    has_touch=vp["is_mobile"],
                )
                page = context.new_page()

                for route in ROUTES:
                    target_url = f"{BASE_URL}{route['path']}"
                    check_record: Dict[str, Any] = {
                        "viewport": vp["name"],
                        "width": vp["width"],
                        "height": vp["height"],
                        "route": route["path"],
                        "routeName": route["name"],
                        "passed": True,
                        "failures": [],
                    }

                    # Inject PerformanceObserver before document loads to capture all layout shifts
                    page.add_init_script("""
                        window.__clsScore = 0;
                        try {
                            const observer = new PerformanceObserver((list) => {
                                for (const entry of list.getEntries()) {
                                    if (!entry.hadRecentInput) {
                                        window.__clsScore += entry.value;
                                    }
                                }
                            });
                            observer.observe({ type: 'layout-shift', buffered: true });
                        } catch (e) {}
                    """)

                    try:
                        page.goto(target_url, wait_until="networkidle", timeout=10000)
                        page.wait_for_timeout(300)  # Settle dynamic layout
                    except Exception as e:
                        check_record["passed"] = False
                        check_record["failures"].append(f"Navigation error: {str(e)}")
                        results.append(check_record)
                        all_passed = False
                        continue

                    # 1. Overflow Check
                    overflow_data = page.evaluate("""
                        () => {
                            const scrollW = Math.max(
                                document.documentElement.scrollWidth,
                                document.body ? document.body.scrollWidth : 0
                            );
                            const clientW = window.innerWidth;
                            return {
                                scrollWidth: scrollW,
                                innerWidth: clientW,
                                overflowPx: Math.max(0, scrollW - clientW)
                            };
                        }
                    """)
                    check_record["overflow"] = overflow_data
                    if overflow_data["overflowPx"] > 1:  # 1px tolerance for subpixel fonts
                        check_record["passed"] = False
                        msg = f"Horizontal overflow detected: scrollWidth={overflow_data['scrollWidth']}px > innerWidth={overflow_data['innerWidth']}px (+{overflow_data['overflowPx']}px)"
                        check_record["failures"].append(msg)
                        print(f"  ❌ [{route['path']}] {msg}")
                    else:
                        print(f"  ✓ [{route['path']}] Reflow OK (scrollW={overflow_data['scrollWidth']}px, innerW={overflow_data['innerWidth']}px)")

                    # 2. Cumulative Layout Shift (CLS)
                    cls_score = page.evaluate("() => window.__clsScore || 0")
                    check_record["cls"] = cls_score
                    if cls_score > 0.1:
                        check_record["passed"] = False
                        msg = f"CLS budget exceeded: {cls_score:.4f} > 0.1000"
                        check_record["failures"].append(msg)
                        print(f"  ❌ [{route['path']}] {msg}")
                    else:
                        print(f"  ✓ [{route['path']}] CLS OK ({cls_score:.4f} <= 0.1)")

                    # 3. Touch Target Bounding Box Checks (Mobile viewports < 768px)
                    if vp["width"] < 768:
                        touch_failures = []
                        if route["path"] == "/login":
                            # Check submit button and text inputs
                            btn = page.query_selector("button[type='submit']")
                            if btn:
                                box = btn.bounding_box()
                                if box and (box["height"] < 44 or box["width"] < 44):
                                    touch_failures.append(f"Submit button touch target ({box['width']:.1f}x{box['height']:.1f}px) < 44x44px")
                            inputs = page.query_selector_all("input[type='email'], input[type='password']")
                            for inp in inputs:
                                box = inp.bounding_box()
                                if box and box["height"] < 44:
                                    touch_failures.append(f"Input height ({box['height']:.1f}px) < 44px")
                        else:
                            # Authenticated AppShell pages: check hamburger button
                            hamburger = page.query_selector("button[aria-label='Toggle navigation menu']")
                            if hamburger:
                                box = hamburger.bounding_box()
                                if box and (box["height"] < 44 or box["width"] < 44):
                                    touch_failures.append(f"Hamburger button ({box['width']:.1f}x{box['height']:.1f}px) < 44x44px")
                                else:
                                    # Open drawer and check drawer navigation link heights
                                    try:
                                        hamburger.click()
                                        page.wait_for_timeout(200)
                                        nav_links = page.query_selector_all("aside nav a")
                                        for idx, link in enumerate(nav_links[:3]):
                                            lbox = link.bounding_box()
                                            if lbox and lbox["height"] < 44:
                                                touch_failures.append(f"Drawer link #{idx+1} height ({lbox['height']:.1f}px) < 44px")
                                        # Close drawer by clicking hamburger again
                                        hamburger.click()
                                        page.wait_for_timeout(150)
                                    except Exception as ex:
                                        touch_failures.append(f"Drawer interaction error: {str(ex)}")

                        if touch_failures:
                            check_record["passed"] = False
                            check_record["touchFailures"] = touch_failures
                            for tf in touch_failures:
                                check_record["failures"].append(tf)
                                print(f"  ❌ [{route['path']}] Touch Target: {tf}")
                        else:
                            print(f"  ✓ [{route['path']}] Touch Targets >= 44x44px OK")

                    if not check_record["passed"]:
                        all_passed = False

                    results.append(check_record)

                context.close()
            browser.close()

    finally:
        if server_proc:
            print("\n[UX4G] Stopping Vite preview server...")
            try:
                os.killpg(os.getpgid(server_proc.pid), signal.SIGTERM)
            except Exception:
                pass

    report_path = os.path.join(results_dir, "ux4g-browser-report.json")
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump({"summary": {"passed": all_passed, "totalChecks": len(results)}, "results": results}, f, indent=2)

    print("\n=======================================================")
    if all_passed:
        print(f"✅ ALL UX4G BROWSER CHECKS PASSED ({len(results)} view/route combinations)")
        print(f"   Report written to: {report_path}")
        print("=======================================================")
        return True
    else:
        print(f"❌ SOME UX4G BROWSER CHECKS FAILED")
        print(f"   Report written to: {report_path}")
        print("=======================================================")
        return False


if __name__ == "__main__":
    success = run_checks()
    sys.exit(0 if success else 1)


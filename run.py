import os
import sys
import time
import signal
import threading
import subprocess
import webbrowser
from app import create_app

# WSGI application instance for Vercel & production servers
app = create_app()

# Set up paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(BASE_DIR, "motion-bloom-works")

def safe_print(text):
    """Safely prints text avoiding Windows cp1252 UnicodeEncodeError."""
    try:
        print(text)
    except UnicodeEncodeError:
        print(text.encode("ascii", "replace").decode("ascii"))

def print_banner():
    safe_print("\n" + "=" * 68)
    safe_print("  [*] RECOVERY PATH - UNIFIED FULL-STACK APPLICATION")
    safe_print("=" * 68)
    safe_print("  [>] Live Application URL : http://localhost:8080/")
    safe_print("      (Unified React Frontend + Gemini AI + Backend Suite)")
    safe_print("=" * 68)
    safe_print("  [i] Opening http://localhost:8080/ in your browser...")
    safe_print("  [i] Press Ctrl+C at any time to shut down the application.")
    safe_print("=" * 68 + "\n")

def run_flask():
    """Runs the Flask API backend in a background thread."""
    try:
        # Run Flask without Werkzeug reloader to prevent duplicate threads
        app.run(host="127.0.0.1", port=5000, debug=False, use_reloader=False)
    except Exception as e:
        safe_print(f"[Flask Backend Error] {e}")

def open_browser_delayed(url="http://localhost:8080/", delay=1.8):
    """Opens the modern frontend in the default browser after a short delay."""
    time.sleep(delay)
    try:
        webbrowser.open(url)
    except Exception:
        pass

def main():
    # Check if user specifically requested flask only
    if "--flask-only" in sys.argv:
        safe_print("[Recovery Path] Starting Flask backend only on http://127.0.0.1:5000/...")
        app.run(debug=True, port=5000)
        return

    # Check that motion-bloom-works directory exists
    if not os.path.isdir(FRONTEND_DIR):
        safe_print(f"[Error] Frontend directory not found at {FRONTEND_DIR}")
        app.run(debug=True, port=5000)
        return

    # Start Flask backend in a daemon thread
    flask_thread = threading.Thread(target=run_flask, daemon=True)
    flask_thread.start()

    # Launch browser opener in background
    if "--no-browser" not in sys.argv:
        browser_thread = threading.Thread(target=open_browser_delayed, daemon=True)
        browser_thread.start()

    print_banner()

    # Determine command to start React frontend
    npm_cmd = "npm.cmd" if sys.platform == "win32" else "npm"
    frontend_process = None

    try:
        frontend_process = subprocess.Popen(
            [npm_cmd, "run", "dev"],
            cwd=FRONTEND_DIR,
            shell=(sys.platform == "win32")
        )
        frontend_process.wait()
    except KeyboardInterrupt:
        safe_print("\n[Recovery Path] Gracefully shutting down servers...")
    finally:
        if frontend_process and frontend_process.poll() is None:
            if sys.platform == "win32":
                try:
                    subprocess.run(
                        ["taskkill", "/F", "/T", "/PID", str(frontend_process.pid)],
                        capture_output=True
                    )
                except Exception:
                    frontend_process.kill()
            else:
                frontend_process.terminate()
        safe_print("[Recovery Path] All servers stopped cleanly.\n")

if __name__ == "__main__":
    main()

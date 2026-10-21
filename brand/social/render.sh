#!/bin/sh
# Render the five WhatsApp status slides (1080×1920 PNG) with headless Chrome. Run from this folder.
CHROME="${CHROME:-/c/Program Files/Google/Chrome/Application/chrome.exe}"
for i in 1 2 3 4 5; do
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --window-size=1080,1920 \
    --virtual-time-budget=3000 --screenshot="$(pwd -W 2>/dev/null || pwd)/netra-status-$i.png" "file:///$(pwd -W 2>/dev/null || pwd)/status.html?s=$i" >/dev/null 2>&1
done
ls -la netra-status-*.png

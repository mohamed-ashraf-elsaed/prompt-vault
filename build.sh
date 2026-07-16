#!/usr/bin/env bash
# Build the Chrome Web Store upload package (runtime files only).
set -euo pipefail
cd "$(dirname "$0")"
rm -f promptvault.zip
zip -r promptvault.zip manifest.json src icons -x ".*" -x "*/.*"
echo
echo "Built promptvault.zip:"
unzip -l promptvault.zip

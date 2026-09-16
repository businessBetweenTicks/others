#!/bin/sh
# Rebuild the deployable zip from the tracked source in site/.
# The zip itself is deliberately not committed — it would go stale and
# someone would deploy the old one.
set -e
cd "$(dirname "$0")"
rm -f nura-site.zip
( cd site && zip -qr ../nura-site.zip . -x "_dev/*" ".shots/*" ".gitignore" )
echo "nura-site.zip  $(du -h nura-site.zip | cut -f1)  — drop it on app.netlify.com/drop"

# iPhone home-screen icon test

Run this after the fix has been merged and the Pages deployment has completed. This tests Safari's Add to Home Screen sheet, which browser automation on a computer cannot confirm.

1. If you have practice progress to keep, open TibReading and use **Settings → Export progress JSON**; save the file to Files.
2. On the iPhone Home Screen, press and hold the old TibReading icon. Choose **Remove App → Delete App** and confirm. If iOS treats it as a bookmark, choose **Delete Bookmark** instead. Removing only its Home Screen placement leaves the existing installation in place.
3. Open **Safari**. Open the tab switcher, select **Private**, and open a new Private tab.
4. Enter **https://donandrutto.github.io/TibReading/** directly. Wait for the app to finish loading. Use Safari itself rather than a link opened inside another app.
5. Tap **Share → Add to Home Screen**. Check the icon on the Add to Home Screen sheet: it should remain the cream Tibetan ཨ and gold book on maroon, rather than changing to a “T”. If shown, leave **Open as Web App** enabled.
6. Tap **Add**. Check the icon on the Home Screen, then tap it and confirm TibReading opens.
7. If the saved course progress is absent, use **Settings → Import progress JSON** with the file saved in step 1.

If the icon still changes to “T”, report the iOS version and whether the switch occurs before or after tapping Add. The data-URI fallback is deliberately not enabled until the early plain-link + correctly encoded PNG approach has been tested on the affected iPhone.

## Inspect the served head

After deployment:

```sh
curl -fsSL 'https://donandrutto.github.io/TibReading/' -o /tmp/tibreading-head.html
head -c 1024 /tmp/tibreading-head.html
```

The first head entries should be:

```html
<meta charset="utf-8" />
<link rel="apple-touch-icon" href="./apple-touch-icon.png">
<link rel="apple-touch-icon" sizes="180x180" href="./icons/apple-touch-icon-<hash>.png">
```

Both Apple links must precede other link tags, inline styles and the large inline application script, and end within the first 1,024 bytes. The plain URL is intentional; the build versions only the second link. Both point to the same opaque, non-interlaced, sRGB-tagged 180×180 PNG.

The worker behavior version is 5. All icon URLs use network-first fetching with HTTP cache revalidation. Valid PNG/SVG responses refresh the cache; errors and non-image responses never replace good cached icons. A valid cached icon still works offline. `npm run check:install` verifies head offsets, PNG chunks/pixels, stale-cache replacement, and failed-cache rejection with the origin server stopped.

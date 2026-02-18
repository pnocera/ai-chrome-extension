# Chrome Web Store Publishing Checklist

1. Register a developer account in the Chrome Web Store Developer Dashboard and pay the one-time registration fee.
2. Enable 2-step verification on the Google account you will publish from.
3. Prepare a clean ZIP of your extension folder, with `manifest.json` at the ZIP root (not inside another parent folder).
4. In Developer Dashboard, click **Add new item** and upload the ZIP.
5. Complete required sections:
   - **Store listing**: title, description, icons, screenshots.
   - **Privacy**: single purpose, permission justifications, data-use disclosures, privacy policy link if needed.
   - **Distribution**: public/unlisted, regions.
   - **Test instructions**: steps reviewers need.
6. Click **Submit for review**.
7. Optionally choose deferred publishing (review first, publish manually later).
8. Monitor review status and respond to policy feedback if needed.

## Useful links

- https://developer.chrome.com/docs/webstore/register/
- https://developer.chrome.com/docs/webstore/publish/
- https://developer.chrome.com/docs/webstore/cws-dashboard-privacy/
- https://developer.chrome.com/docs/webstore/program-policies/listing-requirements
- https://developer.chrome.com/docs/webstore/using-api
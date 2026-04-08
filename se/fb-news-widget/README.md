# Facebook Recent News widget

## Files
- `index.html` — front-end widget you can host on GitHub Pages or embed in an iframe.
- `fetch-facebook-posts.js` — server-side script that pulls recent Facebook posts from the Graph API.
- `.github/workflows/update-facebook-feed.yml` — GitHub Action to refresh `fb-posts.json` every 30 minutes.

## Basic setup
1. Create a Meta app.
2. Generate a Page access token for your Page.
3. Add `FB_PAGE_ID` and `FB_PAGE_ACCESS_TOKEN` as GitHub repository secrets.
4. Commit these files to a GitHub Pages repo.
5. Turn on GitHub Pages.
6. Use the hosted `index.html` URL in an iframe on your site.

## Example iframe embed
```html
<iframe
  src="https://YOUR-ORG.github.io/fb-news-widget/"
  title="Recent news"
  style="width:100%;min-height:1400px;border:0;overflow:hidden;"
  loading="lazy">
</iframe>
```

## Example direct embed approach
If your CMS supports custom HTML and JS, you can copy the markup from `index.html` directly into a page block and point `dataUrl` to your hosted `fb-posts.json` file.

# envoy.com Webflow Website Scripts

> :warning: **this repo is public**: Do not include any sensitive code here.

## Intro

For hosting public scripts used on envoy.com webflow website

These scripts are used for various purposes including but not limited to:

- Handling what happens after form submissions (/utils/form-handlers.js)
- Table of contents on the blog
- Marketo CSS styles
- Calculator component on Virtual Front Desk page
- Trigger Chili Piper booking tool on events template pages

## Setup

The repo has a Github action (auto-tag.yml) to automatically manage versions.

Versions are tracked in the .version file as an auto-incrementing integer. Each time you push code, the version will update by 1.

Every time you push to the main branch, the Github action creates a tag.

With the tag, you can create new releases and use jsdelivr to serve the scripts.

for example, to use the form-handlers.js script you can use the following URL:

```
https://cdn.jsdelivr.net/gh/envoy/webflow-website@<tag>/src/utils/form-handlers.js
```

In Webflow site-wide custom code settings, you'll see this:

```
<script defer src='https://cdn.jsdelivr.net/gh/envoy/webflow-website@30/src/utils/form-handlers.js' type="text/javascript"></script>
```

It's a minimal approach to version control and serving scripts to the website.

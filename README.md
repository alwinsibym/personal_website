# Alwin Siby: Personal Portfolio

Live site: https://alwinsibym.github.io/personal_website/

A responsive portfolio for an MCA student and web developer. It covers projects, skills, education and contact details, and pulls recent repositories from GitHub.

## Features

- Responsive layout from phones to wide desktops
- Dark and light themes, following the system setting and remembered after a manual switch
- Scroll progress shown as a kasavu-style gold stripe
- Project grid with filters (Web, AI agents, Developer tools)
- "Latest on GitHub" panel and a "More repositories" list, loaded live from the GitHub API and cached for 30 minutes, with a static fallback if the API is unavailable
- Contact form that opens the visitor's email app with the message filled in
- Keyboard navigation, visible focus, skip link and reduced-motion support

## Tech

Plain HTML, CSS and JavaScript. No build step and no dependencies, so it runs as-is on GitHub Pages. Fonts (Bricolage Grotesque, Hanken Grotesk, Noto Sans Malayalam) load from Google Fonts.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page content and structure |
| `style.css` | Design tokens, layout, themes, animation |
| `script.js` | Theme, menu, filters, GitHub data, contact form |

## Run locally

Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

## Update the content

- **Projects:** copy an `<article class="card">` block in `index.html`. Set `data-tags` to any of `web`, `ai`, `tools`. Add the repository name to the `FEATURED` list in `script.js` to keep the two in sync.
- **More repositories:** the list under the project cards shows the repositories named in `MORE` in `script.js`, with descriptions and languages read from GitHub.
- **Latest on GitHub:** shows your four most recently pushed repositories. Add names to `HIDE` in `script.js` to leave one out.
- **Colors:** edit the variables at the top of `style.css`.

## Contact

- Email: alwinsiby123@gmail.com
- LinkedIn: https://www.linkedin.com/in/alwin-siby/
- GitHub: https://github.com/alwinsibym

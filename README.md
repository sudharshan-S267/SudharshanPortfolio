# Sudharshan S — Portfolio

Professional portfolio website showcasing skills, projects, achievements, and contact information.

## Features

- **Home** — Hero with stats, CTA buttons, and profile card
- **About** — Bio, career objective, education, location, languages
- **Skills** — Languages, frontend, data/BI, and concepts
- **Projects** — All four resume projects with details
- **Achievements** — Competition timeline and certifications
- **Contact** — Email, phone, location, GitHub, and contact form

## Local preview

Open `index.html` in a browser, or run a local server:

```bash
# Python
python -m http.server 8080

# Node (npx)
npx serve .
```

Then visit `http://localhost:8080`

## Deploy to GitHub Pages

1. Create a repo (e.g. `myportfolio`) on GitHub
2. Push these files to the `main` branch
3. Go to **Settings → Pages**
4. Source: **Deploy from branch** → `main` → `/ (root)`
5. Your site will be live at `https://<username>.github.io/myportfolio/`

## Files

| File        | Purpose                    |
|-------------|----------------------------|
| `index.html`| Page structure & content   |
| `styles.css`| Styling & responsive layout|
| `script.js` | Navigation & interactions  |

## Contact form → Google Sheets

Visitor submissions from **Get in Touch** are saved to a Google Sheet.

### Setup (one time)

1. **Create a Google Sheet** at [sheets.google.com](https://sheets.google.com)
2. Rename the first tab to **Responses**
3. Open **Extensions → Apps Script**
4. Delete any default code and paste everything from `google-apps-script.js`
5. Replace `PASTE_YOUR_SPREADSHEET_ID_HERE` with your Sheet ID  
   (from the URL: `https://docs.google.com/spreadsheets/d/SHEET_ID/edit`)
6. **Save** the project, then **Deploy → New deployment**
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Click **Deploy**, authorize when prompted, and **copy the Web App URL**
8. Open `script.js` — `GOOGLE_SCRIPT_URL` is already set to your deployment URL

Each submission adds a row: **Timestamp · Name · Email · Message**

### If the form shows success but the sheet stays empty

Your Apps Script still needs the real **Spreadsheet ID**:

1. Open Apps Script → replace `PASTE_YOUR_SPREADSHEET_ID_HERE` with your sheet ID
2. **Deploy → Manage deployments → Edit → New version → Deploy** (required after every script change)
3. Submit the form again and refresh the sheet

### Testing locally

Open the site with a local server (not double-clicking the HTML file):

```bash
python -m http.server 8080
```

Then visit `http://localhost:8080`

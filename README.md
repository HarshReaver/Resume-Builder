# Resume Builder

A single-page app: fill in a form and watch a clean A4 resume build itself. Everything runs in your browser. Nothing is uploaded; your data stays on your device.

## How to run

No install, no build step, no internet needed.

1. Open the folder and double-click `index.html` (Chrome or Edge recommended; Firefox and Safari also work).
2. To use it like an app, bookmark the page, or in Chrome/Edge choose "Install page as app" from the menu if offered.

Files: `index.html` (page), `style.css` (app and 3 templates and print rules), `app.js` (logic), `sample.js` (fake demo data).

## Features

- Form for name and contact, summary, experience, education, projects, skills and certifications, with Add and Remove buttons for entries.
- Live A4 preview beside the form (stacked under it on phones; the sheet scales to fit the screen).
- 3 templates: Classic (serif, centered), Modern (dark header block, chips), Timeline (dates in a left column).
- Reorder sections by dragging a section header, or with the Move up / Move down buttons (works on touch screens).
- Print / Save as PDF: uses the browser's own print dialog with print CSS for A4, so text stays real, selectable text.
- Save data as a `.json` file and load it back. Autosaves in the browser (localStorage) as you type.
- Load sample: fake data long enough for 2 pages. Clear all: empties the form.

## Making the PDF

Click Print / Save as PDF, then in the print dialog choose destination "Save as PDF", paper size A4, margins Default, and turn off "Headers and footers". Scale should be 100%.

## Done when: how to check each item

1. **A long resume breaks cleanly across 2 pages (no entry cut in half).** Click Load sample, then Print / Save as PDF. In the print preview, look at the page break: each job, project and degree must be whole on one page, and no section heading is left alone at the bottom of a page. Repeat with each of the 3 templates.
2. **Text in the PDF can be selected and copied.** Save the PDF, open it in a PDF viewer or browser, select a paragraph with the mouse, copy it and paste it into a text editor. The text should paste as normal words.
3. **Loading the saved file restores everything.** Fill in or load the sample, change the template and move a section. Click Save data (.json). Click Clear all, then Load data (.json) and pick the file. All fields, entries, the section order and the template come back.
4. **It works with Wi-Fi off.** Turn Wi-Fi off (or use airplane mode), open `index.html` from the folder, and use every feature above. The app loads no outside files.

Also try: refresh the page after typing (autosave brings your data back), and open it on a phone-sized window to see the stacked layout.

## Notes

- Autosave is per browser and per computer. Use Save data (.json) to move a resume to another device or to keep a backup.
- Dragging with the mouse works on desktop; touch screens do not support dragging, so use the Move up / Move down buttons there.
- The page count under the preview is an estimate; the print preview shows the exact result.

# Cells - a Google Sheets clone

[Link to live site][live-site]

[live-site]: http://cells.edmund.io

A clone of Google Sheets built on Rails and Backbone. Works in Chrome, and works in Firefox and Safari with some styling imperfections.

![screenshot]

## Features

- [x] Formulae are evaluated recursively, and cells are updated using dependency graph
- [x] Edits are autosaved to the server efficiently by treating cells as individual models
- [x] Users can create accounts (optionally using OAuth provider), and add a user profile photo (stored using AWS)
- [x] Spreadsheets can be navigated and edited using either mouse or keyboard
- [x] Users can drag to resize rows and columns (implemented using JQuery UI plugin), with changes saved to the server
- [x] Users can copy, cut and paste cells, with copied formulae translated for their new location
- [x] Spreadsheets can be shared with other users
- [x] Users can edit a spreadsheet simultaneously, seeing other edits appear live (currently excluding deletion of cells, and resizing of columns and rows)

### Features not yet achieved
- [ ] Copy and paste to and from other applications
- [ ] Deletion of cells and resizing of columns and rows when editing simultaneously with another user
- [ ] Public spreadsheets accessible to any other person with the link
- [ ] Formating of cells with custom background and/or text colour, and different number formats
- [ ] Usage of $ in formulae to prevent translation of references.
- [ ] A thousand other Google Sheets features.

[screenshot]: ./screenshot.jpg

# Cells - a Google Sheets clone

[Link to live site][live-site]

[live-site]: http://cells.edmund.io

A clone of Google Sheets built on Rails and Backbone. Works in Chrome, and works in Firefox and Safari with some small styling imperfections.

![screenshot]

## Features

- Formulae are evaluated recursively, and cells are updated using dependency graph
- Edits are autosaved to the server efficiently by treating cells as individual models
- Users can create accounts (optionally using OAuth provider), and add a user profile photo (stored using AWS)
- Users can edit a spreadsheet simultaneously, seeing other edits appear live (uses [Pusher](https://pusher.com/); currently excluding resizing of columns and rows)
- Spreadsheets can be navigated and edited using either mouse or keyboard
- Users can drag to resize rows and columns (implemented using JQuery UI plugin), with changes saved to the server
- Users can copy, cut and paste cells, with copied formulae translated for their new location
- Spreadsheets can be shared with other users


### Features not yet achieved
- [ ] Copy and paste to and from other applications
- [ ] Resizing of columns and rows when editing simultaneously with another user
- [ ] Public spreadsheets accessible to any other person with the link
- [ ] Formatting of cells with custom background and/or text colour, and different number formats
- [ ] Usage of $ in formulae to prevent translation of references.
- [ ] A thousand other Google Sheets features.

[screenshot]: ./screenshot.jpg

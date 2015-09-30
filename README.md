# Cells - a Google Sheets clone

[Link to live site][live-site]

[live-site]: http://cells.edmund.io

A clone of Google Sheets built on Rails and Backbone. Works in Chrome, and works in Firefox and Safari with some small styling bugs. Users can:

- [x] Create accounts, log in (optionally using OAuth provider), log out, add a user profile photo
- [x] Create new spreadsheets
- [x] See a list of their spreadsheets
- [x] Navigate a spreadsheet with the mouse or keyboard
- [x] Input a formula into a cell, and see it calculated immediately upon pressing enter
- [x] See any changes to a cell have an immediate effect on other cells that reference it
- [x] Select a cell with the mouse or keyboard to insert a reference to it into the formula currently being edited
- [x] Select multiple cells with the mouse or keyboard to insert a reference to them into the formula currently being edited
- [x] Have their work be autosaved to the server immediately following any change
- [x] Drag to resize rows and columns
- [x] Copy, cut and paste cells
- [x] Share a spreadsheet with other users
- [x] Edit a spreadsheet simultaneously with another user, seeing their edits appear live (currently excluding deletion of cells, and resizing of columns and rows)

### Features not yet achieved
- [ ] Make a spreadsheet public so that any other person with the link can access it
- [ ] Format cells with custom background and/or text colour, and different number formats.
- [ ] Access spreadsheets through randomly generated spreadsheet URLs, to ensure security of publicly shared spreadsheets

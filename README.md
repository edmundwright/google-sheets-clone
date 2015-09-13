# Google Sheets Clone (final name TBD)

[Heroku link][heroku]

[heroku]: http://google-sheets-clone.herokuapp.com

## Minimum Viable Product
A clone of Google Sheets built on Rails and Backbone. Users can:

- [ ] Create accounts
- [ ] Create sessions (log in)
- [ ] Create new spreadsheets
- [ ] See a list of their spreadsheets
- [ ] Input a formula into a cell, and see it calculated immediately upon pressing enter
- [ ] See any changes to a cell have an immediate effect on other cells that reference it
- [ ] Select a cell to insert a reference to it into the formula currently being edited
- [ ] Select multiple cells to insert a reference to them into the formula currently being edited
- [ ] Select a cell by clicking on it
- [ ] Select multiple cells by clicking and dragging
- [ ] Select whole rows or columns by clicking their headings
- [ ] Select cells using the keyboard
- [ ] Have their work be autosaved to the server immediately following any change
- [ ] Share a spreadsheet with other users
- [ ] See a list of the spreadsheets shared with them
- [ ] Make a spreadsheet public so that any other person with the link can access it
- [ ] Click buttons to insert operations into formula currently being edited

## Design Docs
* [View Wireframes][views]
* [DB schema][schema]

[views]: ./docs/views.md
[schema]: ./docs/schema.md

## Implementation Timeline

### Phase 1: User Authentication, Spreadsheet Creation (~1 day)
I will implement user authentication in Rails based on the practices learned at
App Academy. By the end of this phase, users will be able to create spreadsheets using
a simple text form in a Backbone view, view an index of their spreadsheets, view a show page for each spreadsheet (at this point only displaying the spreadsheet's title), edit their spreadsheet's name, and destroy their spreadsheet. The most important part of this phase will
be pushing the app to Heroku and ensuring that everything works before moving on
to phase 2.

[Details][phase-one]

### Phase 2: Viewing and editing spreadsheet (~1 day)
I will produce an HTML layout for presenting the cells of the spreadsheet, and write JavaScript to fetch the cells belonging to the current spreadsheet, and inject them into the HTML grid. I will then allow cells to be edited, and write the Backbone code to save the cell to the server immediately after editing.

[Details][phase-two]

### Phase 3: Evaluating formulae (~1.5 days)
I will write JavaScript to detect that a formula is entered into a cell (by checking if it begins with '='), and evaluate that formula, rendering the result into the cell's html view. This has the potential to spiral into days of work, so I will restrict myself to evaluating the most simple formulae (those involving +, -, *, / or SUM). I will further write JavaScript that, after a cell is edited, checks for other cells that reference it and re-evaluate and render them all.

[Details][phase-three]

### Phase 4: Selecting cells with the mouse (~1.5 days)
I'll start by allowing users to, while editing a formula, click on another cell to insert a reference to the cell into that formula. I'll then move onto enabling selection of multiple cells. The first and most straightforward method of selection will be to click a row or column heading to select that entire row or column. I will then move onto clicking and dragging with the mouse to select multiple cells.

[Details][phase-four]

### Phase 5: Selecting cells with the keyboard (~1 day)
I'll implement selecting navigating the spreadsheet using the arrow keys, and selecting cells by holding shift or command and using the arrow keys. This will be implemented by listening to key up and key down events.

[Details][phase-five]

### Phase 6: Sharing spreadsheets and making spreadsheets public (~0.5 day)
I'll implement sharing of spreadsheets with other users, and making spreadsheets public.

[Details][phase-six]

### Phase 7: Buttons (~0.5 day)
I'll implement buttons that can be used to insert operations into the formula currently being edited.

[Details][phase-seven]

### Bonus Features (TBD)
- [ ] Randomly generated spreadsheet URLs, to ensure security of publicly shared spreadsheets
- [ ] Drag to resize rows and columns
- [ ] Edit a spreadsheet simultaneously with another user, seeing their edits appear live
- [ ] Format cells with custom background and/or text colour

[phase-one]: ./docs/phases/phase1.md
[phase-two]: ./docs/phases/phase2.md
[phase-three]: ./docs/phases/phase3.md
[phase-four]: ./docs/phases/phase4.md
[phase-five]: ./docs/phases/phase5.md
[phase-six]: ./docs/phases/phase6.md
[phase-seven]: ./docs/phases/phase7.md


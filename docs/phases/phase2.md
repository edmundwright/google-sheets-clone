# Phase 2: Viewing and editing spreadsheet

## Rails
### Models
* `Cell`

### Controllers
`API::CellsController` (`create`, `destroy`, `update`, `show`)

### Views
* api/cells/_cell.json.jbuilder (used when showing both spreadsheet and cell)
* api/cells/show.json.jbuilder

## Backbone
### Models
* `Spreadsheet` now parses nested `cells` association
* `Cell`

### Collections
* `Cells`

### Views
* `SpreadsheetShow` is now composite view containing `Cell` subviews.
* `Cell` (for showing or editing cell)

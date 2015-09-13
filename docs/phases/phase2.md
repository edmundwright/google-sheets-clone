# Phase 2: Viewing and editing spreadsheet

## Rails
### Models
* Cell

### Controllers
Api::CellsController (create, destroy, update, show)

### Views
* cells/_cell.json.jbuilder (used when showing both spreadsheet and cell)
* cells/show.json.jbuilder

## Backbone
### Models
* Spreadsheet now parses nested `cells` association
* Cell

### Collections
* Cells

### Views
* SpreadsheetShow now also containts Cell subviews.
* Cell (for showing or editing cell)

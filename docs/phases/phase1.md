# Phase 1: User Authentication, Spreadsheet Creation

## Rails
### Models
* `User`
* `Spreadsheet`

### Controllers
* `UsersController` (`create`, `new`)
* `SessionsController` (`create`, `new`, `destroy`)
* `API::SpreadsheetsController` (`create`, `index`, `show`, `update`, `destroy`)

### Views
* application.html.erb
* users/new.html.erb
* session/new.html.erb
* api/spreadsheets/index.json.jbuilder
* api/spreadsheets/show.json.jbuilder

## Backbone
### Models
* `Spreadsheet`

### Collections
* `Spreadsheets`

### Views
* `SpreadsheetIndex` (composite view containing `SpreadSheetIndexItem` subviews, and link to create and show new spreadsheet)
* `SpreadsheetIndexItem`
* `SpreadsheetShow`

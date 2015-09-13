# Phase 1: User Authentication, Basic Blogs and Posts

## Rails
### Models
* User
* Spreadsheet

### Controllers
* UsersController (create, new)
* SessionsController (create, new, destroy)
* Api::SpreadsheetsController (create, index, show, update, destroy)

### Views
* application.html.erb
* users/new.html.erb
* session/new.html.erb
* spreadsheets/index.json.jbuilder
* spreadsheets/show.json.jbuilder

## Backbone
### Models
* Spreadsheet

### Collections
* Spreadsheets

### Views
* SpreadsheetIndex
* SpreadsheetShow
* SpreadSheetTitleForm

## Gems/Libraries

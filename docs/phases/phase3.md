# Phase 3: Evaluating formulae

## Backbone

### Utils
* `FormulaEvaluator`

### Views
* `SpreadsheetShow` now listens for sync events on its `cells` collection, and re-evalutes (using `FormulaEvaluator`) all its cells, and re-renders `Cell` subviews where necessary.

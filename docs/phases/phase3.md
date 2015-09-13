# Phase 3: Evaluating formulae

## Backbone

### Utils
* `FormulaEvaluator`

### Views
* `SpreadsheetShow` now listens for sync events on each of its cells, and upon hearing re-evaluates (using `FormulaEvaluator`) all formulae in its cells, and re-renders `Cell` subviews where necessary.

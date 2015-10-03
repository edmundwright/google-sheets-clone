GoogleSheetsClone.Collections.Cells = Backbone.Collection.extend({
  model: GoogleSheetsClone.Models.Cell,

  initialize: function () {
    this._dependents = {};
  },

  comparator: function (firstCell, secondCell) {
    if (firstCell.get("row_index") < secondCell.get("row_index")) {
      return -1;
    } else if (firstCell.get("row_index") > secondCell.get("row_index")) {
      return 1;
    } else if (firstCell.get("col_index") < secondCell.get("col_index")) {
      return -1;
    } else {
      return 1;
    }
  },

  findByPos: function (pos) {
    var result = null;

    this.each(function (model) {
      if (model.get("row_index") === pos[0] &&
          model.get("col_index") === pos[1]) {
        result = model;
        return;
      }
    });

    return result;
  },

  lastUpdatedAt: function () {
    var mostRecentUpdate = 0;

    this.each(function (model) {
      var modelUpdate = model.get("updated_at");
      if (modelUpdate > mostRecentUpdate) {
        mostRecentUpdate = modelUpdate;
      }
    });

    return mostRecentUpdate;
  },

  dependents: function (pos) {
    var row = pos[0];
    var col = pos[1];
    var rowDependents = this._dependents[row];
    if (rowDependents) {
      var dependents = rowDependents[col];
      if (dependents) {
        return dependents;
      }
    }
    return {};
  },

  addDependent: function (pos, dependentPos) {
    var row = pos[0];
    var col = pos[1];
    var rowDependents = this._dependents[row];
    if (!rowDependents) {
      rowDependents = this._dependents[row] = {};
    }
    var cellDependents = rowDependents[col];
    if (!cellDependents) {
      cellDependents = rowDependents[col] = {};
    }

    var dependentRow = dependentPos[0];
    var dependentCol = dependentPos[1];
    var cellDependentsRow = cellDependents[dependentRow];
    if (!cellDependentsRow) {
      cellDependentsRow = cellDependents[dependentRow] = {};
    }
    cellDependentsRow[dependentCol] = true;
  },

  removeDependent: function (pos, dependentPos) {
    var row = pos[0];
    var col = pos[1];
    var dependentRow = dependentPos[0];
    var dependentCol = dependentPos[1];
    delete this._dependents[row][col][dependentRow][dependentCol];
  },

  evaluateAll: function () {
    this.each(function (cell) {
      if (cell.evaluation === undefined) {
        GoogleSheetsClone.evaluate(cell);
      }
    });
  }
});

GoogleSheetsClone.Models.Cell = Backbone.Model.extend ({
  initialize: function () {
    this._dependencies = [];
  },

  urlRoot: function () {
    return "/api/spreadsheets/" + this.get("spreadsheet_id") + "/cells";
  },

  contents: function () {
    if (this.get("contents_str") !== null) {
      return this.escape("contents_str");
    } else if (this.get("contents_int") !== null) {
      return this.get("contents_int");
    } else if (this.get("contents_flo") !== null) {
      return this.get("contents_flo");
    }
  },

  toJSON: function () {
    var json = Backbone.Model.prototype.toJSON.call(this);

    return {"cell": json};
  },

  addDependency: function (dependencyPos) {
    this._dependencies.push(dependencyPos);
    GoogleSheetsClone.cells.addDependent(dependencyPos, this.pos());
    var cycles = this.checkForCycles();
    if (cycles) {
      throw "cycleInDependencies";
    }
  },

  checkForCycles: function () {
    return this.indirectDependency(this.pos());
  },

  indirectDependency: function (pos) {
    var dependencyPos, dependencyCell;
    for (var i = 0; i < this._dependencies.length; i++) {
      dependencyPos = this._dependencies[i];
      if (dependencyPos[0] === pos[0] && dependencyPos[1] === pos[1]) {
        return true;
      }
      dependencyCell = GoogleSheetsClone.cells.findByPos(dependencyPos);
      if (dependencyCell && dependencyCell.indirectDependency(pos)) {
        return true;
      }
    }

    return false;
  },

  removeDependencies: function () {
    this._dependencies.forEach(function (dependencyPos) {
      GoogleSheetsClone.cells.removeDependent(dependencyPos, this.pos());
    }.bind(this));
    this._dependencies = [];
  },

  pos: function () {
    return [this.get("row_index"), this.get("col_index")];
  }
});

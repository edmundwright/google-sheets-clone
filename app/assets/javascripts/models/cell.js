GoogleSheetsClone.Models.Cell = Backbone.Model.extend ({
  initialize: function () {
    this.dependents = [];
  },

  urlRoot: function () {
    return "/api/spreadsheets/" + this.get("spreadsheet_id") + "/cells";
  },

  contents: function () {
    if (this.get("contents_str") !== null) {
      return this.get("contents_str");
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

  addDependent: function (dependent) {
    if (this.dependents.indexOf(dependent) === -1) {
      this.dependents.push(dependent);
    }
  }
});

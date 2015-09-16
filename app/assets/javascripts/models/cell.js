GoogleSheetsClone.Models.Cell = Backbone.Model.extend ({
  urlRoot: function () {
    return "/api/spreadsheets/" + this.get(spreadsheet_id) + "/cells";
  }
});

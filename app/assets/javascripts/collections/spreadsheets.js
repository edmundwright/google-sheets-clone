GoogleSheetsClone.Collections.Spreadsheets = Backbone.Collection.extend ({
  url: "/api/spreadsheets",

  model: GoogleSheetsClone.Models.Spreadsheet,

  comparator: function (spreadsheet) {
    return - Date.parse(spreadsheet.get("updated_at"));
  }
});

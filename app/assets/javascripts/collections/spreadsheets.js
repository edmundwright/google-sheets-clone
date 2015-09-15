GoogleSheetsClone.Collections.Spreadsheets = Backbone.Collection.extend ({
  url: "/api/spreadsheets",

  model: GoogleSheetsClone.Models.Spreadsheet
});

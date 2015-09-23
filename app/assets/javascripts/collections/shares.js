GoogleSheetsClone.Collections.Shares = Backbone.Collection.extend({
  model: GoogleSheetsClone.Models.Share,

  url: function () {
    return "/api/spreadsheets/" + this.get("spreadsheet_id") + "/shares";
  }
});

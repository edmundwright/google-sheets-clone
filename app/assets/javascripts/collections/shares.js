GoogleSheetsClone.Collections.Shares = Backbone.Collection.extend({
  model: GoogleSheetsClone.Models.Share,

  url: function () {
    return "/api/spreadsheets/" + this.spreadsheet.id + "/shares";
  },

  initialize: function (models, options) {
    this.spreadsheet = options.spreadsheet;
  }
});

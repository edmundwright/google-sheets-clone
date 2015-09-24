GoogleSheetsClone.Collections.Users = Backbone.Collection.extend({
  model: GoogleSheetsClone.Models.User
});

GoogleSheetsClone.Collections.CurrentEditors = GoogleSheetsClone.Collections.Users.extend({
  initialize: function (models, options) {
    this.currentSpreadsheet = options.currentSpreadsheet;
  },

  url: function () {
    return "/api/spreadsheets/" + this.currentSpreadsheet.id + "/current_editors";
  }
});

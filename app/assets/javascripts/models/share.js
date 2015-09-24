GoogleSheetsClone.Models.Share = Backbone.Model.extend ({
  urlRoot: function () {
    return "/api/spreadsheets/" + this.get("spreadsheet_id") + "/shares";
  },

  parse: function (response) {
    if (response.sharee) {
      this.sharee = new GoogleSheetsClone.Models.User(response.sharee);
      delete response.sharee;
    }

    return response;
  }
});

GoogleSheetsClone.Models.Spreadsheet = Backbone.Model.extend ({
  urlRoot: "/api/spreadsheets",

  parse: function (response) {
    if (response.owner) {
      this.owner = new GoogleSheetsClone.Models.User(response.owner);
      delete response.owner;
    }

    return response;
  }
});

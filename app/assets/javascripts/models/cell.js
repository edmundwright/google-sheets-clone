GoogleSheetsClone.Models.Cell = Backbone.Model.extend ({
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
  }
});

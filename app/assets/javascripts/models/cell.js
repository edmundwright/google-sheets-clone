GoogleSheetsClone.Models.Cell = Backbone.Model.extend ({
  urlRoot: function () {
    return "/api/spreadsheets/" + this.get("spreadsheet_id") + "/cells";
  },

  contents: function () {
    return this.get("contents_str") || this.get("contents_int") ||
      this.get("contents_flo");
  }
});

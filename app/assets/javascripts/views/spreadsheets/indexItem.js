GoogleSheetsClone.Views.SpreadsheetIndexItem = Backbone.View.extend({
  template: JST["spreadsheets/indexItem"],

  tagName: "li",

  render: function () {
    this.$el.html(this.template({
      spreadsheet: this.model
    }));

    return this;
  }
});

GoogleSheetsClone.Views.SpreadsheetShow = Backbone.View.extend({
  template: JST["spreadsheets/show"],

  initialize: function () {
    this.listenTo(this.model, "sync", this.render);
  },

  render: function () {
    debugger
    this.$el.html(this.template({
      spreadsheet: this.model
    }));

    return this;
  }
});

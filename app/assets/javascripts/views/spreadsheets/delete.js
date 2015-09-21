GoogleSheetsClone.Views.SpreadsheetDelete = Backbone.CompositeView.extend({
  template: JST["spreadsheets/delete"],

  className: "modal delete-spreadsheet",

  events: {
    "click button.delete-spreadsheet": "delete",
    "click button.close-modal": "close"
  },

  close: function () {
    this.remove();
  },

  delete: function () {
    this.model.destroy();
    this.remove();
  },

  render: function () {
    this.$el.html(this.template({
      spreadsheet: this.model
    }));
    return this;
  }
});

GoogleSheetsClone.Views.SpreadsheetIndexItem = Backbone.View.extend({
  template: JST["spreadsheets/indexItem"],

  tagName: "li",

  events: {
    "click": "show"
  },

  show: function () {
    Backbone.history.navigate("#spreadsheets/" + this.model.id, { trigger: true })
  },

  initialize: function (options) {
    this.today = options.today;
  },

  render: function () {
    this.$el.data("spreadsheet-id", this.model.id)

    this.$el.html(this.template({
      spreadsheet: this.model
    }));

    return this;
  },
});

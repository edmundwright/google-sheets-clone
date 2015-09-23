GoogleSheetsClone.Views.ShareIndexItem = Backbone.View.extend({
  template: JST["shares/indexItem"],

  tagName: "li",

  className: "share",

  render: function () {
    this.$el.html(this.template({
      spreadsheet: this.model
    }));

    return this;
  }
});

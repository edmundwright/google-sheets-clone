GoogleSheetsClone.Views.Cell = Backbone.View.extend({
  template: JST["cells/cell"],

  initialize: function () {
    this.$el.data("cell-id", this.model.id);
  },

  tagName: "li",

  className: "cell",

  render: function () {
    var contents = this.model.get("contents_str") ||
                   this.model.get("contents_int") ||
                   this.model.get("contents_flo");

    if (contents === null) {
      contents = "";
    }

    this.$el.html(this.template({
      contents: contents
    }));

    return this;
  }
});

GoogleSheetsClone.Views.Cell = Backbone.View.extend({
  template: JST["cells/cell"],

  initialize: function () {
    this.$el.data("cell-id", (this.model ? this.model.id : null));
    this.gettingInput = false;
  },

  tagName: "li",

  className: "cell",

  render: function () {
    if (this.model) {
      var contents = this.model.get("contents_str") ||
                     this.model.get("contents_int") ||
                     this.model.get("contents_flo");
    } else {
      var contents = "";
    }

    this.$el.html(this.template({
      contents: contents,
      gettingInput: this.gettingInput
    }));

    return this;
  }
});

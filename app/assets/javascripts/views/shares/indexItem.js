GoogleSheetsClone.Views.ShareIndexItem = Backbone.View.extend({
  template: JST["shares/indexItem"],

  tagName: "li",

  className: "share group",

  events: {
    "click .delete-share": "delete"
  },

  delete: function (e) {
    e.preventDefault();
    this.model.destroy();
  },

  render: function () {
    this.$el.html(this.template({
      share: this.model
    }));

    return this;
  }
});

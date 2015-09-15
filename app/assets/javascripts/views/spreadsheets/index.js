GoogleSheetsClone.Views.SpreadsheetsIndex = Backbone.View.extend({
  template: JST["spreadsheets/index"],

  initialize: function () {
    this.listenTo(this.collection, "sync", this.render);
  },

  render: function () {
    var content = this.template({
      spreadsheets: this.collection
    });

    this.$el.html(content);

    return this;
  }
});

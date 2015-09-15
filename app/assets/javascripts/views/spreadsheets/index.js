GoogleSheetsClone.Views.SpreadsheetIndex = Backbone.CompositeView.extend({
  template: JST["spreadsheets/index"],

  initialize: function () {
    this.listenTo(this.collection, "sync", this.render);
  },

  render: function () {
    this.$el.html(this.template());

    this.collection.each(function (model) {
      this.addSubview(
        "ul.spreadsheets",
        new GoogleSheetsClone.Views.SpreadsheetIndexItem({
          model: model
        })
      );
    }.bind(this))

    return this;
  }
});

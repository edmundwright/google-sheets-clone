GoogleSheetsClone.Views.ShareIndex = Backbone.CompositeView.extend({
  template: JST["shares/index"],

  className: "modal shares-index",

  events: {
    "click button.close-modal": "close"
  },

  initialize: function () {
    this.listenTo(this.collection, "sync destroy add", this.render);
  },

  close: function () {
    this.remove();
  },

  render: function () {
    this.$el.html(this.template({
      shares: this.collection
    }));

    this.collection.each(function(model) {
      this.addSubview(
        "ul.shares",
        new GoogleSheetsClone.Views.ShareIndexItem({
          model: model
        })
      );
    }.bind(this));

    return this;
  }
});

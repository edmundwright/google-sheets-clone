GoogleSheetsClone.Routers.Router = Backbone.Router.extend({
  initialize: function (options) {
    this.$rootEl = options.$rootEl
  },

  routes: {
    "": "index",
    "spreadsheets/:id": "show"
  },

  index: function () {
    var collection = new GoogleSheetsClone.Collections.Spreadsheets();
    collection.fetch();

    var view = new GoogleSheetsClone.Views.SpreadsheetIndex({
      collection: collection
    });

    this._swapView(view);
  },

  _swapView: function (newView) {
    this._currentView && this._currentView.remove();
    this._currentView = newView;
    this.$rootEl.html(newView.render().$el);
  }
});

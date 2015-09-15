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

  show: function (id) {
    var model = new GoogleSheetsClone.Models.Spreadsheet({
      id: id
    });
    model.fetch();

    var view = new GoogleSheetsClone.Views.SpreadsheetShow({
      model: model
    });

    this._swapView(view);
  },

  _swapView: function (newView) {
    this._currentView && this._currentView.remove();
    this._currentView = newView;
    debugger
    this.$rootEl.html(newView.render().$el);
  }
});

GoogleSheetsClone.Routers.Router = Backbone.Router.extend({
  initialize: function (options) {
    this.$rootEl = options.$rootEl,
    this.$title = options.$title
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
    this.$title.empty();
  },

  show: function (id) {
    var model = new GoogleSheetsClone.Models.Spreadsheet({
      id: id
    });
    model.fetch();

    var view = new GoogleSheetsClone.Views.SpreadsheetShow({
      model: model
    });

    GoogleSheetsClone.titleView = new GoogleSheetsClone.Views.SpreadsheetShowTitle({
      model: model
    });

    this._swapView(view);
    this.$title.html(GoogleSheetsClone.titleView.render().$el);
  },

  _swapView: function (newView) {
    this._currentView && this._currentView.remove();
    this._currentView = newView;
    this.$rootEl.html(newView.render().$el);
  }
});

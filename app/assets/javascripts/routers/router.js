GoogleSheetsClone.Routers.Router = Backbone.Router.extend({
  initialize: function (options) {
    this.$rootEl = options.$rootEl
  },

  routes: {
    "": "index",
    "spreadsheets/:id": "show"
  },

  index: function () {
    var spreadsheets = new GoogleSheetsClone.Collections.Spreadsheets();
    spreadsheet.fetch();

    var view = new GoogleSheetsClone.Views.SpreadsheetIndex({
      spreadsheets: spreadsheets
    });

    this._swapView(view);
  },

  _swapView: function (newView) {
    this._currentView && this._currentView.remove();
    this._currentView = newView;
    this.$rootEl.html(newView.render().$el);
  }
});

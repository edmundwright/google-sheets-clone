window.GoogleSheetsClone = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    new GoogleSheetsClone.Routers.Router({
      $rootEl: $("div#for-backbone"),
      $title: $("div#title-area"),
      $statusArea: $("div#status-area")
    });
    Backbone.history.start();
  }
};

$(document).ready(function(){
  GoogleSheetsClone.initialize();
});

window.GoogleSheetsClone = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    new GoogleSheetsClone.Routers.Router({
      $rootEl: $("main")
    });
    Backbone.history.start();
  }
};

$(document).ready(function(){
  GoogleSheetsClone.initialize();
});

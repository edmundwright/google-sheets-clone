window.GoogleSheetsClone = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    GoogleSheetsClone.currentUser = new GoogleSheetsClone.Models.CurrentUser();
    GoogleSheetsClone.currentUser.fetch();

    GoogleSheetsClone.pusher = new Pusher('762d3f518b9fa4b77548');

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

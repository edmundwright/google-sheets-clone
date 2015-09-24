GoogleSheetsClone.Models.User = Backbone.Model.extend ();

GoogleSheetsClone.Models.CurrentUser = GoogleSheetsClone.Models.User.extend ({
  url: "/session"
});

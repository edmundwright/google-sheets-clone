GoogleSheetsClone.Models.User = Backbone.Model.extend ();

GoogleSheetsClone.Models.CurrentUser = GoogleSheetsClone.Models.User.extend ({
  url: "/session",

  toJSON: function () {
    var json = Backbone.Model.prototype.toJSON.call(this);

    delete json.id;
    delete json.email;
    delete json.name;
    return json;
  }
});

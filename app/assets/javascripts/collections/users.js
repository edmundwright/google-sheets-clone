GoogleSheetsClone.Collections.Users = Backbone.Collection.extend({
  model: GoogleSheetsClone.Models.User,

  // getOrFetch: function (id) {
  //   var model = this.get(id);
  //
  //   if (!model) {
  //     model = new this.model({ id: id });
  //     model.fetch({
  //       success: function () {
  //         this.add(model);
  //       }.bind(this)
  //     });
  //   }
  //
  //   return model;
  // }
});

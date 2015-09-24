GoogleSheetsClone.Views.ShareIndex = Backbone.CompositeView.extend({
  template: JST["shares/index"],

  className: "modal shares-index",

  events: {
    "click button.close-modal": "close",
    "submit form": "addShare"
  },

  initialize: function () {
    this.collection.fetch();
    this.listenTo(this.collection, "sync destroy add", this.render);
  },

  close: function () {
    this.remove();
  },

  addShare: function (e) {
    e.preventDefault();
    var formData = $(e.currentTarget).serializeJSON();
    var model = new GoogleSheetsClone.Models.Share({
      spreadsheet_id: this.collection.spreadsheet.id
    });
    model.save(formData, {
      success: function () {
        this.collection.add(model);
      }.bind(this),
      error: function () {
        this.$("input").val("");
        this.$("input").attr("placeholder", "User not found! Enter another email address.");
      }
    });
  },

  render: function () {
    this.$el.html(this.template({
      shares: this.collection,
      owner: this.collection.spreadsheet.owner
    }));

    this.collection.each(function(model) {
      this.addSubview(
        "ul.shares",
        new GoogleSheetsClone.Views.ShareIndexItem({
          model: model
        })
      );
    }.bind(this));

    return this;
  }
});

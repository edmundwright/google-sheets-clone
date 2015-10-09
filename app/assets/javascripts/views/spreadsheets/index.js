GoogleSheetsClone.Views.SpreadsheetIndex = Backbone.CompositeView.extend({
  template: JST["spreadsheets/index"],

  initialize: function () {
    this.listenTo(this.collection, "sync destroy", this.render.bind(this, true));
    $(document).on("click", this.click.bind(this));
  },

  events: {
    "click .create": "create"
  },

  render: function (collectionFetched) {
    this.$el.html(this.template({
      spreadsheets: this.collection,
      collectionFetched: collectionFetched
    }));

    var timePeriod = null;
    var $ul = null;

    this.collection.each(function(model) {
      var modelTimePeriod = model.timePeriod();

      if (timePeriod === null || timePeriod !== modelTimePeriod) {
        timePeriod = modelTimePeriod;
        var $h2 = $("<h2>");
        $h2.addClass("time-period");
        $h2.text(timePeriod);
        $ul = $("<ul>");
        $ul.addClass("spreadsheets");
        $("div.spreadsheets-container").append($h2).append($ul);
      }

      this.addSubview(
        $ul,
        new GoogleSheetsClone.Views.SpreadsheetIndexItem({
          model: model
        })
      );
    }.bind(this));

    return this;
  },

  click: function (e) {
    if (!$(e.target).hasClass("context-menu-link") &&
        !$(e.target).hasClass("dot")) {
      $(".index-context-menu").remove();
    }
  },

  create: function () {
    var model = new GoogleSheetsClone.Models.Spreadsheet();

    model.save({
      "spreadsheet": {
        "title": "Untitled spreadsheet",
        "width": 26,
        "height": 26
      }
    }, {
      success: function () {
        Backbone.history.navigate("spreadsheets/" + model.id, { trigger: true });
      }
    });
  }
});

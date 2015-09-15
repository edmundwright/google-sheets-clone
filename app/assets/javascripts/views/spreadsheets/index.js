GoogleSheetsClone.Views.SpreadsheetIndex = Backbone.CompositeView.extend({
  template: JST["spreadsheets/index"],

  initialize: function () {
    this.listenTo(this.collection, "sync", this.render);
  },

  render: function () {
    this.$el.html(this.template());
    var $container = $("<div>");
    $container.addClass("spreadsheets-container");
    this.$el.append($container);

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
        $container.append($h2).append($ul)
      }

      this.addSubview(
        $ul,
        new GoogleSheetsClone.Views.SpreadsheetIndexItem({
          model: model
        })
      );
    }.bind(this))

    return this;
  }
});

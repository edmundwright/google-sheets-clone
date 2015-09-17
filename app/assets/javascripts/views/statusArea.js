GoogleSheetsClone.Views.StatusArea = Backbone.View.extend({
  template: JST["spreadsheets/showTitle"],

  initialize: function () {
    this.message = "";
  },

  displaySaving: function () {
    this.timeStartedSaving = Date.now();
    this.message = "Saving";
    this.$el.addClass("saving");
    this.render();
  },

  finishSaving: function () {
    var timeNow = Date.now();
    if (timeNow > this.timeStartedSaving + 1000) {
      this.timeFinishedSaving = timeNow;
      setTimeout(this.removeSaved.bind(this), 5000);
      this.$el.removeClass("saving");
      this.message = "Saved";
      this.render();
    } else {
      setTimeout(this.finishSaving.bind(this), this.timeStartedSaving + 1000 - timeNow);
    }
  },

  removeSaved: function () {
    this.message = "";
    this.render();
  },

  render: function () {
    this.$el.text(this.message);

    return this;
  }
});

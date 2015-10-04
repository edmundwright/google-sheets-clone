GoogleSheetsClone.Views.StatusArea = Backbone.View.extend({
  template: JST["spreadsheets/showTitle"],

  initialize: function () {
    this.message = "";
  },

  displaySaving: function () {
    this.finishSavingTime = Date.now() + 1000;
    this.message = "Saving";
    this.$el.addClass("saving");
    this.render();
  },

  finishSaving: function () {
    var timeNow = Date.now();
    if (timeNow > this.finishSavingTime - 1) {
      this.finishSavedTime = timeNow + 5000;
      setTimeout(this.removeSaved.bind(this), 5000);
      this.$el.removeClass("saving");
      this.message = "Saved";
      this.render();
    } else {
      setTimeout(this.finishSaving.bind(this), this.finishSavingTime - timeNow);
    }
  },

  removeSaved: function () {
    var timeNow = Date.now();
    if (timeNow > this.finishSavedTime - 1) {
      this.$el.removeClass("saving");
      this.message = "";
      this.render();
    }
  },

  render: function () {
    this.$el.text(this.message);

    return this;
  }
});

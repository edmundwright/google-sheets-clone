GoogleSheetsClone.Views.SpreadsheetShowTitle = Backbone.View.extend({
  template: JST["spreadsheets/showTitle"],

  initialize: function () {
    this.listenTo(this.model, "change:title", this.render);
    this.editing = false;
  },

  events: {
    "submit form": "submit",
    "click h1.title": "edit",
    "blur input": "save"
  },

  save: function () {
    var formData = this.$("form").serializeJSON();
    this.model.save(formData, {
      success: function () {
        this.editing = false;
        this.render();
        GoogleSheetsClone.statusAreaView.displaySaving();
        GoogleSheetsClone.statusAreaView.finishSaving();
      }.bind(this)
    });
  },

  submit: function(e) {
    e.preventDefault();
    this.save();
  },

  edit: function() {
    this.editing = true;
    this.render();
    $("input.title").focus();
    $("input.title").select();
  },

  render: function () {
    this.$el.html(this.template({
      spreadsheet: this.model,
      editing: this.editing
    }));

    if (this.model.escape("title") === "Untitled spreadsheet") {
      $(".title").addClass("untitled");
    }

    return this;
  }
});

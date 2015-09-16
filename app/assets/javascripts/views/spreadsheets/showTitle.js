GoogleSheetsClone.Views.SpreadsheetShowTitle = Backbone.View.extend({
  template: JST["spreadsheets/showTitle"],

  initialize: function () {
    this.listenTo(this.model, "change:title", this.render);
    this.editing = false;
  },

  events: {
    "submit form": "submit",
    "click h1.title": "edit"
  },

  submit: function(e) {
    e.preventDefault();
    var formData = $(e.currentTarget).serializeJSON();
    this.model.save(formData, {
      success: function () {
        this.editing = false;
        this.render();
      }.bind(this)
    });
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

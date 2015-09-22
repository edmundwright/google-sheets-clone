GoogleSheetsClone.Views.SpreadsheetRename = Backbone.CompositeView.extend({
  template: JST["spreadsheets/rename"],

  className: "modal rename-spreadsheet",

  events: {
    "submit .rename-form": "submit",
    "click .rename-spreadsheet": "submit",
    "click button.close-modal": "close"
  },

  close: function () {
    this.remove();
  },

  submit: function(e) {
    e.preventDefault();
    var formData = this.$(".rename-form").serializeJSON();
    this.model.save(formData);
    this.remove();
  },

  focus: function () {
    this.$("input.title").focus();
    this.$("input.title").select();
  },

  render: function () {
    this.$el.html(this.template({
      spreadsheet: this.model
    }));

    return this;
  }
});

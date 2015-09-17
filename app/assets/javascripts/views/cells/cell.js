GoogleSheetsClone.Views.Cell = Backbone.View.extend({
  template: JST["cells/cell"],

  tagName: "li",

  className: "cell",

  initialize: function (options) {
    // this.$el.data("cell-id", (this.model ? this.model.id : null));
    this.row = options.row;
    this.col = options.col;
    this.spreadsheet = options.spreadsheet;
    this.gettingInput = false;
    this.$el.on("beginEditing", this.beginEditing.bind(this));
    this.$el.on("unselect", this.unselect.bind(this));
  },

  beginEditing: function () {
    if (!this.gettingInput) {
      this.gettingInput = true;
      this.render();
      this.$("input").val(this.$("input").val());
      this.$("input").focus();
    }
  },

  unselect: function () {
    if (this.gettingInput) {
      if (!this.model) {
        this.model = new GoogleSheetsClone.Models.Cell({
          row_index: this.row,
          col_index: this.col,
          spreadsheet_id: this.spreadsheet.id
        });
      }

      var newContents = this.$("input").val();
      this.model.save({ contents_str: newContents });

      this.gettingInput = false;
      this.render();
    }
  },

  render: function () {
    if (this.model) {
      var contents = this.model.get("contents_str") ||
                     this.model.get("contents_int") ||
                     this.model.get("contents_flo");
    } else {
      var contents = "";
    }

    this.$el.html(this.template({
      contents: contents,
      gettingInput: this.gettingInput
    }));

    return this;
  }
});

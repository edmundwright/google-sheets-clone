GoogleSheetsClone.Views.Cell = Backbone.View.extend({
  template: JST["cells/cell"],

  tagName: "li",

  className: "cell",

  initialize: function (options) {
    // this.$el.data("cell-id", (this.model ? this.model.id : null));
    this.row = options.row;
    this.col = options.col;
    this.spreadsheet = options.spreadsheet;
    this.$selectedCellBorder = options.$selectedCellBorder;
    this.editing = false;
    this.selected = false;
    this.$el.on("select", this.select.bind(this));
    this.$el.on("unselect", this.unselect.bind(this));
    this.$el.on("beginEditing", this.beginEditing.bind(this));
    this.$el.on("finishEditing", this.finishEditing.bind(this));
    this.$el.on("delete", this.destroyModel.bind(this));
    this.$el.on("cancelEditing", this.cancelEditing.bind(this));
  },

  cancelEditing: function () {
    this.editing = false;
    this.render();
  },

  destroyModel: function () {
    this.model.destroy();
    this.model = null;
    this.render();
  },

  select: function () {
    this.selected = true;
    this.render();
  },

  unselect: function () {
    if (this.editing) {
      this.finishEditing();
    }
    this.selected = false;
    this.render();
  },

  beginEditing: function (e, replace) {
    this.editing = true;
    this.render();
    if (replace) {
      this.$("input").val("")
    } else {
      this.$("input").val(this.$("input").val());
    }
    this.$("input").focus();
  },

  finishEditing: function () {
    if (!this.model) {
      this.model = new GoogleSheetsClone.Models.Cell({
        row_index: this.row,
        col_index: this.col,
        spreadsheet_id: this.spreadsheet.id
      });
    }

    var newContents = this.$("input").val();

    if (newContents === "") {
      this.model.destroy();
      this.model = null;
    } else {
      this.model.save({ contents_str: newContents });
    }

    this.editing = false;
    this.render();
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
      editing: this.editing
    }));

    if (this.selected) {
      this.$el.append(this.$selectedCellBorder)
    }

    return this;
  }
});

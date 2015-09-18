GoogleSheetsClone.Views.Cell = Backbone.View.extend({
  template: JST["cells/cell"],

  tagName: "li",

  className: "cell",

  initialize: function (options) {
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
    if (this.model) {
      this.listenTo(this.model, "render", this.render.bind(this))
    }
  },

  cancelEditing: function () {
    this.editing = false;
    this.render();
  },

  destroyModel: function (e, callback) {
    if (this.model) {
      GoogleSheetsClone.statusAreaView.displaySaving();
      this.model.destroy({
        success: function () {
          GoogleSheetsClone.statusAreaView.finishSaving();
          callback();
        }
      });
      this.model = null;
    }

    this.render();
  },

  select: function () {
    this.selected = true;
    this.render();
    this.scrollIfOutOfWindow();
  },

  scrollIfOutOfWindow: function () {
    var $body = $("body");

    if (this.$el.offset().top + 37 > $body.scrollTop() + $(window).height()) {
      $body.scrollTop(this.$el.offset().top + 37 - $(window).height());
    } else if (this.$el.offset().top < $body.scrollTop() + 135) {
      $body.scrollTop(this.$el.offset().top - 135);
    }

    if (this.$el.offset().left + 176 > $body.scrollLeft() + $(window).width()) {
      $body.scrollLeft(this.$el.offset().left + 176 - $(window).width());
    } else if (this.$el.offset().left < $body.scrollLeft() + 60) {
      $body.scrollLeft(this.$el.offset().left - 60);
    }
  },

  unselect: function () {
    this.selected = false;
    this.render();
  },

  beginEditing: function (e, options) {
    this.editing = true;
    this.render();
    if (options.replace) {
      this.$("input").val("")
    } else {
      this.$("input").val(this.$("input").val());
    }
    if (options.focus) {
      this.$("input").focus();
    }
  },

  finishEditing: function (e, callback) {
    var newContents = this.$("input").val();

    if (!this.model) {
      this.model = new GoogleSheetsClone.Models.Cell({
        row_index: this.row,
        col_index: this.col,
        spreadsheet_id: this.spreadsheet.id
      });
      this.spreadsheet.cells().add(this.model);
      this.listenTo(this.model, "render", this.render.bind(this))
    }

    if (newContents === "") {
      this.model.destroy();
      this.model = null;
    } else {
      GoogleSheetsClone.statusAreaView.displaySaving();

      if (isNaN(newContents)) {
        var attrs = { contents_str: newContents, contents_int: null, contents_flo: null };
      } else if (newContents % 1 === 0) {
        var attrs = { contents_int: newContents, contents_str: null, contents_flo: null  };
      } else {
        var attrs = { contents_flo: newContents, contents_int: null, contents_str: null  };
      }

      this.model.save(attrs, {
        success: function () {
          GoogleSheetsClone.statusAreaView.finishSaving();
          callback();
        }
      });
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

    if (typeof contents ==="string" && contents[0] === "=") {
      try {
        var evaluatedContents = GoogleSheetsClone.evaluate(contents.slice(1), this.spreadsheet.cells());
      } catch (error) {
        if (error === "formulaNotWellFormed") {
          var evaluatedContents = "! BAD FORMULA"
        } else if (error === "badReference") {
          var evaluatedContents = "! BAD REF"
        } else {
          var evaluatedContents = "! SOME ERROR"
        }
      }
    } else {
      var evaluatedContents = contents;
    }

    this.$el.html(this.template({
      contents: contents,
      evaluatedContents: evaluatedContents,
      editing: this.editing
    }));

    if (this.selected) {
      this.$el.append(this.$selectedCellBorder)
    }

    return this;
  }
});

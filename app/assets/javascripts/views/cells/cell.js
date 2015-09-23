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
    this.$el.on("paste", this.paste.bind(this));
    if (this.model) {
      this.listenTo(this.model, "render", this.render.bind(this));
    }
  },

  paste: function (e, options) {
    if (options.newContents.contents === "") {
      this.destroyModel(null, options.callback);
    } else {
      var newContents;
      if (typeof options.newContents.contents === "string" &&
          options.newContents.contents[0] === "=") {
        newContents = this.translateFormulaContents(options.newContents);
      } else {
        newContents = options.newContents.contents;
      }

      this.save(newContents, options.callback);
    }
  },

  translateFormulaContents: function (options) {
    var translatedFormula = options.contents.slice(1);

    var rowDifference = this.row - options.originalRow;
    var colDifference = this.col - options.originalCol;

    var foundRef = GoogleSheetsClone.findRef(translatedFormula, 0);

    while (foundRef) {
      var newRowName = foundRef.row + rowDifference + 1;
      var newColName = GoogleSheetsClone.columnName(foundRef.col + colDifference);
      translatedFormula = translatedFormula.slice(0, foundRef.startPos) +
        newColName + newRowName + translatedFormula.slice(foundRef.lastPos + 1);

      foundRef = GoogleSheetsClone.findRef(
        translatedFormula,
        foundRef.startPos + (newColName + newRowName).length
      );
    }

    return "=" + translatedFormula;
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
  },

  unselect: function () {
    this.selected = false;
    this.render();
  },

  beginEditing: function (e, options) {
    this.editing = true;
    this.render();
    if (options.replace) {
      this.$("input").val("");
    } else {
      this.$("input").val(this.$("input").val());
    }
    if (options.focus) {
      this.$("input").focus();
    }
  },

  save: function (newContents, callback) {
    if (!this.model) {
      this.model = new GoogleSheetsClone.Models.Cell({
        row_index: this.row,
        col_index: this.col,
        spreadsheet_id: this.spreadsheet.id
      });
      this.spreadsheet.cells().add(this.model);
      this.listenTo(this.model, "render", this.render.bind(this));
    }

    if (newContents === "") {
      this.model.destroy();
      this.model = null;
    } else {
      GoogleSheetsClone.statusAreaView.displaySaving();

      var attrs;
      if (isNaN(newContents)) {
        attrs = { contents_str: newContents, contents_int: null, contents_flo: null };
      } else if (newContents % 1 === 0) {
        attrs = { contents_int: newContents, contents_str: null, contents_flo: null  };
      } else {
        attrs = { contents_flo: newContents, contents_int: null, contents_str: null  };
      }

      this.model.save(attrs, {
        success: function () {
          GoogleSheetsClone.statusAreaView.finishSaving();
          callback();
        }
      });
    }
  },

  finishEditing: function (e, callback) {
    this.editing = false;
    this.save(this.$("input").val(), callback);
    this.render();
  },

  render: function () {
    var contents;
    if (this.model) {
      contents = this.model.get("contents_str") ||
                this.model.get("contents_int") ||
                this.model.get("contents_flo");
      if (this.model.get("contents_int") === 0) {
        contents = 0;
      }
    } else {
      contents = "";
    }

    var evaluatedContents;
    if (typeof contents ==="string" && contents[0] === "=") {
      try {
        evaluatedContents = GoogleSheetsClone.evaluate(contents.slice(1));
      } catch (error) {
        if (error === "formulaNotWellFormed") {
          evaluatedContents = "#BAD FORMULA!";
        } else if (error === "badReference") {
          evaluatedContents = "#BAD REF!";
        } else if (error === "divideByZero") {
          evaluatedContents = "#DIV BY ZERO!";
        } else {
          evaluatedContents = "#SOME ERROR!";
        }
      }
    } else {
      evaluatedContents = contents;
    }

    this.$el.html(this.template({
      contents: contents,
      evaluatedContents: evaluatedContents,
      editing: this.editing
    }));

    if (this.selected) {
      this.$el.append(this.$selectedCellBorder);
    }

    return this;
  }
});

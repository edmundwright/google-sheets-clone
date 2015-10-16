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
    this.$el.on("addCurrentEditor", this.addCurrentEditor.bind(this));
    this.$el.on("removeCurrentEditor", this.removeCurrentEditor.bind(this));
    this.$el.on("receiveNewModel", this.receiveNewModel.bind(this));
    if (this.model) {
      this.listenTo(this.model, "render", this.render.bind(this));
    }
  },

  receiveNewModel: function (e, newModel) {
    if (this.editing) {
      this.cancelEditing();
    }
    this.$el.addClass("other-editor-edited");
    window.setTimeout(function () {
        this.$el.removeClass("other-editor-edited");
      }.bind(this),
      2000
    );
    this.model = newModel;
    this.listenTo(this.model, "render", this.render.bind(this));
    GoogleSheetsClone.evaluate(this.model);
  },

  removeCurrentEditor: function () {
    this.currentEditor = null;
    this.$(".current-editor-border").remove();
  },

  addCurrentEditor: function (e, currentEditor) {
    this.currentEditor = currentEditor;
    this.renderCurrentEditorBorder();
  },

  paste: function (e, options) {
    if (options.newContents.contents === "") {
      this.destroyModel(null, {
        callback: options.callback
      });
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
    var formula = options.contents.slice(1);

    var rowDifference = this.row - options.originalRow;
    var colDifference = this.col - options.originalCol;

    return "=" + formula.replace(
      /([a-zA-Z]+)(\d+)/g,
      function (_, colName, rowName) {
        var col = GoogleSheetsClone.columnIndex(colName);
        var row = GoogleSheetsClone.rowIndex(rowName);

        return GoogleSheetsClone.columnName(col + colDifference) +
          GoogleSheetsClone.rowName(row + rowDifference);
      }
    );
  },

  cancelEditing: function () {
    this.editing = false;
    this.render();
  },

  destroyModel: function (e, options) {
    if (this.model) {
      var pos = this.model.pos();
      this.model.removeDependencies();

      if (options && options.doNotPersist) {
        GoogleSheetsClone.cells.remove(this.model);
        if (options && options.callback) {
          options.callback();
        }
      } else {
        GoogleSheetsClone.statusAreaView.displaySaving();

        this.model.destroy({
          success: function () {
            GoogleSheetsClone.statusAreaView.finishSaving();
            if (options && options.callback) {
              options.callback();
            }

            if (GoogleSheetsClone.channel.subscribed) {
              GoogleSheetsClone.channel.trigger("client-cell-change", {});
            }
          }.bind(this)
        });
      }

      GoogleSheetsClone.evaluateDependents(pos);
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
    if (options.focus) {
      this.$("input").focus();
    }
    if (options.replace) {
      this.$("input").val("");
      this.$("input").val(String.fromCharCode(options.characterToInput));
    } else {
      var text = this.$("input").val();
      this.$("input").val("");
      this.$("input").val(text);
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
      this.render();
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

      this.model.set(attrs);

      GoogleSheetsClone.evaluate(this.model);

      this.model.save({}, {
        success: function () {
          GoogleSheetsClone.statusAreaView.finishSaving();
          if (callback) {
            callback();
          }

          if (GoogleSheetsClone.channel.subscribed) {
            GoogleSheetsClone.channel.trigger("client-cell-change", {});
          }
        }
      });
    }
  },

  finishEditing: function (e, callback) {
    this.editing = false;
    this.save(this.$("input").val(), callback);
  },

  render: function (e, skipIfEditing) {
    if (skipIfEditing && this.editing) {
      return;
    }

    var contents = "";
    var evaluatedContents = "";

    if (this.model) {
      contents = this.model.contents();
      evaluatedContents = this.model.evaluation;
    }

    this.$el.html(this.template({
      contents: contents,
      evaluatedContents: evaluatedContents,
      editing: this.editing
    }));

    if (this.selected) {
      this.$el.append(this.$selectedCellBorder);
    }

    if (this.currentEditor) {
      this.renderCurrentEditorBorder();
    }

    return this;
  },

  renderCurrentEditorBorder: function () {
    $currentEditorBorder = $("<div>");
    $currentEditorBorder.addClass("current-editor-border");
    $currentEditorBorder.text(this.currentEditor.escape("name"));
    this.$el.append($currentEditorBorder);
  }
});

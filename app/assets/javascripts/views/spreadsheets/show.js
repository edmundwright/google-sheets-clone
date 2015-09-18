GoogleSheetsClone.Views.SpreadsheetShow = Backbone.CompositeView.extend({
  template: JST["spreadsheets/show"],

  initialize: function () {
    this.model.fetch({
      success: function () {
        GoogleSheetsClone.cells = this.model.cells();
        this.render();
      }.bind(this)
    });
    $(document).on("keypress", this.keyPress.bind(this));
    $(document).on("keydown", this.keyDown.bind(this));
    $(window).scroll(this.scroll);
    this.$selectedLi = null;
  },

  events: {
    "click .formula-bar-input": "clickFormulaBar",
    "click .cell": "clickCell",
    "dblclick .cell": "dblClickCell",
    "input .cell-contents.input": "updateFormulaBar",
    "input .formula-bar-input": "updateSelectedLi"
  },

  editing: function () {
    return this.editingCell() || this.editingFormulaBar();
  },

  editingCell: function () {
    return !!this.currentInputField &&
      this.currentInputField === ".cell-contents.input";
  },

  editingFormulaBar: function () {
    return !!this.currentInputField &&
      this.currentInputField === ".formula-bar-input";
  },

  editingFormula: function () {
    if (!this.editing()) {
      return false;
    }
    var firstCharacterOfInput = this.currentInput()[0];
    return (!!firstCharacterOfInput && firstCharacterOfInput === "=");
  },

  currentInput: function () {
    return this.$(this.currentInputField).val();
  },

  keyDown: function (e) {
    if (!GoogleSheetsClone.titleView.editing)  {
      switch (e.keyCode) {
        case 37:
          this.handleArrowKey(e);
          break;
        case 38:
          this.handleArrowKey(e);
          break;
        case 39:
          this.handleArrowKey(e);
          break;
        case 40:
          this.handleArrowKey(e);
          break;
        case 8:
          this.handleDeleteKey(e)
          break;
        case 46:
          this.handleDeleteKey(e)
          break;
        case 27:
          this.handleEscape(e)
          break;
      }
    }
  },

  keyPress: function (e) {
    if (!GoogleSheetsClone.titleView.editing) {
      if (e.keyCode === 13) {
        this.handleEnter(e);
      } else if (!this.editing()) {
        this.beginEditingCell(true);
      }
    }
  },

  beginEditing: function (replace, focus) {
    this.$selectedLi.trigger("beginEditing", {replace: replace, focus: focus});
  },

  beginEditingCell: function (replace) {
    this.currentInputField = ".cell-contents.input";
    this.beginEditing(replace, true);
  },

  beginEditingFormulaBar: function () {
    this.currentInputField = ".formula-bar-input";
    this.beginEditing(false, false);
  },

  finishEditing: function () {
    this.currentInputField = null;
    this.$selectedLi.trigger("finishEditing");
    this.$(".formula-bar-input").blur();
  },

  cancelEditing: function () {
    this.currentInputField = null;
    this.$selectedLi.trigger("cancelEditing");
    this.$(".formula-bar-input").blur();
    this.$(".formula-bar-input").val(this.$selectedLi.find(".cell-contents").text());
  },

  handleEnter: function (e) {
    if (this.editing()) {
      try {
        if (this.editingFormula()) {
          GoogleSheetsClone.evaluate(this.currentInput().slice(1), this.model.cells());
        }
        this.finishEditing();
        var neighbourBelow = this.neighbourInDirection(40);
        if (neighbourBelow) {
          this.selectCell(neighbourBelow);
        }
      } catch (error) {
        if (error === "formulaNotWellFormed") {
          console.log("Formula not well formed");
        } else if (error === "badReference") {
          console.log("Bad reference");
        } else {
          console.log("Unknown error evaluating or saving cell");
        }
      }
    } else {
      this.beginEditingCell();
    }
  },

  handleDeleteKey: function (e) {
    if (!this.editing()) {
      e.preventDefault();
      this.$(".formula-bar-input").val("");
      this.$selectedLi.trigger("delete");
    }
  },

  handleEscape: function (e) {
    if (this.editing()) {
      e.preventDefault();
      this.cancelEditing();
    }
  },

  handleArrowKey: function (e) {
    if (!this.editingFormula() && !this.editingFormulaBar()) {
      e.preventDefault();
      var neighbour = this.neighbourInDirection(e.keyCode)
      if (neighbour) {
        if (this.editing()) {
          this.finishEditing();
        }
        this.selectCell(neighbour);
      }
    }
  },

  neighbourInDirection: function (keyCode) {
    switch (keyCode) {
      case 37:
        if (this.$selectedLi.index() % this.model.get("width") !== 0) {
          return this.$("li.cell:nth-child(" + this.$selectedLi.index() + ")");
        }
        return null;
      case 38:
        if (this.$selectedLi.index() >= this.model.get("width")) {
          return this.$("li.cell:nth-child(" + (this.$selectedLi.index() - this.model.get("width") + 1) + ")")
        }
        return null;
      case 39:
        if ((this.$selectedLi.index() + 1) % this.model.get("width") !== 0) {
          return this.$("li.cell:nth-child(" + (this.$selectedLi.index() + 2) + ")")
        }
        return null;
      case 40:
        if (this.$selectedLi.index() < (this.model.get("height") * this.model.get("width")) - this.model.get("height")) {
          return this.$("li.cell:nth-child(" + (this.$selectedLi.index() + this.model.get("width") + 1) + ")")
        }
        return null;
    }
  },

  clickFormulaBar: function (e) {
    $(e.currentTarget).focus();
    if (this.editing()) {
      this.currentInputField = ".formula-bar-input";
    } else {
      this.beginEditingFormulaBar();
    }
  },

  updateFormulaBar: function (e) {
    this.$(".formula-bar-input").val($(e.currentTarget).val());
  },

  updateSelectedLi: function (e) {
    this.$selectedLi.find(".cell-contents").val($(e.currentTarget).val());
  },

  clickCell: function (e) {
    e.preventDefault();
    if (this.$selectedLi.index() === $(e.currentTarget).index() & this.editing()) {
      this.currentInputField = ".cell-contents.input";
      this.$selectedLi.find("input").focus();
    } else if (!this.editing()) {
      this.selectCell($(e.currentTarget));
    } else if (!this.editingFormula()) {
      this.finishEditing();
      this.selectCell($(e.currentTarget));
    } else {

      this.$selectedLi.find("input").focus();
    }
  },

  dblClickCell: function (e) {
    e.preventDefault();
    if (!this.editing()) {
      this.beginEditingCell();
    }
  },

  // This method is profoundly delicate, don't mess it up!
  selectCell: function ($newLi) {
    if ((!this.$selectedLi) || this.$selectedLi.index() !== $newLi.index()) {
      if (this.$selectedLi) {
        this.$selectedLi.trigger("unselect");
      }
      this.$(".formula-bar-input").blur();
      this.$selectedLi = $newLi;
      this.$selectedLi.focus();
      this.$selectedLi.trigger("select");
      this.$(".formula-bar-input").val(this.$selectedLi.find(".cell-contents").data("contents"));
    }
  },

  scroll: function () {
    this.$("ul#row-headers").css("left", $(this).scrollLeft());
    this.$("ul#column-headers").css("top", $(this).scrollTop() + 37);
  },

  render: function () {
    this.$el.html(this.template({
      spreadsheet: this.model
    }));

    var widthString = "" + (this.model.get("width") * 176) + "px";
    this.$("ul#column-headers").css("width", widthString);
    this.$("ul#cells").css("width", widthString);

    this.$selectedCellBorder = $("<div>");
    this.$selectedCellBorder.addClass("selected-cell-border");

    this.renderColumnHeaders();
    this.renderRowHeaders();
    this.renderCells();

    return this;
  },

  renderColumnHeaders: function () {
    var $ul = this.$("ul#column-headers");

    for(var col = 0; col < this.model.get("width"); col++) {
      var $li = $("<li>");
      $li.addClass("column-header");
      $li.text(GoogleSheetsClone.columnName(col));
      $ul.append($li);
    }
  },

  renderRowHeaders: function () {
    var $ul = this.$("ul#row-headers");

    for(var row = 0; row < this.model.get("height"); row++) {
      var $li = $("<li>");
      $li.addClass("row-header");
      $li.text(row + 1);
      $ul.append($li);
    }
  },

  renderCells: function () {
    var $ul = this.$("ul#cells")

    var cellIdx = 0;

    for(var row = 0; row < this.model.get("height"); row++) {
      for(var col = 0; col < this.model.get("width"); col++) {
        var cell = this.model.cells().at(cellIdx)

        if (cell && cell.get("row_index") === row && cell.get("col_index") === col) {
          cellIdx++;
        } else {
          cell = null;
        }

        this.addSubview($ul, new GoogleSheetsClone.Views.Cell({
          model: cell,
          row: row,
          col: col,
          spreadsheet: this.model,
          $selectedCellBorder: this.$selectedCellBorder
        }))
      }
    }

    this.selectCell($("li.cell:nth-child(1)"));
  }
});

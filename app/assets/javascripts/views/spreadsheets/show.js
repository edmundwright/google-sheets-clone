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
    $(document).on("mouseup", this.mouseUp.bind(this));
    $(window).scroll(this.scroll);
    this.$selectedLi = null;
  },

  events: {
    "click .formula-bar-input": "clickFormulaBar",
    "click .cell": "clickCell",
    "dblclick .cell": "dblClickCell",
    "mousedown .cell": "mouseDownCell",
    "mouseover .cell": "mouseOverCell",
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
      } else if (this.inserting) {
        this.finishInserting();
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
    this.$selectedLi.trigger("finishEditing", this.renderAllCells.bind(this));
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
      if (this.inserting) {
        this.finishInserting();
      }
      this.finishEditing();
      var neighbourBelow = this.neighbourInDirection(40);
      if (neighbourBelow) {
        this.selectCell(neighbourBelow);
      }
    } else {
      this.beginEditingCell();
    }
  },

  handleDeleteKey: function (e) {
    if (!this.editing()) {
      e.preventDefault();
      this.$(".formula-bar-input").val("");
      this.$selectedLi.trigger("delete", this.renderAllCells.bind(this));
    } else if (this.inserting) {
      this.finishInserting();
    }
  },

  handleEscape: function (e) {
    if (this.editing()) {
      if (this.inserting) {
        this.finishInserting();
      }
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
    } else if (this.editingFormula() && !this.editingFormulaBar()) {

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

  updateFormulaBar: function () {
    this.$(".formula-bar-input").val(this.$(".cell-contents.input").val());
  },

  updateSelectedLi: function () {
    this.$selectedLi.find(".cell-contents").val(this.$(".formula-bar-input").val());
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
    }
  },

  mouseDownCell: function (e) {
    e.preventDefault();
    if (this.$selectedLi.index() !== $(e.currentTarget).index() && this.editingFormula()) {
      this.$firstLiForInsertion = this.$lastLiForInsertion = $(e.currentTarget);
      this.dragging = true;
      this.updateInsertedRef(e.ctrlKey || e.metaKey);
      this.renderSelectionForInsertion();
    }
  },

  updateInsertedRef: function (commaAndNewInsertion) {
    if (this.$firstLiForInsertion.index() === this.$lastLiForInsertion.index()) {
      var newInsertedRef = this.refToCell(this.$firstLiForInsertion);
    } else {
      var newInsertedRef = this.refToRange(this.$firstLiForInsertion, this.$lastLiForInsertion);
    }

    // Deeply unsatisfactory to have to change to formula bar input for this to work,
    // but JQuery refuses to play nicely when trying to do it with cell input
    this.currentInputField = ".formula-bar-input";
    var input = this.$(this.currentInputField);

    if (!this.inserting) {
      this.inserting = true;
      this.caretPosition = this.$(this.currentInputField).caret();
      if (commaAndNewInsertion) {
        input.val(input.val().slice(0, this.caretPosition) + "," + input.val().slice(this.caretPosition));
        this.caretPosition += 1;
      }
      var afterInsertedRef = input.val().slice(this.caretPosition);
    } else {
      if (commaAndNewInsertion) {
        this.finishInserting();
        this.updateInsertedRef(true);
        return;
      }
      var afterInsertedRef = input.val().slice(this.caretPosition + this.currentInsertedRef.length)
    }

    input.val(input.val().slice(0, this.caretPosition) + newInsertedRef + afterInsertedRef);
    input.caret(this.caretPosition + newInsertedRef.length);
    this.updateSelectedLi();
    this.currentInsertedRef = newInsertedRef;
  },

  renderSelectionForInsertion: function () {
    var firstCol = this.cellCol(this.$firstLiForInsertion);
    var lastCol = this.cellCol(this.$lastLiForInsertion);
    var firstRow = this.cellRow(this.$firstLiForInsertion);
    var lastRow = this.cellRow(this.$lastLiForInsertion);

    this.$(".cell").removeClass("selected-for-insertion");

    for (var col = Math.min(firstCol, lastCol); col <= Math.max(firstCol, lastCol); col++) {
      for (var row = Math.min(firstRow, lastRow); row <= Math.max(firstRow, lastRow); row++) {
        this.cellLiAtPos(row, col).addClass("selected-for-insertion");
      }
    }
  },

  finishInserting: function () {
    this.$(".cell").removeClass("selected-for-insertion");
    this.inserting = false;
  },

  mouseOverCell: function (e) {
    if (this.dragging) {
      this.$lastLiForInsertion = $(e.currentTarget);
      this.updateInsertedRef();
      this.renderSelectionForInsertion();
    }
  },

  mouseUp: function (e) {
    if (this.dragging) {
      e.preventDefault();
      this.dragging = false;
      this.updateInsertedRef();
    }
  },

  refToCell: function ($cellLi) {
    return "" + GoogleSheetsClone.columnName(this.cellCol($cellLi)) + (this.cellRow($cellLi) + 1);
  },

  refToRange: function ($firstCellLi, $lastCellLi) {
    var topLeft = "";
    var bottomRight = "";

    var firstCol = this.cellCol($firstCellLi);
    var lastCol = this.cellCol($lastCellLi);
    topLeft += GoogleSheetsClone.columnName(Math.min(firstCol, lastCol));
    bottomRight += GoogleSheetsClone.columnName(Math.max(firstCol, lastCol));

    var firstRow = this.cellRow($firstCellLi);
    var lastRow = this.cellRow($lastCellLi);
    topLeft += Math.min(firstRow, lastRow) + 1;
    bottomRight += Math.max(firstRow, lastRow) + 1;

    return topLeft + ":" + bottomRight;
  },

  cellRow: function ($cellLi) {
    return Math.floor($cellLi.index() / this.model.get("height"));
  },

  cellCol: function ($cellLi) {
    return $cellLi.index() % this.model.get("height");
  },

  cellLiAtPos: function (row, col) {
    return this.$("li.cell:nth-child(" + ((row * this.model.get("width")) + col + 1) + ")");
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
  },

  renderAllCells: function () {
    this.model.cells().each(function (cell) {
      cell.trigger("render");
    })
  }
});

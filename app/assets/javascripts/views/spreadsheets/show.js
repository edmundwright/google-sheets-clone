GoogleSheetsClone.Views.SpreadsheetShow = Backbone.CompositeView.extend({
  template: JST["spreadsheets/show"],

  initialize: function () {
    this.model.fetch({
      success: function () {
        GoogleSheetsClone.cells = this.model.cells();
        GoogleSheetsClone.spreadsheet = this.model;
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
    "click #select-all": "clickSelectAll",
    "mousedown .column-header": "mouseDownColumnHeader",
    "mouseover .column-header": "mouseOverColumnHeader",
    "mousedown .row-header": "mouseDownRowHeader",
    "mouseover .row-header": "mouseOverRowHeader",
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
      var neighbourBelow = this.neighbourInDirection(this.$selectedLi, 40);
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
      var neighbour = this.neighbourInDirection(this.$selectedLi, e.keyCode)
      if (neighbour) {
        if (this.editing()) {
          this.finishEditing();
        }
        this.selectCell(neighbour);
      }
    } else if (this.editingFormula() && !this.editingFormulaBar()) {
      e.preventDefault();

      if (this.inserting) {
        if (e.shiftKey) {
          var $neighbour = this.neighbourInDirection(this.$lastLiForInsertion, e.keyCode)
        } else {
          var $neighbour = this.neighbourInDirection(this.$firstLiForInsertion, e.keyCode)
        }
      } else {
        var $neighbour = this.neighbourInDirection(this.$selectedLi, e.keyCode)
      }

      if ($neighbour) {
        if (this.inserting && e.shiftKey) {
          this.$lastLiForInsertion = $neighbour;
        } else {
          this.$firstLiForInsertion = this.$lastLiForInsertion = $neighbour;
        }
        this.updateInsertedRef();
        this.renderSelectionForInsertion();
      }
    }
  },

  neighbourInDirection: function ($li, keyCode) {
    switch (keyCode) {
      case 37:
        if ($li.index() % this.model.get("width") !== 0) {
          return this.$("li.cell:nth-child(" + $li.index() + ")");
        }
        return null;
      case 38:
        if ($li.index() >= this.model.get("width")) {
          return this.$("li.cell:nth-child(" + ($li.index() - this.model.get("width") + 1) + ")")
        }
        return null;
      case 39:
        if (($li.index() + 1) % this.model.get("width") !== 0) {
          return this.$("li.cell:nth-child(" + ($li.index() + 2) + ")")
        }
        return null;
      case 40:
        if ($li.index() < (this.model.get("height") * this.model.get("width")) - this.model.get("height")) {
          return this.$("li.cell:nth-child(" + ($li.index() + this.model.get("width") + 1) + ")")
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
      this.draggingOverCols = false;
      this.dragging = true;
      this.updateInsertedRef(e.ctrlKey || e.metaKey);
      this.renderSelectionForInsertion();
    }
  },

  mouseDownColumnHeader: function (e) {
    e.preventDefault();
    if (this.editingFormula()) {
      var col = $(e.currentTarget).index();
      this.$firstLiForInsertion = this.cellLiAtPos(0, col);
      this.$lastLiForInsertion = this.cellLiAtPos(this.model.get("height") - 1, col);
      this.draggingOverCols = true;
      this.updateInsertedRef(e.ctrlKey || e.metaKey);
      this.renderSelectionForInsertion();
    }
  },

  mouseDownRowHeader: function (e) {
    e.preventDefault();
    if (this.editingFormula()) {
      var row = $(e.currentTarget).index();
      this.$firstLiForInsertion = this.cellLiAtPos(row, 0);
      this.$lastLiForInsertion = this.cellLiAtPos(row, this.model.get("width") - 1);
      this.draggingOverRows = true;
      this.updateInsertedRef(e.ctrlKey || e.metaKey);
      this.renderSelectionForInsertion();
    }
  },

  clickSelectAll: function (e) {
    e.preventDefault();
    if (this.editingFormula()) {
      this.$firstLiForInsertion = this.cellLiAtPos(0, 0);
      this.$lastLiForInsertion = this.cellLiAtPos(this.model.get("height") - 1, this.model.get("width") - 1);
      this.updateInsertedRef(e.ctrlKey || e.metaKey);
      this.renderSelectionForInsertion();
    }
  },

  updateInsertedRef: function (commaAndNewInsertion) {
    if (this.$firstLiForInsertion.index() === this.$lastLiForInsertion.index()) {
      var newInsertedRef = this.refToCell(this.$firstLiForInsertion);
    } else if (this.cellCol(this.$firstLiForInsertion) === 0 && this.cellCol(this.$lastLiForInsertion) === this.model.get("width") - 1) {
      var newInsertedRef = this.refToRowRange(this.cellRow(this.$firstLiForInsertion), this.cellRow(this.$lastLiForInsertion));
    } else if (this.cellRow(this.$firstLiForInsertion) === 0 && this.cellRow(this.$lastLiForInsertion) === this.model.get("height") - 1) {
      var newInsertedRef = this.refToColRange(this.cellCol(this.$firstLiForInsertion), this.cellCol(this.$lastLiForInsertion));
    } else {
      var newInsertedRef = this.refToRange(this.$firstLiForInsertion, this.$lastLiForInsertion);
    }

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
    if (this.currentInputField === ".formula-bar-input") {
      input.caret(this.caretPosition + newInsertedRef.length);
      this.updateSelectedLi();
    } else {
      this.updateFormulaBar();
    }

    this.currentInsertedRef = newInsertedRef;
  },

  renderSelectionForInsertion: function () {
    var firstCol = this.cellCol(this.$firstLiForInsertion);
    var lastCol = this.cellCol(this.$lastLiForInsertion);
    var firstRow = this.cellRow(this.$firstLiForInsertion);
    var lastRow = this.cellRow(this.$lastLiForInsertion);

    var topMostRow = Math.min(firstRow, lastRow);
    var bottomMostRow = Math.max(firstRow, lastRow);
    var leftMostCol = Math.min(firstCol, lastCol);
    var rightMostCol = Math.max(firstCol, lastCol);

    this.$(".cell").removeClass("selected-for-insertion");

    for (var row = topMostRow; row <= bottomMostRow; row++) {
      for (var col = leftMostCol; col <= rightMostCol; col++) {
        this.cellLiAtPos(row, col).addClass("selected-for-insertion");
      }
    }

    this.$cellsForInsertionBorder.css("left", "" + ((leftMostCol - 1) * 176 + 175) + "px");
    this.$cellsForInsertionBorder.css("top", "" + ((topMostRow - 1) * 36 + 35) + "px");
    this.$cellsForInsertionBorder.css("width", "" + ((rightMostCol - leftMostCol) * 176 + 171) + "px");
    this.$cellsForInsertionBorder.css("height", "" + ((bottomMostRow - topMostRow) * 36 + 31) + "px");
    this.$("#cells").append(this.$cellsForInsertionBorder);
  },

  finishInserting: function () {
    this.$(".cell").removeClass("selected-for-insertion");
    this.$cellsForInsertionBorder.remove();
    this.inserting = false;
  },

  mouseOverCell: function (e) {
    if (this.dragging) {
      this.$lastLiForInsertion = $(e.currentTarget);
      this.updateInsertedRef();
      this.renderSelectionForInsertion();
    } else if (this.draggingOverCols) {
      this.$lastLiForInsertion = this.cellLiAtPos(this.model.get("height") - 1, this.cellCol($(e.currentTarget)));
      this.updateInsertedRef();
      this.renderSelectionForInsertion();
    } else if (this.draggingOverRows) {
      this.$lastLiForInsertion = this.cellLiAtPos(this.cellRow($(e.currentTarget)), this.model.get("width") - 1);
      this.updateInsertedRef();
      this.renderSelectionForInsertion();
    }
  },

  mouseOverColumnHeader: function (e) {
    if (this.draggingOverCols) {
      this.$lastLiForInsertion = this.cellLiAtPos(this.model.get("height") - 1, $(e.currentTarget).index());
      this.updateInsertedRef();
      this.renderSelectionForInsertion();
    }
  },

  mouseOverRowHeader: function (e) {
    if (this.draggingOverRows) {
      this.$lastLiForInsertion = this.cellLiAtPos($(e.currentTarget).index(), this.model.get("width") - 1);
      this.updateInsertedRef();
      this.renderSelectionForInsertion();
    }
  },

  mouseUp: function (e) {
    if (this.dragging || this.draggingOverCols || this.draggingOverRows) {
      e.preventDefault();
      this.dragging = false;
      this.draggingOverCols = false;
      this.draggingOverRows = false;
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

  refToColRange: function (firstCol, lastCol) {
    if (firstCol < lastCol) {
      return GoogleSheetsClone.columnName(firstCol) + ":" + GoogleSheetsClone.columnName(lastCol);
    } else {
      return GoogleSheetsClone.columnName(lastCol) + ":" + GoogleSheetsClone.columnName(firstCol);
    }
  },

  refToRowRange: function (firstRow, lastRow) {
    if (firstRow < lastRow) {
      return "" + (firstRow + 1) + ":" + (lastRow + 1);
    } else {
      return "" + (lastRow + 1) + ":" + (firstRow + 1);
    }
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

    this.$cellsForInsertionBorder = $("<div>");
    this.$cellsForInsertionBorder.addClass("cells-for-insertion-border");

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

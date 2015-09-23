GoogleSheetsClone.Views.SpreadsheetShow = Backbone.CompositeView.extend({
  template: JST["spreadsheets/show"],

  initialize: function () {
    this.model.fetch({
      success: function () {
        GoogleSheetsClone.cells = this.model.cells();
        GoogleSheetsClone.spreadsheet = this.model;
        this.okForSelectAllToBeRendered = true;
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
          this.handleDeleteKey(e);
          break;
        case 46:
          this.handleDeleteKey(e);
          break;
        case 27:
          this.handleEscape(e);
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
      var neighbour;
      if (e.shiftKey) {
        neighbour = this.neighbourInDirection(this.$lastLiForCopy, e.keyCode);
      } else {
        neighbour = this.neighbourInDirection(this.$selectedLi, e.keyCode);
      }

      if (neighbour) {
        if (this.editing()) {
          this.finishEditing();
        }
        if (!e.shiftKey) {
          this.selectCell(neighbour);
        }
        this.$lastLiForCopy = neighbour;
        this.renderSelectionForCopy();
      }
    } else if (this.editingFormula() && !this.editingFormulaBar()) {
      e.preventDefault();

      var $neighbour;
      if (this.inserting) {
        if (e.shiftKey) {
          $neighbour = this.neighbourInDirection(this.$lastLiForInsertion, e.keyCode);
        } else {
          $neighbour = this.neighbourInDirection(this.$firstLiForInsertion, e.keyCode);
        }
      } else {
        $neighbour = this.neighbourInDirection(this.$selectedLi, e.keyCode);
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
          return this.$("li.cell:nth-child(" + ($li.index() - this.model.get("width") + 1) + ")");
        }
        return null;
      case 39:
        if (($li.index() + 1) % this.model.get("width") !== 0) {
          return this.$("li.cell:nth-child(" + ($li.index() + 2) + ")");
        }
        return null;
      case 40:
        if ($li.index() < (this.model.get("height") * this.model.get("width")) - this.model.get("height")) {
          return this.$("li.cell:nth-child(" + ($li.index() + this.model.get("width") + 1) + ")");
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

  mouseDownCell: function (e) {
    e.preventDefault();
    if (this.editing()) {
      if (this.$selectedLi.index() === $(e.currentTarget).index()) {
        this.currentInputField = ".cell-contents.input";
        this.$selectedLi.find("input").focus();
      } else if (this.editingFormula()) {
        this.$firstLiForInsertion = this.$lastLiForInsertion = $(e.currentTarget);
        this.draggingOverCols = false;
        this.dragging = true;
        this.updateInsertedRef(e.ctrlKey || e.metaKey);
        this.renderSelectionForInsertion();
      } else {
        this.finishEditing();
        this.selectCell($(e.currentTarget));
        this.beginDraggingForCopy();
      }
    } else {
      this.selectCell($(e.currentTarget));
      this.beginDraggingForCopy();
    }
  },

  beginDraggingForCopy: function () {
    this.draggingForCopy = true;
    this.renderSelectionForCopy();
  },

  mouseDownColumnHeader: function (e) {
    e.preventDefault();
    var col = $(e.currentTarget).index();
    if (this.editingFormula()) {
      this.$firstLiForInsertion = this.cellLiAtPos(this.model.get("height") - 1, col);
      this.$lastLiForInsertion = this.cellLiAtPos(0, col);
      this.draggingOverCols = true;
      this.updateInsertedRef(e.ctrlKey || e.metaKey);
      this.renderSelectionForInsertion();
    } else {
      if (this.editing()) {
        this.finishEditing();
      }
      this.selectCell(this.cellLiAtPos(0, col));
      this.$lastLiForCopy = this.cellLiAtPos(this.model.get("height") - 1, col);
      this.draggingOverColsForCopy = true;
      this.renderSelectionForCopy(true);
    }
  },

  mouseDownRowHeader: function (e) {
    e.preventDefault();
    if (this.editingFormula()) {
      var row = $(e.currentTarget).index();
      this.$firstLiForInsertion = this.cellLiAtPos(row, this.model.get("width") - 1);
      this.$lastLiForInsertion = this.cellLiAtPos(row, 0);
      this.draggingOverRows = true;
      this.updateInsertedRef(e.ctrlKey || e.metaKey);
      this.renderSelectionForInsertion();
    }
  },

  clickSelectAll: function (e) {
    e.preventDefault();
    if (this.editingFormula()) {
      this.$firstLiForInsertion = this.cellLiAtPos(this.model.get("height") - 1,
        this.model.get("width") - 1);
      this.$lastLiForInsertion = this.cellLiAtPos(0, 0);
      this.updateInsertedRef(e.ctrlKey || e.metaKey);
      this.renderSelectionForInsertion();
    } else {
      if (this.editing) {
        this.finishEditing();
      }
      this.selectCell(this.cellLiAtPos(0, 0));
      this.$lastLiForCopy = this.cellLiAtPos(this.model.get("height") - 1,
        this.model.get("width") - 1);
      this.renderSelectionForCopy(true);
    }
  },

  updateInsertedRef: function (commaAndNewInsertion) {
    var newInsertedRef;
    if (this.$firstLiForInsertion.index() === this.$lastLiForInsertion.index()) {
      newInsertedRef = this.refToCell(this.$firstLiForInsertion);
    } else if (this.cellCol(this.$firstLiForInsertion) === this.model.get("width") - 1 && this.cellCol(this.$lastLiForInsertion) === 0) {
      newInsertedRef = this.refToRowRange(this.cellRow(this.$firstLiForInsertion), this.cellRow(this.$lastLiForInsertion));
    } else if (this.cellRow(this.$firstLiForInsertion) === this.model.get("height") - 1 && this.cellRow(this.$lastLiForInsertion) === 0) {
      newInsertedRef = this.refToColRange(this.cellCol(this.$firstLiForInsertion), this.cellCol(this.$lastLiForInsertion));
    } else {
      newInsertedRef = this.refToRange(this.$firstLiForInsertion, this.$lastLiForInsertion);
    }

    var input = this.$(this.currentInputField);

    var afterInsertedRef;
    if (!this.inserting) {
      this.inserting = true;
      this.caretPosition = this.$(this.currentInputField).caret();
      if (commaAndNewInsertion) {
        input.val(input.val().slice(0, this.caretPosition) + "," + input.val().slice(this.caretPosition));
        this.caretPosition += 1;
      }
      afterInsertedRef = input.val().slice(this.caretPosition);
    } else {
      if (commaAndNewInsertion) {
        this.finishInserting();
        this.updateInsertedRef(true);
        return;
      }
      afterInsertedRef = input.val().slice(this.caretPosition + this.currentInsertedRef.length);
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
    this.renderSelection(
      this.$firstLiForInsertion,
      this.$lastLiForInsertion,
      this.$cellsForInsertionBorder,
      "selected-for-insertion"
    );
  },

  renderSelectionForCopy: function (scrollToFirst) {
    if (this.$selectedLi.index() !== this.$lastLiForCopy.index()) {
      var $liToScrollTo, $liAtOtherEnd;
      if (scrollToFirst) {
        $liToScrollTo = this.$selectedLi;
        $liAtOtherEnd = this.$lastLiForCopy;
      } else {
        $liToScrollTo = this.$lastLiForCopy;
        $liAtOtherEnd = this.$selectedLi;
      }
      this.renderSelection(
        $liAtOtherEnd,
        $liToScrollTo,
        null,
        "selected-for-copy"
      );
    } else {
      this.$(".cell").removeClass("selected-for-copy");
    }
  },

  renderSelection: function ($firstLi, $lastLi, $border, classToApply) {
    var firstCol = this.cellCol($firstLi);
    var lastCol = this.cellCol($lastLi);
    var firstRow = this.cellRow($firstLi);
    var lastRow = this.cellRow($lastLi);

    var topMostRow = Math.min(firstRow, lastRow);
    var bottomMostRow = Math.max(firstRow, lastRow);
    var leftMostCol = Math.min(firstCol, lastCol);
    var rightMostCol = Math.max(firstCol, lastCol);

    this.$(".cell").removeClass(classToApply);

    var borderHeight = -5;

    for (var row = topMostRow; row <= bottomMostRow; row++) {
      borderHeight += this.$(".row-header:nth-child(" + (row + 1) + ")").height() + 1;
      for (var col = leftMostCol; col <= rightMostCol; col++) {
        this.cellLiAtPos(row, col).addClass(classToApply);
      }
    }

    if ($border) {
      var borderWidth = -5;
      for (var colu = leftMostCol; colu <= rightMostCol; colu++) {
        borderWidth += this.$(".column-header:nth-child(" + (colu + 1) + ")").width() + 1;
      }

      $border.css("left", ""+ (this.cellLiAtPos(0, leftMostCol).position().left - 1) + "px");
      $border.css("top", "" + (this.cellLiAtPos(topMostRow, 0).position().top - 1) + "px");
      $border.css("width", borderWidth + "px");
      $border.css("height", borderHeight + "px");
      this.$("#cells").append($border);
    }

    this.scrollIfOutOfWindow($lastLi);
  },

  finishInserting: function () {
    this.$(".cell").removeClass("selected-for-insertion");
    this.$cellsForInsertionBorder.remove();
    this.scrollIfOutOfWindow(this.$selectedLi);
    this.inserting = false;
  },

  mouseOverCell: function (e) {
    if (this.dragging) {
      this.$lastLiForInsertion = $(e.currentTarget);
      this.updateInsertedRef();
      this.renderSelectionForInsertion();
    } else if (this.draggingOverCols) {
      this.$lastLiForInsertion = this.cellLiAtPos(0, this.cellCol($(e.currentTarget)));
      this.updateInsertedRef();
      this.renderSelectionForInsertion();
    } else if (this.draggingOverRows) {
      this.$lastLiForInsertion = this.cellLiAtPos(this.cellRow($(e.currentTarget)), 0);
      this.updateInsertedRef();
      this.renderSelectionForInsertion();
    } else if (this.draggingForCopy) {
      this.$lastLiForCopy = $(e.currentTarget);
      this.renderSelectionForCopy();
    } else if (this.draggingOverColsForCopy) {
      this.$lastLiForCopy = this.cellLiAtPos(this.model.get("height") - 1, this.cellCol($(e.currentTarget)));
      this.renderSelectionForCopy(true);
    }
  },

  mouseOverColumnHeader: function (e) {
    if (this.draggingOverCols) {
      this.$lastLiForInsertion = this.cellLiAtPos(0, $(e.currentTarget).index());
      this.updateInsertedRef();
      this.renderSelectionForInsertion();
    } else if (this.draggingOverColsForCopy) {
      this.$lastLiForCopy = this.cellLiAtPos(this.model.get("height") - 1, $(e.currentTarget).index());
      this.renderSelectionForCopy(true);
    }
  },

  mouseOverRowHeader: function (e) {
    if (this.draggingOverRows) {
      this.$lastLiForInsertion = this.cellLiAtPos($(e.currentTarget).index(), 0);
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
    } else if (this.draggingForCopy || this.draggingOverColsForCopy) {
      this.draggingForCopy = false;
      this.draggingOverColsForCopy = false;
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
      this.$lastLiForCopy = $newLi;
      this.$selectedLi.focus();
      this.$selectedLi.trigger("select");
      this.$(".formula-bar-input").val(this.$selectedLi.find(".cell-contents").data("contents"));
      this.scrollIfOutOfWindow(this.$selectedLi);
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

    this.applyColumnWidths();
    this.applyRowHeights();

    if (this.okForSelectAllToBeRendered) {
      var $selectAll = $("<div>");
      $selectAll.attr("id", "select-all");
      this.$el.append($selectAll);
    }

    return this;
  },

  applyColumnWidths: function () {
    var totalWidth = this.$("ul#column-headers").width();

    this.model.columns().forEach(function (column) {
      var width = column.get("width");
      var col_index = column.get("col_index");
      totalWidth += (width - 175);
      this.$("li.column-header:nth-child(" + (col_index + 1) + ")")
        .css("width", width + "px");
      this.$("li.cell:nth-child(" +
        this.model.get("width") + "n+" + (col_index + 1) + ")")
        .css("width", width + "px");
    }.bind(this));

    this.$("ul#column-headers").css("width", totalWidth + "px");
    this.$("ul#cells").css("width", totalWidth + "px");
  },

  applyRowHeights: function () {
    this.model.rows().forEach(function (row) {
      var height = row.get("height");
      var row_index = row.get("row_index");
      var $rowHeader = this.$("li.row-header:nth-child(" + (row_index + 1) + ")");
      $rowHeader.css("height", height + "px");
      this.updateRowHeaderPadding($rowHeader);
      this.$("li.cell:nth-child(n+" +
        (this.model.get("width") * row_index + 1) + "):nth-child(-n+" +
        (this.model.get("width") * (row_index + 1)) + ")")
        .css("height", height + "px");
    }.bind(this));
  },

  renderColumnHeaders: function () {
    var $ul = this.$("ul#column-headers");

    for(var col = 0; col < this.model.get("width"); col++) {
      var $li = $("<li>");
      $li.addClass("column-header");
      $li.text(GoogleSheetsClone.columnName(col));
      $ul.append($li);
      $li.resizable({
        handles: "e",
        minWidth: 35,
        alsoResize: "ul#cells, ul#column-headers, li.cell:nth-child(" +
          this.model.get("width") + "n+" + ($li.index() + 1) + ")",
        stop: this.saveColumnWidth.bind(this)
      });
    }
  },

  saveColumnWidth: function (e, ui) {
    var col_index = ui.element.index();
    var columnModel = this.model.columns().findWhere({
      col_index: col_index
    });

    if (!columnModel) {
      columnModel = new GoogleSheetsClone.Models.Column({
        col_index: col_index,
        spreadsheet_id: this.model.id
      });
      this.model.columns().add(columnModel);
    }

    GoogleSheetsClone.statusAreaView.displaySaving();

    columnModel.save({ width: ui.size.width }, {
      success: function () {
        GoogleSheetsClone.statusAreaView.finishSaving();
      }
    });
  },

  finishResizingRow: function (e, ui) {
    this.updateRowHeaderPadding(ui.element);
    this.saveRowHeight(e, ui);
  },

  updateRowHeaderPadding: function ($rowHeader) {
    $rowHeader.find("div.row-header-label").css("padding-top", (($rowHeader.height() - 19) / 2) + "px");
  },

  duringResizingRow: function (e, ui) {
    this.updateRowHeaderPadding(ui.element);
  },

  saveRowHeight: function (e, ui) {
    var row_index = ui.element.index();
    var rowModel = this.model.rows().findWhere({
      row_index: row_index
    });

    if (!rowModel) {
      rowModel = new GoogleSheetsClone.Models.Row({
        row_index: row_index,
        spreadsheet_id: this.model.id
      });
      this.model.rows().add(rowModel);
    }

    GoogleSheetsClone.statusAreaView.displaySaving();

    rowModel.save({ height: ui.size.height }, {
      success: function () {
        GoogleSheetsClone.statusAreaView.finishSaving();
      }
    });
  },

  renderRowHeaders: function () {
    var $ul = this.$("ul#row-headers");

    for(var row = 0; row < this.model.get("height"); row++) {
      var $li = $("<li>");
      var $div = $("<div>");
      $li.addClass("row-header");
      $div.addClass("row-header-label");
      $div.text(row + 1);
      $li.append($div);
      $ul.append($li);
      $li.resizable({
        handles: "s",
        minHeight: 35,
        alsoResize: "ul#cells, ul#row-headers, li.cell:nth-child(n+" +
          (this.model.get("width") * $li.index() + 1) + "):nth-child(-n+" +
          (this.model.get("width") * ($li.index() + 1)) + ")",
        stop: this.finishResizingRow.bind(this),
        resize: this.duringResizingRow.bind(this)
      });
    }
  },

  renderCells: function () {
    var $ul = this.$("ul#cells");

    var cellIdx = 0;

    for(var row = 0; row < this.model.get("height"); row++) {
      for(var col = 0; col < this.model.get("width"); col++) {
        var cell = this.model.cells().at(cellIdx);

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
        }));
      }
    }

    this.selectCell($("li.cell:nth-child(1)"));
  },

  renderAllCells: function () {
    this.model.cells().each(function (cell) {
      cell.trigger("render");
    });
  },

  scrollIfOutOfWindow: function ($elToScrollTo) {
    if ($elToScrollTo.offset() === undefined) {
      return;
    }

    var $body = $("body");

    if ($elToScrollTo.offset().top + 37 > $body.scrollTop() + $(window).height()) {
      $body.scrollTop($elToScrollTo.offset().top + 37 - $(window).height());
    } else if ($elToScrollTo.offset().top < $body.scrollTop() + 135) {
      $body.scrollTop($elToScrollTo.offset().top - 135);
    }

    if ($elToScrollTo.offset().left + 176 > $body.scrollLeft() + $(window).width()) {
      $body.scrollLeft($elToScrollTo.offset().left + 176 - $(window).width());
    } else if ($elToScrollTo.offset().left < $body.scrollLeft() + 60) {
      $body.scrollLeft($elToScrollTo.offset().left - 60);
    }
  }
});

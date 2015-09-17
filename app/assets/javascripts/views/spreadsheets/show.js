GoogleSheetsClone.Views.SpreadsheetShow = Backbone.CompositeView.extend({
  template: JST["spreadsheets/show"],

  initialize: function () {
    this.listenTo(this.model, "sync", this.render);
    $(document).on("keypress", this.keyPress.bind(this));
    $(document).on("keydown", this.keyDown.bind(this));
    $(window).scroll(this.scroll);
    this.editingSelected = false;
    this.$selectedLi = null;
  },

  events: {
    "click .formula-bar-input": "clickFormulaBar",
    "click .cell": "clickCell",
    "dblclick .cell": "dblClickCell",
    "input .cell-contents.input": "updateFormulaBar",
    "input .formula-bar-input": "updateSelectedLi",
    "keyDown": "keyDown"
  },

  keyDown: function (e) {
    if (!GoogleSheetsClone.titleView.editing)  {
      if (e.keyCode === 37 && this.liLeft()) {
        e.preventDefault();
        this.selectCell(this.liLeft());
      } else if (e.keyCode === 38 && this.liAbove()) {
        e.preventDefault();
        this.selectCell(this.liAbove());
      } else if (e.keyCode === 39 && this.liRight()) {
        e.preventDefault();
        this.selectCell(this.liRight());
      } else if (e.keyCode === 40 && this.liBelow()) {
        e.preventDefault();
        this.selectCell(this.liBelow());
      } else if ((e.keyCode === 8 || e.keyCode === 46) && !this.editingSelected) {
        e.preventDefault();
        this.$(".formula-bar-input").val("");
        this.$selectedLi.trigger("delete");
      } else if (e.keyCode === 27 && this.editingSelected) {
        e.preventDefault();
        this.editingSelected = false;
        this.$selectedLi.trigger("cancelEditing");
        this.$(".formula-bar-input").blur();
        this.$(".formula-bar-input").val(this.$selectedLi.find(".cell-contents").text());
      }
    }
  },

  clickFormulaBar: function (e) {
    if (!this.editingSelected) {
      this.editingSelected = true;
      this.$selectedLi.trigger("beginEditing");
    }
    $(e.currentTarget).focus();
  },

  updateFormulaBar: function (e) {
    this.$(".formula-bar-input").val($(e.currentTarget).val());
  },

  updateSelectedLi: function (e) {
    this.$selectedLi.find(".cell-contents").val($(e.currentTarget).val());
  },

  liAbove: function () {
    if (this.$selectedLi.index() >= this.model.get("width")) {
      return this.$("li.cell:nth-child(" + (this.$selectedLi.index() - this.model.get("width") + 1) + ")")
    }
  },

  liBelow: function () {
    if (this.$selectedLi.index() < (this.model.get("height") * this.model.get("width")) - this.model.get("height")) {
      return this.$("li.cell:nth-child(" + (this.$selectedLi.index() + this.model.get("width") + 1) + ")")
    }
  },

  liLeft: function () {
    if (this.$selectedLi.index() % this.model.get("width") !== 0) {
      return this.$("li.cell:nth-child(" + this.$selectedLi.index() + ")")
    }
  },

  liRight: function () {
    if ((this.$selectedLi.index() + 1) % this.model.get("width") !== 0) {
      return this.$("li.cell:nth-child(" + (this.$selectedLi.index() + 2) + ")")
    }
  },

  keyPress: function (e) {
    if (!GoogleSheetsClone.titleView.editing) {
      if (e.keyCode === 13) {
        if (this.editingSelected) {
          this.editingSelected = false;
          this.$selectedLi.trigger("finishEditing");
          this.$(".formula-bar-input").blur();
          if (this.liBelow()) {
            this.selectCell(this.liBelow());
          }
        } else {
          this.editingSelected = true;
          this.$selectedLi.trigger("beginEditing");
        }
      } else if (!this.editingSelected) {
        this.editingSelected = true;
        this.$selectedLi.trigger("beginEditing", true);
      }
    }
  },

  clickCell: function (e) {
    this.selectCell($(e.currentTarget));
  },

  dblClickCell: function (e) {
    if (!this.editingSelected) {
      this.editingSelected = true;
      this.$selectedLi.trigger("beginEditing");
    }
  },

  // This method is profoundly delicate, don't mess it up!
  selectCell: function ($newLi) {
    if ((!this.$selectedLi) || this.$selectedLi.index() !== $newLi.index()) {
      if (this.$selectedLi) {
        this.$selectedLi.trigger("unselect");
      }
      this.$(".formula-bar-input").blur();
      this.editingSelected = false;
      this.$selectedLi = $newLi;
      this.$selectedLi.focus();
      this.$selectedLi.trigger("select");
      this.$(".formula-bar-input").val(this.$selectedLi.find(".cell-contents").text());
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

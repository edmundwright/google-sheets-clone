GoogleSheetsClone.Views.SpreadsheetShow = Backbone.CompositeView.extend({
  template: JST["spreadsheets/show"],

  initialize: function () {
    this.listenTo(this.model, "sync", this.render);
    $(window).scroll(this.scroll);
    this.selectedCell = null;
    this.$selectedLi = null;
  },

  events: {
    "click .cell": "clickCell",
    "dblclick .cell": "dblClickCell",
    "submit form.cell-form": "submitCellForm"
  },

  clickCell: function (e) {
    this.selectCell($(e.currentTarget));
  },

  dblClickCell: function (e) {
    this.$selectedLi.trigger("beginEditing");
  },

  // This method is profoundly delicate, don't mess it up!
  selectCell: function ($newLi) {
    if ((!this.$selectedLi) || this.$selectedLi.index() !== $newLi.index()) {
      if (this.$selectedLi) {
        this.$selectedLi.trigger("unselect");
      }
      this.$selectedLi = $newLi;
      this.$selectedLi.append(this.$selectedCellBorder);
    }
  },

  submitCellForm: function (e) {
    e.preventDefault();
    var newContents = $(e.currentTarget).serializeJSON().cell.contents;
    this.selectedModel.save({ contents_str: newContents }, {
      success: function () {
        if (this.selectedModel.get("row_index") !== this.model.get("height")-1) {
          var $liBelow = this.$("li.cell:nth-child(" + (this.$selectedCellLi.index() + this.model.get("width") + 1) + ")");
          this.selectCell($liBelow);
        }
      }.bind(this)
    })
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
      $li.text(col + 1);
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
          spreadsheet: this.model
        }))
      }
    }
  }
});

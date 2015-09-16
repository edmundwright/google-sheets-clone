GoogleSheetsClone.Views.SpreadsheetShow = Backbone.View.extend({
  template: JST["spreadsheets/show"],

  initialize: function () {
    this.listenTo(this.model, "sync", this.render);
    $(window).scroll(this.scroll);
  },

  events: {
    "click .cell": "clickCell",
    "submit form.cell-form": "submitCellForm"
  },

  submitCellForm: function (e) {
    e.preventDefault();
    var newContents = $(e.currentTarget).serializeJSON().contents;
    this.selectedModel.save({ contents_str: newContents }, {
      success: function () {
        if (this.selectedModel.get("row_index") !== this.model.get("height")-1) {
          var $liBelow = this.$("li.cell:nth-child(" + (this.$selectedCellLi.index() + this.model.get("width") + 1) + ")");
          debugger
          this.selectCell($liBelow);
        }
      }.bind(this)
    })
  },

  clickCell: function (e) {
    this.selectCell($(e.currentTarget));
  },

  selectCell: function ($cellLi) {
    this.$("div.selected-cell-border").remove();
    this.$(".cell-input").removeClass("selected-cell-input");

    this.$selectedCellLi = $cellLi;
    var $border = $("<div>");
    $border.addClass("selected-cell-border");
    this.$selectedCellLi.append($border)

    this.$selectedCellLi.find("input").addClass("selected-cell-input").focus();

    this.selectedModel = this.model.cells()
      .get(this.$selectedCellLi.data("cell-id"))
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
    var $ul = this.$("ul#cells");

    this.model.cells().each(function (cell) {
      var contents = cell.get("contents_str") ||
                     cell.get("contents_int") ||
                     cell.get("contents_flo");
      if (contents === null) {
        contents = "";
      }
      var $li = $("<li>");
      $li.data("cell-id", cell.id);
      var $form = $("<form>");
      $form.addClass("cell-form");
      var $input = $("<input>");
      $input.addClass("cell-input");
      $input.attr("type", "text");
      $input.attr("name", "contents");
      $input.val(contents)
      $form.append($input)
      $li.append($form)
      $li.addClass("cell");
      $ul.append($li);
    })
  }
});

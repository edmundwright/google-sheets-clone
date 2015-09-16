GoogleSheetsClone.Views.SpreadsheetShow = Backbone.View.extend({
  template: JST["spreadsheets/show"],

  initialize: function () {
    this.listenTo(this.model, "sync", this.render);
  },

  render: function () {
    this.$el.html(this.template({
      spreadsheet: this.model
    }));

    this.renderCells();

    return this;
  },

  renderCells: function () {
    var currentRow = 1;

    var $rowHeader = $("<li>");
    $rowHeader.addClass("row-header");
    $rowHeader.text(1);
    this.$("ul#row-headers").append($rowHeader);

    this.model.cells().each(function (cell) {
      if (cell.get("row_index") === currentRow) {
        if (currentRow === 1) {
          var $colHeader = $("<li>");
          $colHeader.addClass("column-header");
          $colHeader.text(cell.get("col_index"));
          this.$("ul#column-headers").append($colHeader);
        }
      } else {
        currentRow += 1;
        var $rowHeader = $("<li>");
        $rowHeader.addClass("row-header");
        $rowHeader.text(currentRow);
        this.$("ul#row-headers").append($rowHeader);
      }
    }.bind(this));
  }
});

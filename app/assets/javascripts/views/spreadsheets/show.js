GoogleSheetsClone.Views.SpreadsheetShow = Backbone.View.extend({
  template: JST["spreadsheets/show"],

  initialize: function () {
    this.listenTo(this.model, "sync", this.render);
    $(window).scroll(this.scroll);
  },

  scroll: function () {
    console.log("hi");
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
      $li.addClass("cell");
      $li.text(contents)
      $ul.append($li);
    })
  }
});

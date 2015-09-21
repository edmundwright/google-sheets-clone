GoogleSheetsClone.Views.SpreadsheetIndexItem = Backbone.View.extend({
  template: JST["spreadsheets/indexItem"],

  tagName: "li",

  events: {
    "click": "click",
    "contextmenu": "rightClick"
  },

  rightClick: function (e) {
    e.preventDefault();
    $(".context-menu").remove();
    this.openContextMenu();
  },

  click: function(e) {
    if($(e.target).hasClass("dot") || $(e.target).hasClass("context-menu-link")) {
      $(".context-menu").remove();
      this.openContextMenu();
    } else if ($(e.target).hasClass("delete-link")) {
      $("body").append(new GoogleSheetsClone.Views.SpreadsheetDelete({
        model: this.model
      }).render().$el)
      $(".context-menu").remove();
    } else {
      this.show();
    }
  },

  show: function () {
    Backbone.history.navigate("#spreadsheets/" + this.model.id, { trigger: true })
  },

  initialize: function (options) {
    this.today = options.today;
  },

  render: function () {
    this.$el.data("spreadsheet-id", this.model.id)

    this.$el.html(this.template({
      spreadsheet: this.model
    }));

    return this;
  },

  openContextMenu: function () {
    var $contextMenu = JST["spreadsheets/indexItemContextMenu"]();
    this.$el.append($contextMenu);
  }
});

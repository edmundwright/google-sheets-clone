GoogleSheetsClone.Views.SpreadsheetIndexItem = Backbone.View.extend({
  template: JST["spreadsheets/indexItem"],

  tagName: "li",

  events: {
    "click": "click",
    "contextmenu": "rightClick"
  },

  rightClick: function (e) {
    e.preventDefault();
    $(".index-context-menu").remove();
    this.openContextMenu();
  },

  click: function(e) {
    if($(e.target).hasClass("dot") || $(e.target).hasClass("context-menu-link")) {
      $(".index-context-menu").remove();
      this.openContextMenu();
    } else if ($(e.target).hasClass("delete-link")) {
      this.openDeleteModal();
    } else if ($(e.target).hasClass("rename-link")) {
      this.openRenameModal();
    } else if ($(e.target).hasClass("sharing-options-link")) {
      this.openSharingModal();
    } else {
      this.show();
    }
  },

  openDeleteModal: function () {
    $("body").append(new GoogleSheetsClone.Views.SpreadsheetDelete({
      model: this.model
    }).render().$el);
    $(".index-context-menu").remove();
  },

  openSharingModal: function () {
    var collection = new GoogleSheetsClone.Collections.Shares([], {
      spreadsheet: this.model
    });
    collection.fetch({
      success: function () {
        $("body").append(new GoogleSheetsClone.Views.ShareIndex({
          collection: collection
        }).render().$el);
        $(".index-context-menu").remove();
      }
    });
  },

  openRenameModal: function () {
    var renameView = new GoogleSheetsClone.Views.SpreadsheetRename({
      model: this.model
    });
    $("body").append(renameView.render().$el);
    renameView.focus();
    $(".index-context-menu").remove();
  },

  show: function () {
    Backbone.history.navigate("#spreadsheets/" + this.model.id, { trigger: true });
  },

  initialize: function (options) {
    this.today = options.today;
  },

  render: function () {
    this.$el.data("spreadsheet-id", this.model.id);

    this.$el.html(this.template({
      spreadsheet: this.model
    }));

    return this;
  },

  openContextMenu: function () {
    var $contextMenu = JST["spreadsheets/indexItemContextMenu"]({
      spreadsheet: this.model
    });
    this.$el.append($contextMenu);
  }
});

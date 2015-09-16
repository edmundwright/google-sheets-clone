GoogleSheetsClone.Collections.Cells = Backbone.Collection.extend({
  model: GoogleSheetsClone.Models.Cell,

  comparator: function (firstCell, secondCell) {
    if (firstCell.get("row_index") < secondCell.get("row_index")) {
      return -1;
    } else if (firstCell.get("row_index") > secondCell.get("row_index")) {
      return 1;
    } else if (firstCell.get("col_index") < secondCell.get("col_index")) {
      return -1;
    } else {
      return 1;
    }
  }
});

GoogleSheetsClone.columnName = function (columnIndex) {
  return String.fromCharCode("A".charCodeAt() + columnIndex);
}

GoogleSheetsClone.columnIndex = function (columnName) {
  return columnName.charCodeAt() - "A".charCodeAt();
}

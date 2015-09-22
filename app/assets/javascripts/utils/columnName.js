GoogleSheetsClone.columnName = function (columnIndex) {
  return String.fromCharCode("A".charCodeAt() + columnIndex);
};

GoogleSheetsClone.columnIndex = function (columnName) {
  if (columnName.charCodeAt() >= "A".charCodeAt() &&
    columnName.charCodeAt() <= "Z".charCodeAt()) {
    return columnName.charCodeAt() - "A".charCodeAt();
  } else if (columnName.charCodeAt() >= "a".charCodeAt() &&
    columnName.charCodeAt() <= "z".charCodeAt()) {
    return columnName.charCodeAt() - "a".charCodeAt();        
  }
};

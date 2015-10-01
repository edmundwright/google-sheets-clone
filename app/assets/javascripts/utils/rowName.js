GoogleSheetsClone.rowName = function (rowIndex) {
  return (rowIndex + 1).toString();
};

GoogleSheetsClone.rowIndex = function (rowName) {
  return parseInt(rowName) - 1;
};

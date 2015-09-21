(function () {
  var evaluate = GoogleSheetsClone.evaluate = function (formula) {
    if ((typeof formula === "number") || (typeof formula === "object")) {
      return formula;
    }

    var newFormula = formula.replace(/ /g, '');
    var oldFormula = "";

    while (oldFormula != newFormula && isNaN(newFormula) && (typeof newFormula !== "object")) {
      var oldFormula = newFormula;
      newFormula = evaluateOnePart(newFormula);
    }

    if (!isNaN(newFormula)) {
      newFormula = Number(newFormula);
    }

    return newFormula;
  };

  var evaluateOnePart = function (formula) {
    var newFormula = "";

    for(var i = formula.length - 1; i >= 0; i--) {
      if (formula.slice(i - 2, i + 1).toUpperCase() === "SUM") {
        return evaluateSum(formula, i);
      }
    }

    for(var i = formula.length - 1; i >= 0; i--) {
      if (formula[i] === ",") {
        return evaluateComma(formula);
      }
    }

    for(var i = formula.length - 1; i >= 0; i--) {
      if (formula[i] === ":") {
        return evaluateColon(formula);
      }
    }

    for(var i = formula.length - 1; i >= 0; i--) {
      if (formula[i].match(/[a-z]/i)) {
        return evaluateReference(formula, i);
      }
    }

    for(var i = formula.length - 1; i >= 0; i--) {
      if (formula[i] === ")") {
        return evaluateBrackets(formula, i);
      }
    }

    for(var i = formula.length - 1; i >= 0; i--) {
      if (formula[i] === "+") {
        return evaluateSimpleOperation(formula, i, "+");
      } else if (formula[i] === "-" &&
                 i !== 0 &&
                 formula[i-1] != "+" &&
                 formula[i-1] != "-" &&
                 formula[i-1] != "*" &&
                 formula[i-1] != "/" &&
                 formula[i-1] != "^") {
        return evaluateSimpleOperation(formula, i, "-");
      }
    }
    for(var i = formula.length - 1; i >= 0; i--) {
      if (formula[i] === "*") {
        return evaluateSimpleOperation(formula, i, "*");
      } else if (formula[i] === "/") {
        return evaluateSimpleOperation(formula, i, "/");
      }
    }
    for(var i = formula.length - 1; i >= 0; i--) {
      if (formula[i] === "^") {
        return evaluateSimpleOperation(formula, i, "^");
      }
    }

    return formula;
  };

  var evaluateComma = function (formula) {
    var result = [];

    formula.split(",").forEach(function (el) {
      var evaluatedEl = evaluate(el);
      if (Array.isArray(evaluatedEl)) {
        result = result.concat(evaluatedEl);
      } else {
        result.push(evaluatedEl);
      }
    })

    return result;
  };

  var evaluateColon = function (formula) {
    var firstAndLast = formula.split(":");
    if (firstAndLast.length !== 2) {
      throw "formulaNotWellFormed";
    }
    var first = firstAndLast[0];
    var last = firstAndLast[1];

    for (var i = 0; i < first.length; i++) {
      if (first[i].match(/[0-9]/)) {
        break;
      }
    }
    var firstColIndex = GoogleSheetsClone.columnIndex(first.slice(0, i));
    var firstRowIndex = parseInt(first.slice(i)) - 1;

    for (var i = 0; i < last.length; i++) {
      if (last[i].match(/[0-9]/)) {
        break;
      }
    }
    var lastColIndex = GoogleSheetsClone.columnIndex(last.slice(0, i));
    var lastRowIndex = parseInt(last.slice(i)) - 1;

    if (isNaN(firstColIndex) && isNaN(lastColIndex)) {
      firstColIndex = 0;
      lastColIndex = GoogleSheetsClone.spreadsheet.get("width") - 1
    } else if (isNaN(firstRowIndex) && isNaN(lastRowIndex)) {
      firstRowIndex = 0;
      lastRowIndex = GoogleSheetsClone.spreadsheet.get("height") - 1
    }

    var cells = [];
    for (var colIndex = firstColIndex; colIndex <= lastColIndex; colIndex++) {
      for (var rowIndex = firstRowIndex; rowIndex <= lastRowIndex; rowIndex++) {
        var thisCell = GoogleSheetsClone.cells.findByPos(rowIndex, colIndex)
        cells.push(thisCell);
      }
    }

    return cells.map(function (cell) {
      if (!cell) {
        return 0;
      } else if (cell.get("contents_str") && cell.get("contents_str")[0] === "=") {
        return evaluate(cell.get("contents_str").slice(1));
      } else if (cell.get("contents_str")) {
        throw "badReference";
      } else {
        return cell.contents();
      }
    })
  };

  var evaluateReference = function (formula, letterPos) {
    var rowName = "";
    var lastRowNameIndex;
    for (var i = letterPos + 1; i < formula.length; i++) {
      if (formula[i].match(/[0-9]/)) {
        rowName += formula[i];
        lastRowNameIndex = i
      } else {
        break;
      }
    }

    if (lastRowNameIndex === undefined) {
      throw "formulaNotWellFormed";
    }

    var colName = "";
    var firstColNameIndex;
    for (var i = letterPos; i >= 0; i--) {
      if (formula[i].match(/[a-z]/i)) {
        colName = formula[i] + colName;
        firstColNameIndex = i;
      } else {
        break;
      }
    }

    var colIndex = GoogleSheetsClone.columnIndex(colName);
    var rowIndex = parseInt(rowName) - 1;
    var cell = GoogleSheetsClone.cells.findByPos(rowIndex, colIndex);

    if (!cell) {
      var evaluatedCellContents = "";
    } else if (cell.get("contents_str") && cell.get("contents_str")[0] === "=") {
      var evaluatedCellContents = evaluate(cell.get("contents_str").slice(1));
    } else if (cell.get("contents_str")) {
      throw "badReference";
    } else {
      var evaluatedCellContents = cell.contents();
    }

    return formula.slice(0, firstColNameIndex) +
      evaluatedCellContents +
      formula.slice(lastRowNameIndex + 1);
  };

  var evaluateSum = function (formula, mPos) {
    for(var i = mPos + 2; i < formula.length; i++) {
      if (formula[i] === ")") {
        break;
      }
    }

    var toSum = evaluate(formula.slice(mPos + 2, i));

    if (typeof toSum === "object") {
      var sum = toSum.reduce(function(x, y) {
        return x + y;
      });
    } else {
      var sum = toSum;
    }

    return formula.slice(0, mPos - 2) +
      sum +
      formula.slice(i + 1);
  };

  var evaluateSimpleOperation = function (formula, operatorPos, operator) {
    var leftHandSide = GoogleSheetsClone.evaluate(formula.slice(0, operatorPos));
    var rightHandSide = GoogleSheetsClone.evaluate(formula.slice(operatorPos + 1));
    if (typeof leftHandSide === "number" && typeof rightHandSide === "number") {
      switch (operator) {
        case "+":
          return leftHandSide + rightHandSide;
        case "-":
          return leftHandSide - rightHandSide;
        case "*":
          return leftHandSide * rightHandSide;
        case "/":
          return leftHandSide / rightHandSide;
        case "^":
          return Math.pow(leftHandSide, rightHandSide);
      }
    } else {
      throw "formulaNotWellFormed";
    }
  };

  var evaluateBrackets = function (formula, closingBracketPos) {
    for(var i = closingBracketPos - 1; i >= 0; i--) {
      switch (formula[i]) {
        case ")":
          closingBracketPos = i;
          break;
        case "(":
          return formula.slice(0, i) +
            evaluate(formula.slice(i + 1, closingBracketPos)) +
            formula.slice(closingBracketPos + 1);
      }
    }

    throw "formulaNotWellFormed";
  };
})();

(function () {
  var evaluate = GoogleSheetsClone.evaluate = function (cell) {
    var contents_str = cell.get("contents_str");

    if (!contents_str || contents_str[0] !== "=") {
      cell.evaluation = cell.contents();
    } else {
      var formula = contents_str.slice(1).replace(/ /g, '');

      try {
        cell.evaluation = evaluateFormula(formula, cell);
      } catch (error) {
        if (error === "formulaNotWellFormed") {
          cell.evaluation = "#BAD FORMULA!";
        } else if (error === "badReference") {
          cell.evaluation = "#BAD REF!";
        } else if (error === "divideByZero") {
          cell.evaluation = "#DIV BY ZERO!";
        } else {
          cell.evaluation = "#SOME ERROR!";
        }
      }
    }

    evaluateDependents(cell);

    return cell.evaluation;
  };

  var evaluateDependents = function (cell) {
    for (var i; i < cell.dependents.length; i++) {
      GoogleSheetsClone.evaluate(cell.dependents[i]);
    }
  };

  var evaluateFormula = function (formula, cell) {
    var oldFormula = "";

    while (oldFormula != formula && isNaN(formula) && !Array.isArray(formula)) {
      oldFormula = formula;
      formula = evaluateOnePart(formula, cell);
    }

    if (!isNaN(formula)) {
      return Number(formula);
    } else {
      return formula;
    }
  };

  var evaluateOnePart = function (formula, cell) {
    var evaluationFunctions = [
      evaluateSumIfPresent,
      evaluateAverageIfPresent,
      evaluateCommasIfPresent,
      evaluateColonIfPresent
    ];

    var newFormula;

    for (var i = 0; i < evaluationFunctions.length; i++) {
      newFormula = evaluationFunctions[i](formula, cell);
      if (newFormula !== formula) {
        return newFormula;
      }
    }

    return formula;
  };

  var evaluateSumIfPresent = function (formula, cell) {
    return formula.replace(
      /SUM\((.+?)\)/i,
      function (_, stringToSum) {
        var toSum = evaluateFormula(stringToSum, cell);
        if (Array.isArray(toSum)) {
          return toSum.reduce(function (x, y) {
            return x + y;
          });
        } else {
          return toSum;
        }
      }
    );
  };

  var evaluateAverageIfPresent = function (formula, cell) {
    return formula.replace(
      /AVERAGE\((.+?)\)/i,
      function (_, stringToAverage) {
        var toAverage = evaluateFormula(stringToAverage, cell);
        if (Array.isArray(toAverage)) {
          return toAverage.reduce(function (x, y) {
            return x + y;
          }) / toAverage.length;
        } else {
          return toSum;
        }
      }
    );
  };

  var evaluateCommasIfPresent = function (formula, cell) {
    var commaSeparatedComponents = formula.split(",");
    if (commaSeparatedComponents.length === 1) {
      return formula;
    }

    var result = [];

    commaSeparatedComponents.forEach(function (el) {
      var evaluatedEl = evaluateFormula(el, cell);
      if (Array.isArray(evaluatedEl)) {
        result = result.concat(evaluatedEl);
      } else {
        result.push(evaluatedEl);
      }
    });

    return result;
  };

  var evaluateColonIfPresent = function (formula, cell) {
    var matchData = formula.match(/([a-zA-Z]+)(\d+):([a-zA-Z]+)(\d+)/);
    if (matchData === null) {
      return formula;
    }
    var firstColIndex = GoogleSheetsClone.columnIndex(matchData[1]);
    var firstRowIndex = GoogleSheetsClone.rowIndex(matchData[2]);
    var lastColIndex = GoogleSheetsClone.columnIndex(matchData[3]);
    var lastRowIndex = GoogleSheetsClone.rowIndex(matchData[4]);

    var resultArray = [];
    var referencedCell, evaluatedReference;
    for (var colIndex = firstColIndex; colIndex <= lastColIndex; colIndex++) {
      for (var rowIndex = firstRowIndex; rowIndex <= lastRowIndex; rowIndex++) {
        referencedCell = GoogleSheetsClone.cells.findByPos(rowIndex, colIndex);
        if (referencedCell) {
          if (referencedCell.evaluation === undefined) {
            evaluatedReference = evaluate(referencedCell);
          } else {
            evaluatedReference = referencedCell.evaluation;
          }
          if (isNaN(evaluatedReference)) {
            throw "badReference";
          }
          resultArray.push(evaluatedReference);
          referencedCell.addDependent(cell);
        }
      }
    }

    return resultArray;
  };
})();

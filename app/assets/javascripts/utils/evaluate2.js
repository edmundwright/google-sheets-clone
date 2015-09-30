(function () {
  var evaluate = GoogleSheetsClone.evaluate = function (cell) {
    var contents_str = cell.get("contents_str");

    if (!contents_str || contents_str[0] !== "=") {
      cell.evaluation = cell.contents();
    } else {
      var formula = contents_str.slice(1).replace(/ /g, '');
      cell.evaluation = evaluateFormula(formula, cell);
    }

    evaluateDependents(cell);

    return cell.evaluation;
  };

  var evaluateDependents = function (cell) {

  };

  var evaluateFormula = function (formula, cell) {
    var oldFormula = "";

    while (oldFormula != formula && isNaN(formula) &&
          (typeof formula !== "object")) {
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
    var functs = [
      evaluateSumIfPresent,
      evaluateAverageIfPresent
    ];

    var newFormula;

    for (var i = 0; i < functs.length; i++) {
      newFormula = functs[i](formula, cell);
      if (newFormula !== formula) {
        return newFormula;
      }
    }

    return formula;
  };

  var evaluateSumIfPresent = function (formula, cell) {
    return formula.replace(
      /SUM\((.+?)\)/i,
      function (unused, stringToSum) {
        var toSum = evaluateFormula(stringToSum, cell);
        if (typeof toSum === "object") {
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
      function (unused, stringToAverage) {
        var toAverage = evaluateFormula(stringToSum, cell);
        if (typeof toAverage === "object") {
          return toAverage.reduce(function (x, y) {
            return x + y;
          }) / toAverage.length;
        } else {
          return toSum;
        }
      }
    );
  };


})();

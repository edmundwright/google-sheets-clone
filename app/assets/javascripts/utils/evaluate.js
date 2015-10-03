(function () {
  var evaluate = GoogleSheetsClone.evaluate = function (cell) {
    cell.removeDependencies();

    var contents_str = cell.get("contents_str");

    if (!contents_str) {
      cell.evaluation = Number(cell.contents());
    } else if (contents_str[0] !== "=") {
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
        } else if (error === "cycleInDependencies") {
          cell.evaluation = "#CIRCULAR REF!";
        } else {
          cell.evaluation = "#SOME ERROR!";
        }
      }
    }

    if (cell.evaluation === "#CIRCULAR REF!") {
      setDependentsToCircularRef(cell.pos(), cell);
    } else {
      evaluateDependents(cell.pos());
    }

    cell.trigger("render");

    return cell.evaluation;
  };

  var evaluateDependents = GoogleSheetsClone.evaluateDependents = function (pos) {
    var dependents = GoogleSheetsClone.cells.dependents(pos);
    for (var dependentRow in dependents) {
      for (var dependentCol in dependents[dependentRow]) {
        dependent = GoogleSheetsClone.cells.findByPos(
          [parseInt(dependentRow), parseInt(dependentCol)]
        );
        if (dependent) {
          evaluate(dependent);
        }
      }
    }
  };

  var setDependentsToCircularRef = function (pos, dependentToSkip) {
    var dependents = GoogleSheetsClone.cells.dependents(pos);
    for (var dependentRow in dependents) {
      for (var dependentCol in dependents[dependentRow]) {
        var dependentPos = [parseInt(dependentRow), parseInt(dependentCol)];
        var dependent = GoogleSheetsClone.cells.findByPos(dependentPos);
        if (dependent && dependent !== dependentToSkip) {
          dependent.evaluation = "#CIRCULAR REF!";
          setDependentsToCircularRef(dependentPos, dependentToSkip);
          dependent.trigger("render");
        }
      }
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
      evaluateFunctions,
      evaluateCommas,
      evaluateColon,
      evaluateReferences,
      throwErrorIfLettersRemain,
      evaluateParentheses,
      evaluateAddition,
      evaluateSubtraction,
      evaluateMultiplication,
      evaluateDivision,
      evaluateExponentiation
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

  var evaluateFunctions = function (formula, cell) {
    return formula.replace(
      /AVERAGE(\(.+)/i,
      function (_, stringAfterAVERAGE) {
        return evaluateAVERAGE(stringAfterAVERAGE, cell);
      }
    ).replace(
      /SUM(\(.+)/i,
      function (_, stringAfterSUM) {
        return evaluateSUM(stringAfterSUM, cell);
      }
    );
  };

  var evaluateSingleFunction = function (stringAfterFUNCTION, cell, funct) {
    var evaluatedParens = evaluateParentheses(stringAfterFUNCTION, cell, true);
    var inputForFunction = evaluatedParens.evaluated;
    var afterInput = evaluatedParens.after;
    return funct(inputForFunction, afterInput);
  };

  var evaluateAVERAGE = function (stringAfterAVERAGE, cell) {
    return evaluateSingleFunction(
      stringAfterAVERAGE, cell,
      function (input, afterInput) {
        var average;
        if (Array.isArray(input)) {
          average =  input.reduce(function (x, y) {
            return x + y;
          }) / input.length;
        } else {
          average = input;
        }
        return "" + average + afterInput;
      }
    );
  };

  var evaluateSUM = function (stringAfterSUM, cell) {
    return evaluateSingleFunction(
      stringAfterSUM, cell,
      function (input, afterInput) {
        var sum;
        if (Array.isArray(input)) {
          sum =  input.reduce(function (x, y) {
            return x + y;
          });
        } else {
          sum = input;
        }
        return "" + sum + afterInput;
      }
    );
  };

  var evaluateCommas = function (formula, cell) {
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

  var evaluateColon = function (formula, cell) {
    var matchData = formula.match(/([a-zA-Z]+)(\d+):([a-zA-Z]+)(\d+)/);
    if (matchData === null) {
      return formula;
    }
    var firstCol = GoogleSheetsClone.columnIndex(matchData[1]);
    var firstRow = GoogleSheetsClone.rowIndex(matchData[2]);
    var lastCol = GoogleSheetsClone.columnIndex(matchData[3]);
    var lastRow = GoogleSheetsClone.rowIndex(matchData[4]);

    var resultArray = [];
    var referencedCell, evaluatedReference;
    for (var col = firstCol; col <= lastCol; col++) {
      for (var row = firstRow; row <= lastRow; row++) {
        evaluatedReference = getEvaluatedReference(row, col, cell);
        if (evaluatedReference !== null) {
          resultArray.push(evaluatedReference);
        }
      }
    }

    return resultArray;
  };

  var getEvaluatedReference = function (row, col, cell) {
    cell.addDependency([row, col]);

    referencedCell = GoogleSheetsClone.cells.findByPos([row, col]);

    if (referencedCell) {
      var evaluatedReference;
      if (referencedCell.evaluation === undefined) {
        evaluatedReference = evaluate(referencedCell);
      } else {
        evaluatedReference = referencedCell.evaluation;
      }

      if (isNaN(evaluatedReference)) {
        throw "badReference";
      } else {
        return evaluatedReference;
      }
    } else {
      return null;
    }
  };

  var evaluateReferences = function (formula, cell) {
    return formula.replace(
      /([a-zA-Z]+)(\d+)/g,
      function (_, colName, rowName) {
        var col = GoogleSheetsClone.columnIndex(colName);
        var row = GoogleSheetsClone.rowIndex(rowName);

        var evaluatedReference = getEvaluatedReference(row, col, cell);

        if (evaluatedReference === null) {
          return 0;
        } else {
          return evaluatedReference;
        }
      }
    );
  };

  // is this necessary?
  var throwErrorIfLettersRemain = function (formula, cell) {
    if (formula.match(/[a-zA-Z]/) !== null) {
      throw "formulaNotWellFormed";
    } else {
      return formula;
    }
  };

  var evaluateParentheses = function (formula, cell, forFunction) {
    var openingParenPos;
    var openingMinusClosing = 0;
    for(var i = 0; i < formula.length; i++) {
      switch (formula[i]) {
        case "(":
          openingMinusClosing += 1;
          if (openingParenPos === undefined) {
            openingParenPos = i;
          }
          break;
        case ")":
          openingMinusClosing -= 1;
          if (openingParenPos === undefined) {
            throw "formulaNotWellFormed";
          } else if (openingMinusClosing === 0) {
            var inParentheses = formula.slice(openingParenPos + 1, i);
            var after = formula.slice(i + 1);
            var evaluated = evaluateFormula(inParentheses, cell);

            if (forFunction) {
              return { evaluated: evaluated, after: after };
            } else {
              var before = formula.slice(0, openingParenPos);
              return "" + before + evaluated + after;
            }
          }
        }
    }

    if (openingMinusClosing === 0) {
      return formula;
    } else {
      throw "formulaNotWellFormed";
    }
  };

  var evaluateAddition = function (formula, cell) {
    return evaluateSimpleOperation("+", formula, cell);
  };

  var evaluateSubtraction = function (formula, cell) {
    return evaluateSimpleOperation("-", formula, cell);
  };

  var evaluateMultiplication = function (formula, cell) {
    return evaluateSimpleOperation("*", formula, cell);
  };

  var evaluateDivision = function (formula, cell) {
    return evaluateSimpleOperation("/", formula, cell);
  };

  var evaluateExponentiation = function (formula, cell) {
    return evaluateSimpleOperation("^", formula, cell);
  };

  var evaluateSimpleOperation = function (operation, formula, cell) {
    var matchData = formula.match(new RegExp("(^.+)\\" + operation + "(.+$)"));
    if (matchData === null) {
      return formula;
    } else if (operation === "-" && matchData[1].match(/(\+|\-|\*|\/|\^)$/)) {
      return formula;
    }

    var leftHandSide = evaluateFormula(matchData[1], cell);
    var rightHandSide = evaluateFormula(matchData[2], cell);

    switch (operation) {
      case "+":
        return leftHandSide + rightHandSide;
      case "-":
        return leftHandSide - rightHandSide;
      case "*":
        return leftHandSide * rightHandSide;
      case "/":
        if (rightHandSide === 0) {
          throw "divideByZero";
        }
        return leftHandSide / rightHandSide;
      case "^":
        return Math.pow(leftHandSide, rightHandSide);
    }
  };
})();

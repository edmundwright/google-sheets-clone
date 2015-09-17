(function () {
  var evaluate = GoogleSheetsClone.evaluate = function (formula) {
    var newFormula = formula;
    var oldFormula = "";

    while (oldFormula != newFormula && isNaN(newFormula)) {
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

    for(var i = 0; i < formula.length; i++) {
      switch (formula[i]) {
        case " ":
          break;
        case "(":
          return evaluateBrackets(formula, i)
        case "+":
          return evaluateSimpleOperation(formula, i, "+");
        case "-":
          if (i !== 0) {
            return evaluateSimpleOperation(formula, i, "-");
          } else {
            newFormula += formula[i];
            break;
          }
        case "*":
          return evaluateSimpleOperation(formula, i, "*");
        case "/":
          return evaluateSimpleOperation(formula, i, "/");
        default:
          newFormula += formula[i];
      }
    }

    return newFormula
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
      }
    } else {
      return "INVALID-FORMULA!";
    }
  };

  var evaluateBrackets = function (formula, openingBracketPos) {
    for(var i = openingBracketPos + 1; i < formula.length; i++) {
      switch (formula[i]) {
        case "(":
          openingBracketPos = i;
          break;
        case ")":
          return formula.slice(0, openingBracketPos) +
            evaluate(formula.slice(openingBracketPos + 1, i)) +
            formula.slice(i + 1);
      }
    }

    return "INVALID-FORMULA!";
  };
})();

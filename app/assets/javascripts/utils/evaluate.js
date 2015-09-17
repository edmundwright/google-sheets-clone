(function () {
  var evaluate = GoogleSheetsClone.evaluate = function (formula) {
    if (typeof formula === "number") {
      return formula;
    }

    var newFormula = formula.replace(/ /g, '');
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

    for(var i = formula.length - 1; i >= 0; i--) {
      if (formula[i] === ")") {
        return evaluateBrackets(formula, i)
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
      return "INVALID-FORMULA!";
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

    return "INVALID-FORMULA!";
  };
})();

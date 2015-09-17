(function () {
  var evaluate = GoogleSheetsClone.evaluate = function (formula) {
    var newFormula = formula;
    var oldFormula = "";

    while (oldFormula != newFormula) {
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
          return parseBrackets(formula, i)
        case "+":
          return parseAddition(formula, i);
        default:
          newFormula += formula[i];
      }
    }

    return newFormula
  };

  var parseAddition = function (formula, plusPos) {
    debugger
    var leftHandSide = GoogleSheetsClone.evaluate(formula.slice(0, plusPos));
    var rightHandSide = GoogleSheetsClone.evaluate(formula.slice(plusPos + 1));
    if (typeof leftHandSide === "number" && typeof rightHandSide === "number") {
      return leftHandSide + rightHandSide;
    } else {
      return "INVALID-FORMULA!";
    }
  };

  var parseBrackets = function (formula, openingBracketPos) {
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

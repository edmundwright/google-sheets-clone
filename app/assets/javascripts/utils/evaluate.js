(function () {
  var evaluate = GoogleSheetsClone.evaluate = function (formula) {
    var newFormula = formula.slice(0);
    var oldFormula = "";

    while (oldFormula != newFormula) {
      var oldFormula = newFormula.slice(0);
      newFormula = evaluateOnePart(newFormula);
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
        // case "+":
        //   return GoogleSheetsClone.evaluate(formula.slice(0, i)) + GoogleSheetsClone.evaluate(formula.slice(i + 1));
        //   break;
        default:
          newFormula += formula[i];
      }
    }

    return newFormula
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

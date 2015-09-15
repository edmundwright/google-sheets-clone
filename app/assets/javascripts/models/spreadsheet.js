GoogleSheetsClone.Models.Spreadsheet = Backbone.Model.extend ({
  urlRoot: "/api/spreadsheets",

  parse: function (response) {
    if (response.owner) {
      this.owner = new GoogleSheetsClone.Models.User(response.owner);
      delete response.owner;
    }

    return response;
  },

  timePeriod: function () {
    var updated = new Date(Date.parse(this.get("updated_at")));
    var now = new Date(Date.now());

    if (updated.getYear() === now.getYear()) {
      if (updated.getMonth() === now.getMonth()) {
        if (updated.getDate() === now.getDate()) {
          return "Today";
        } else if (updated.getDate() === now.getDate() - 1) {
          return "Yesterday";
        } else {
          return "Earlier this month";
        }
      } else {
        return "Earlier this year";
      }
    } else {
      return "Earlier";
    }
  },

  updatedAtString: function () {
    var dateObj = new Date(Date.parse(this.get("updated_at")));
    if (this.timePeriod() === "Today") {
      return dateObj.toTimeString().slice(0, 5);
    } else {
      return dateObj.toDateString().slice(4, 15);
    }
  }
});

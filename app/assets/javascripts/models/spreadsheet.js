GoogleSheetsClone.Models.Spreadsheet = Backbone.Model.extend ({
  urlRoot: "/api/spreadsheets",

  parse: function (response) {
    if (response.owner) {
      this.owner = new GoogleSheetsClone.Models.User(response.owner);
      delete response.owner;
    }

    if (response.cells) {
      this.cells().set(response.cells);
      delete response.cells;
    }

    if (response.columns) {
      this.columns().set(response.columns);
      delete response.columns;
    }

    if (response.rows) {
      this.rows().set(response.rows);
      delete response.rows;
    }

    if (response.current_editors) {
      this.currentEditors().set(response.current_editors);
      delete response.current_editors;
    }

    return response;
  },

  currentEditors: function () {
    if (!this._currentEditors) {
      this._currentEditors = new GoogleSheetsClone.Collections.Users([], {
        currentSpreadsheet: this
      });
    }

    return this._currentEditors;
  },

  cells: function () {
    if (!this._cells) {
      this._cells = new GoogleSheetsClone.Collections.Cells([], {
        spreadsheet: this
      });
    }

    return this._cells;
  },

  columns: function () {
    if (!this._columns) {
      this._columns = new GoogleSheetsClone.Collections.Columns([], {
        spreadsheet: this
      });
    }

    return this._columns;
  },

  rows: function () {
    if (!this._rows) {
      this._rows = new GoogleSheetsClone.Collections.Rows([], {
        spreadsheet: this
      });
    }

    return this._rows;
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

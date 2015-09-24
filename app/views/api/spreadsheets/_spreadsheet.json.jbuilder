json.extract! spreadsheet, :id, :title, :width, :height, :updated_at

json.owner do
  json.partial! 'api/users/user', user: spreadsheet.owner, with_email: true
end

if with_cells
  json.cells do
    json.array! spreadsheet.cells do |cell|
      json.partial! 'api/cells/cell', cell: cell
    end
  end

  json.columns do
    json.array! spreadsheet.columns do |column|
      json.partial! 'api/columns/column', column: column
    end
  end

  json.rows do
    json.array! spreadsheet.rows do |row|
      json.partial! 'api/rows/row', row: row
    end
  end
end

if with_current_editors
  json.current_editors do
    json.array! spreadsheet.current_editors do |current_editor|
      json.partial! 'api/users/user', user: current_editor, with_email: false
    end
  end
end

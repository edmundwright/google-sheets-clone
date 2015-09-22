json.extract! spreadsheet, :id, :title, :width, :height, :updated_at

json.owner do
  json.partial! 'api/users/user', user: spreadsheet.owner
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

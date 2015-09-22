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

  json.col_widths do
    json.array! spreadsheet.columns do |column|
      json.extract! column, :col_index, :width
    end
  end

  json.row_heights do
    json.array! spreadsheet.rows do |row|
      json.extract! row, :row_index, :height
    end
  end
end

json.extract! spreadsheet, :id, :title, :updated_at

json.owner do
  json.partial! 'api/users/user', user: spreadsheet.owner
end

if with_cells
  json.cells do
    json.array! spreadsheet.cells do |cell|
      json.partial! 'api/cells/cell', cell: cell
    end
  end
end

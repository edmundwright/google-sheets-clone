json.array! @spreadsheets do |spreadsheet|
  json.partial! 'api/spreadsheets/spreadsheet',
    spreadsheet: spreadsheet,
    with_cells: false
end

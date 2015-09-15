json.array! @spreadsheets do |spreadsheet|
  json.partial! 'api/spreadsheets/spreadsheet', spreadsheet: spreadsheet
end

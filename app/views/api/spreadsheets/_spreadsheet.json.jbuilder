json.extract! spreadsheet, :id, :title

json.owner do
  json.partial! 'api/users/user', user: spreadsheet.owner
end

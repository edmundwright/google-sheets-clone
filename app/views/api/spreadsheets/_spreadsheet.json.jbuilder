json.extract! spreadsheet, :title

json.owner do
  json.partial! 'api/users/user', user: spreadsheet.owner
end

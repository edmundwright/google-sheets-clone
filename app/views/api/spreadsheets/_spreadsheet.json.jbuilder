json.extract! spreadsheet, :id, :title, :updated_at

json.owner do
  json.partial! 'api/users/user', user: spreadsheet.owner
end

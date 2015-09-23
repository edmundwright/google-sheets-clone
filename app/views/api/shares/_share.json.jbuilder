json.extract! share, :id, :spreadsheet_id

json.sharee do
  json.partial! 'api/users/user', user: share.sharee
end

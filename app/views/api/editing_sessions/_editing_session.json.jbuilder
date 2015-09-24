json.extract! editing_session, :id, :row_index, :col_index

json.editor do
  json.partial! 'api/users/user', user: editing_session.editor
end

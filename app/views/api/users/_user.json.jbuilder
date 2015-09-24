json.extract! user, :id, :name, :current_row_index, :current_col_index

if with_email
  json.email user.email
end

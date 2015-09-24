json.extract! user, :id, :name, :current_row_index, :current_col_index

if with_email
  json.email user.email
end

if with_picture
  json.picture asset_path(user.picture.url)
end

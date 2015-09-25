json.current_editors do
  json.array! @current_editors do |current_editor|
    json.partial! 'api/users/user',
      user: current_editor,
      with_email: false,
      with_picture: false
  end
end

json.cells do
  json.array! @cells do |cell|
    json.partial! 'api/cells/cell', cell: cell, with_updated_at: true
  end
end

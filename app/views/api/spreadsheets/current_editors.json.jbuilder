json.array! @current_editors do |current_editor|
  json.partial! 'api/users/user', user: current_editor, with_email: false
end

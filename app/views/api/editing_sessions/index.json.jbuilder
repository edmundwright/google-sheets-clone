json.array! @editing_sessions do |editing_session|
  json.partial! 'api/editing_sessions/editing_session',
    editing_session: editing_session
end

json.array! @shares do |share|
  json.partial! 'api/shares/share', share: share
end

json.extract! cell,
  :id,
  :spreadsheet_id,
  :row_index,
  :col_index,
  :contents_str,
  :contents_int,
  :contents_flo

if with_updated_at
  json.updated_at (cell.updated_at.to_f * 1_000_000).to_i
end

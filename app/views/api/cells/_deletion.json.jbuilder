json.extract! deletion,
  :row_index,
  :col_index

json.updated_at (deletion.updated_at.to_f * 1_000_000).to_i

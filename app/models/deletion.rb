class Deletion < ActiveRecord::Base
  validates :spreadsheet_id, :col_index, :row_index, :deletor_id, presence: true

  belongs_to :spreadsheet
end

class Row < ActiveRecord::Base
  validates :spreadsheet_id, :row_index, :height, presence: true
  validates :spreadsheet_id, uniqueness: { scope: :row_index }

  belongs_to :spreadsheet

  has_one :owner,
    through: :spreadsheet,
    source: :owner
end

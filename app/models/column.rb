class Column < ActiveRecord::Base
  validates :spreadsheet_id, :col_index, :width, presence: true
  validates :spreadsheet_id, uniqueness: { scope: :col_index }

  belongs_to :spreadsheet

  has_one :owner,
    through: :spreadsheet,
    source: :owner
end

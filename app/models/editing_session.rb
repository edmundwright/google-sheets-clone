class EditingSession < ActiveRecord::Base
  validates :spreadsheet_id, :editor_id, :row_index, :col_index, presence: true
  validates :spreadsheet_id, uniqueness: { scope: [:editor_id]}

  belongs_to :spreadsheet

  belongs_to :editor,
    class_name: "User",
    foreign_key: :editor_id,
    inverse_of: :editing_sessions
end

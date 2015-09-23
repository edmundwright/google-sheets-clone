class Share < ActiveRecord::Base
  validates :spreadsheet_id, :sharee_id, presence: true
  validates :spreadsheet_id, uniqueness: { scope: :sharee_id }

  belongs_to :spreadsheet

  belongs_to :sharee,
    class_name: "User",
    foreign_key: :sharee_id
end

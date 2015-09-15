class Spreadsheet < ActiveRecord::Base
  validates :owner_id, :title, presence: true

  belongs_to :owner,
    class_name: "User",
    foreign_key: :owner_id
end

class Spreadsheet < ActiveRecord::Base
  validates :owner_id, :title, :width, :height, presence: true

  belongs_to :owner,
    class_name: "User",
    foreign_key: :owner_id

  has_many :cells, dependent: :destroy
end

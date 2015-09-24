class Spreadsheet < ActiveRecord::Base
  validates :owner_id, :title, :width, :height, presence: true

  belongs_to :owner,
    class_name: "User",
    foreign_key: :owner_id

  has_many :shares, dependent: :destroy
  has_many :sharees,
    through: :shares,
    source: :sharee

  has_many :cells, dependent: :destroy
  has_many :columns, dependent: :destroy
  has_many :rows, dependent: :destroy
end

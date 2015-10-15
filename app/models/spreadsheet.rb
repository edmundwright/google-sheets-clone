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
  has_many :deletions, dependent: :destroy

  has_many :editors,
    class_name: "User",
    foreign_key: :current_spreadsheet_id,
    inverse_of: :current_spreadsheet

  def current_editors
    editors.each do |editor|
      if editor.updated_at < 1.minute.ago
        editor.update({ current_spreadsheet_id: nil })
      end
    end

    editors(true)
  end
end

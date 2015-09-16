class Cell < ActiveRecord::Base
  validates :spreadsheet_id, :row_index, :col_index, presence: true
  validates :spreadsheet_id, uniqueness: { scope: [:row_index, :col_index]}

  validate :only_one_content_type

  belongs_to :spreadsheet

  def only_one_content_type
    if (contents_str && contents_int) ||
      (contents_str && contents_flo) ||
      (contents_int && contents_flo)
      errors[:base] << "a cell can only contain one content type!"
    end
  end
end

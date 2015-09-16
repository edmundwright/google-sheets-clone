class AddWidthAndHeightToSpreadsheets < ActiveRecord::Migration
  def change
    add_column :spreadsheets, :width, :integer, null: false, default: 26
    add_column :spreadsheets, :height, :integer, null: false, default: 26
  end
end

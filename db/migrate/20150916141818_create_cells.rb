class CreateCells < ActiveRecord::Migration
  def change
    create_table :cells do |t|
      t.integer :spreadsheet_id, null: false
      t.integer :row_index, null: false
      t.integer :col_index, null: false
      t.string  :contents_str
      t.integer :contents_int
      t.float   :contents_flo

      t.timestamps
    end

    add_index :cells, :spreadsheet_id
    add_index :cells, [:spreadsheet_id, :row_index, :col_index], unique: true
  end
end

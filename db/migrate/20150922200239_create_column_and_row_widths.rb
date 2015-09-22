class CreateColumnAndRowWidths < ActiveRecord::Migration
  def change
    create_table :columns do |t|
      t.integer :col_index, null: false
      t.integer :width, null: false
      t.integer :spreadsheet_id, null: false

      t.timestamps
    end

    add_index :columns, :spreadsheet_id
    add_index :columns, [:spreadsheet_id, :col_index], unique: true

    create_table :rows do |t|
      t.integer :row_index, null: false
      t.integer :height, null: false
      t.integer :spreadsheet_id, null: false

      t.timestamps
    end

    add_index :rows, :spreadsheet_id
    add_index :rows, [:spreadsheet_id, :row_index], unique: true
  end
end

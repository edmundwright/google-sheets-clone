class CreateDeletions < ActiveRecord::Migration
  def change
    create_table :deletions do |t|
      t.integer :spreadsheet_id, null: false
      t.integer :row_index, null: false
      t.integer :col_index, null: false

      t.timestamps
    end

    add_index :deletions, :spreadsheet_id
    add_index :deletions, [:spreadsheet_id, :updated_at]
  end
end

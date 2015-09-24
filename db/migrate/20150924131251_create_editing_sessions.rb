class CreateEditingSessions < ActiveRecord::Migration
  def change
    create_table :editing_sessions do |t|
      t.integer :spreadsheet_id, null: false
      t.integer :editor_id, null: false
      t.integer :row_index, null: false
      t.integer :col_index, null: false

      t.timestamps
    end

    add_index :editing_sessions, :spreadsheet_id
    add_index :editing_sessions, [:spreadsheet_id, :editor_id], unique: true
  end
end

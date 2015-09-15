class CreateSpreadsheets < ActiveRecord::Migration
  def change
    create_table :spreadsheets do |t|
      t.integer :owner_id, null: false
      t.string :title, null: false

      t.timestamps
    end

    add_index :spreadsheets, :owner_id
  end
end

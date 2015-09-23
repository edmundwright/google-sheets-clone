class CreateShares < ActiveRecord::Migration
  def change
    create_table :shares do |t|
      t.integer :spreadsheet_id, null: false
      t.integer :sharee_id, null: false

      t.timestamps
    end

    add_index :shares, :spreadsheet_id
    add_index :shares, :sharee_id
    add_index :shares, [:spreadsheet_id, :sharee_id]
  end
end

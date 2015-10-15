class AddDeletorIdToDeletions < ActiveRecord::Migration
  def change
    add_column :deletions, :deletor_id, :integer
    add_index :deletions, :deletor_id
    add_index :deletions, [:spreadsheet_id, :deletor_id, :updated_at]
  end
end

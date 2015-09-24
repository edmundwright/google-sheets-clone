class AddEditingColumnsToUsers < ActiveRecord::Migration
  def change
    add_column :users, :current_spreadsheet_id, :integer
    add_column :users, :current_row_index, :integer
    add_column :users, :current_col_index, :integer
    add_column :users, :moved_at, :datetime
    add_index :users, :current_spreadsheet_id
    add_index :users, [:current_spreadsheet_id, :moved_at]
  end
end

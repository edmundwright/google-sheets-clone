class AddLastEditorColumnToCells < ActiveRecord::Migration
  def change
    add_column :cells, :last_editor_id, :integer
    add_index :cells, :last_editor_id
    add_index :cells, [:last_editor_id, :updated_at]
  end
end

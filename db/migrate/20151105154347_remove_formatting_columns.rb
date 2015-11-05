class RemoveFormattingColumns < ActiveRecord::Migration
  def change
    remove_column :cells, :bold
    remove_column :cells, :italic
    remove_column :cells, :underlined
    remove_column :cells, :color
    remove_column :cells, :background_color
  end
end

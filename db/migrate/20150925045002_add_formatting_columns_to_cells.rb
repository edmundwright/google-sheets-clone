class AddFormattingColumnsToCells < ActiveRecord::Migration
  def change
    add_column :cells, :bold, :boolean
    add_column :cells, :italic, :boolean
    add_column :cells, :underlined, :boolean
    add_column :cells, :color, :string
    add_column :cells, :background_color, :string
  end
end

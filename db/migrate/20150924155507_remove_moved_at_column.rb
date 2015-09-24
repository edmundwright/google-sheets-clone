class RemoveMovedAtColumn < ActiveRecord::Migration
  def change
    remove_column :users, :moved_at
  end
end

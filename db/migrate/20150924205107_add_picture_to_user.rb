class AddPictureToUser < ActiveRecord::Migration
  def change
    add_attachment :users, :picture
  end
end

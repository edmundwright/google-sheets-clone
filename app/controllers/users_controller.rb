class UsersController < ApplicationController
  def new
    filled_out_fields = session[:filled_out_fields] || {}
    @user = User.new({email: "", name: ""}.merge(filled_out_fields))
  end

  def create
    @user = User.new(user_params)

    if @user.save
      redirect_to :root
    else
      session[:filled_out_fields] = user_params.delete_if do |key, _|
        key == :password
      end
      redirect_to new_user_url
    end
  end

  private

  def user_params
    params.require(:user).permit(:email, :name, :password)
  end
end

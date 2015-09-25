class UsersController < ApplicationController
  skip_before_action :ensure_logged_in, except: [
    :edit,
    :update,
    :confirm_delete,
    :destroy
  ]

  def new
    if session[:filled_out_fields]
      filled_out_fields = session[:filled_out_fields]
      session[:filled_out_fields] = nil
    else
      filled_out_fields = {}
    end

    @user = User.new({email: "", name: ""}.merge(filled_out_fields))
  end

  def create
    user = User.new(user_params)

    if user.save
      log_in_user!(user)
      redirect_to :root
    else
      session[:filled_out_fields] = user_params.delete_if do |key, _|
        key == :password || key == "password"
      end
      flash[:errors] = user.errors.full_messages
      redirect_to new_user_url
    end
  end

  def edit
    @user = current_user
  end

  def update
    user = current_user
    
    if user_params.empty?
      flash[:errors] = ["No picture was provided."]
    elsif user.update(user_params)
      flash[:notice] = "Your account details have been updated."
    else
      flash[:errors] = user.errors.full_messages
    end
    redirect_to edit_user_url(user)
  end

  def confirm_delete
    @user = current_user
  end

  def destroy
    if current_user.email == user_params[:email]
      current_user.destroy!
      flash[:notice] = "Your account has been deleted."
      redirect_to new_user_url
    else
      flash[:errors] = ["The email address you entered does not match the account's email address. Account was not deleted."]
      redirect_to edit_user_url(current_user)
    end
  end

  private

  def user_params
    params.require(:user).permit(
      :email,
      :name,
      :password,
      :password_confirmation,
      :picture
    )
  end
end

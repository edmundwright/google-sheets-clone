class Api::SharesController < ApplicationController
  def index
    spreadsheet = current_user.spreadsheets.find(params[:spreadsheet_id])
    @shares = spreadsheet.shares
  end

  def show
    spreadsheet = current_user.spreadsheets.find(params[:spreadsheet_id])
    @share = spreadsheet.shares.find(params[:id])
  end

  def create
    spreadsheet = current_user.spreadsheets.find(params[:spreadsheet_id])

    sharee = User.find_by(email: share_params[:sharee_email])

    @share = spreadsheet.shares.new(sharee_id: sharee.id)

    if @share.save
      render :show
    else
      render json: @share.errors.full_messages, status: :unprocessable_entity
    end
  end

  def destroy
    spreadsheet = current_user.spreadsheets.find(params[:spreadsheet_id])
    @share = spreadsheet.shares.find(params[:id])
    @share.destroy!
    render :show
  end

  private

  def share_params
    params.require(:share).permit(:sharee_email)
  end
end

class Api::SharesController < ApplicationController
  def show
    spreadsheet = current_user.spreadsheets.find(params[:spreadsheet_id])
    @share = spreadsheet.shares.find(params[:id])
  end

  def create
    spreadsheet = current_user.spreadsheets.find(params[:spreadsheet_id])

    @share = spreadsheet.shares.new(share_params)

    if @share.save
      render :show
    else
      render json: @share.errors.full_messages, status: :unprocessable_entity
    end
  end

  def update
    spreadsheet = current_user.spreadsheets.find(params[:spreadsheet_id])
    @share = spreadsheet.shares.find(params[:id])

    if @share.update(share_params)
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
    params.require(:share).permit(:sharee_id)
  end
end

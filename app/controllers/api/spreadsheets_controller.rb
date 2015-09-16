class Api::SpreadsheetsController < ApplicationController
  def create
    @spreadsheet = current_user.spreadsheets.new(spreadsheet_params)

    if @spreadsheet.save
      render :show
    else
      render json: @spreadsheet.errors.full_messages, status: :unprocessable_entity
    end
  end

  def index
    @spreadsheets = current_user.spreadsheets
  end

  def show
    @spreadsheet = current_user.spreadsheets.find(params[:id])
  end

  def update
    @spreadsheet = current_user.spreadsheets.find(params[:id])

    if @spreadsheet.update(spreadsheet_params)
      render :show
    else
      render json: @spreadsheet.errors.full_messages, status: :unprocessable_entity
    end
  end

  def destroy
    @spreadsheet = current_user.spreadsheets.find(params[:id])
    @spreadsheet.destroy!
    render :show
  end

  private

  def spreadsheet_params
    params.require(:spreadsheet).permit(:title)
  end
end

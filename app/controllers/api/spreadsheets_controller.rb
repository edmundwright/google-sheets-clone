class Api::SpreadsheetsController < ApplicationController
  def create
    @spreadsheet = current_user.spreadsheets.new(spreadsheet_params)

    if @spreadsheet.save
      render :show
    else
      render json: @spreadsheet.errors.full_messages,
        status: :unprocessable_entity
    end
  end

  def index
    @spreadsheets = current_user.all_spreadsheets
  end

  def show
    @spreadsheet = current_user.all_spreadsheets.find(params[:id])
  end

  def update
    @spreadsheet = current_user.all_spreadsheets.find(params[:id])

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
  
  def editors
    spreadsheet = current_user.spreadsheets.find(params[:id])
    @current_editors = spreadsheet.current_editors
  end

  private

  def spreadsheet_params
    params.require(:spreadsheet).permit(:title, :width, :height)
  end
end

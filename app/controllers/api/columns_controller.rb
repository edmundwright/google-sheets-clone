class Api::ColumnsController < ApplicationController
  def show
    spreadsheet = current_user.spreadsheets.find(params[:spreadsheet_id])
    @column = spreadsheet.columns.find(params[:id])
  end

  def create
    spreadsheet = current_user.spreadsheets.find(params[:spreadsheet_id])

    @column = spreadsheet.columns.new(column_params)

    if @column.save
      spreadsheet.touch
      render :show
    else
      render json: @column.errors.full_messages, status: :unprocessable_entity
    end
  end

  def update
    spreadsheet = current_user.spreadsheets.find(params[:spreadsheet_id])
    @column = spreadsheet.columns.find(params[:id])

    if @column.update(column_params)
      spreadsheet.touch
      render :show
    else
      render json: @column.errors.full_messages, status: :unprocessable_entity
    end
  end

  def destroy
    spreadsheet = current_user.spreadsheets.find(params[:spreadsheet_id])
    @column = spreadsheet.columns.find(params[:id])
    @column.destroy!
    spreadsheet.touch
    render :show
  end

  private

  def column_params
    params.require(:column).permit(
      :col_index,
      :width
    )
  end
end

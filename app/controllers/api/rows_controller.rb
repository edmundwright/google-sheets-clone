class Api::RowsController < ApplicationController
  def show
    spreadsheet = current_user.spreadsheets.find(params[:spreadsheet_id])
    @row = spreadsheet.rows.find(params[:id])
  end

  def create
    spreadsheet = current_user.spreadsheets.find(params[:spreadsheet_id])

    @row = spreadsheet.rows.new(row_params)

    if @row.save
      spreadsheet.touch
      render :show
    else
      render json: @row.errors.full_messages, status: :unprocessable_entity
    end
  end

  def update
    spreadsheet = current_user.spreadsheets.find(params[:spreadsheet_id])
    @row = spreadsheet.rows.find(params[:id])

    if @row.update(row_params)
      spreadsheet.touch
      render :show
    else
      render json: @row.errors.full_messages, status: :unprocessable_entity
    end
  end

  def destroy
    spreadsheet = current_user.spreadsheets.find(params[:spreadsheet_id])
    @row = spreadsheet.rows.find(params[:id])
    @row.destroy!
    spreadsheet.touch
    render :show
  end

  private

  def row_params
    params.require(:row).permit(
      :row_index,
      :height
    )
  end
end

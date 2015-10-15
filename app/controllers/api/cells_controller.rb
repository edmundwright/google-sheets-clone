class Api::CellsController < ApplicationController
  def show
    spreadsheet = current_user.all_spreadsheets.find(params[:spreadsheet_id])
    @cell = spreadsheet.cells.find(params[:id])
  end

  def create
    spreadsheet = current_user.all_spreadsheets.find(params[:spreadsheet_id])

    @cell = spreadsheet.cells.new(
      cell_params.merge({last_editor_id: current_user.id})
    )

    if @cell.save
      spreadsheet.touch
      render :show
    else
      render json: @cell.errors.full_messages, status: :unprocessable_entity
    end
  end

  def update
    spreadsheet = current_user.all_spreadsheets.find(params[:spreadsheet_id])
    @cell = spreadsheet.cells.find(params[:id])

    if @cell.update(cell_params.merge({last_editor_id: current_user.id}))
      spreadsheet.touch
      render :show
    else
      render json: @cell.errors.full_messages, status: :unprocessable_entity
    end
  end

  def destroy
    spreadsheet = current_user.all_spreadsheets.find(params[:spreadsheet_id])
    @cell = spreadsheet.cells.find(params[:id])

    spreadsheet.deletions.create!(
      row_index: @cell.row_index,
      col_index: @cell.col_index,
      deletor_id: current_user.id
    )

    @cell.destroy!

    spreadsheet.touch
    render :show
  end

  private

  def cell_params
    params.require(:cell).permit(
      :row_index,
      :col_index,
      :contents_str,
      :contents_int,
      :contents_flo,
      :bold,
      :italic,
      :underlined,
      :color,
      :background_color
    )
  end
end

class CellsController < ApplicationController
  def show
    @cell = current_user.cells.find(params[:id])
  end

  def create
    spreadsheet = current_user.spreadsheets.find(params[:spreadsheet_id])

    @cell = spreadsheet.cells.new(cell_params)

    if cell.save
      render: :show
    else
      render json: @cell.errors.full_messages, status: :unprocessable_entity
    end
  end

  def update
    @cell = current_user.cells.find(params[:id])

    if @cell.update(cell_params)
      render: :show
    else
      render json: @cell.errors.full_messages, status: :unprocessable_entity
    end
  end

  def destroy
    @cell = current_user.cells.find(params[:id])
    @cell.destroy!
    render: :show
  end

  private

  def cell_params
    params.require(:cell).permit(
      :row_index,
      :col_index,
      :contents_str,
      :contents_int,
      :contents_flo
    )
  end
end

class Api::EditingSessionsController < ApplicationController
  def show
    spreadsheet = current_user.all_spreadsheets.find(params[:spreadsheet_id])
    @editing_session = spreadsheet.editing_sessions.find(params[:id])
  end

  def create
    spreadsheet = current_user.all_spreadsheets.find(params[:spreadsheet_id])

    @editing_session = spreadsheet.editing_sessions.new(
      editing_session_params.merge({ editor_id: current_user.id })
    )

    if @editing_session.save
      render :show
    else
      render json: @editing_session.errors.full_messages, status: :unprocessable_entity
    end
  end

  def update
    spreadsheet = current_user.all_spreadsheets.find(params[:spreadsheet_id])
    @editing_session = spreadsheet.editing_sessions.find(params[:id])

    if @editing_session.update(editing_session_params)
      render :show
    else
      render json: @editing_session.errors.full_messages, status: :unprocessable_entity
    end
  end

  def destroy
    spreadsheet = current_user.all_spreadsheets.find(params[:spreadsheet_id])
    @editing_session = spreadsheet.editing_sessions.find(params[:id])
    @editing_session.destroy!
    render :show
  end

  private

  def editing_session_params
    params.require(:editing_session).permit(
      :col_index,
      :row_index
    )
  end
end

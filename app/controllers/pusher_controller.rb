class PusherController < ApplicationController
  skip_before_action :ensure_logged_in

  def auth
    authorized = false

    if logged_in?
      if params[:channel_name].start_with?("private-spreadsheet-")
        spreadsheet_id = params[:channel_name][20..-1].to_i
        authorized = true if current_user.all_spreadsheets.find(spreadsheet_id)
      else
        authorized = true
      end
    end

    if authorized
      response = Pusher[params[:channel_name]].authenticate(params[:socket_id])
      render :json => response
    else
      render :text => "Forbidden", :status => '403'
    end
  end
end

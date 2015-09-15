Rails.application.routes.draw do
  root to: "static_pages#root"

  resources :users, only: [:new, :create, :edit, :update, :destroy] do
    get :confirm_delete, on: :member
  end

  resource :session, only: [:new, :create, :destroy]
end

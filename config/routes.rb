Rails.application.routes.draw do
  root to: "static_pages#root"

  resources :users, only: [:new, :create, :edit, :update, :destroy] do
    get :confirm_delete, on: :member
  end

  resource :session, only: [:show, :new, :create, :destroy, :update]

  get "/auth/facebook/callback", to: "sessions#omniauth"

  namespace :api, defaults: { format: :json } do
    resources :spreadsheets, only: [:create, :show, :index, :update, :destroy] do
      resources :cells, only: [:create, :show, :update, :destroy]
      resources :columns, only: [:create, :show, :update, :destroy]
      resources :rows, only: [:create, :show, :update, :destroy]
      resources :shares, only: [:create, :index, :show, :update, :destroy]
      get 'current_editors', on: :member
    end
  end
end

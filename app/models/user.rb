class User < ActiveRecord::Base
  validates :email, :name, :password_digest, :session_token, presence: true
  validates :email, :session_token, uniqueness: true
  validates :password, length: { minimum: 6, allow_nil: true }
  validates :password, confirmation: true

  belongs_to :current_spreadsheet,
    class_name: "Spreadsheet",
    foreign_key: :current_spreadsheet_id,
    inverse_of: :editors

  has_many :spreadsheets,
    dependent: :destroy,
    class_name: "Spreadsheet",
    foreign_key: :owner_id

  has_many :shares,
    dependent: :destroy,
    class_name: "Share",
    foreign_key: :sharee_id,
    inverse_of: :sharee

  has_many :shared_spreadsheets,
    through: :shares,
    source: :spreadsheet

  has_many :cells,
    through: :spreadsheets,
    source: :cells

  def self.random_token
    SecureRandom.urlsafe_base64
  end

  def self.find_by_credentials(email, password)
    user = find_by(email: email)
    user && user.password_matches?(password) ? user : nil
  end

  after_initialize :ensure_session_token

  attr_reader :password

  def password=(new_password)
    self.password_digest = BCrypt::Password.create(new_password)
    @password = new_password
  end

  def password_matches?(given_password)
    BCrypt::Password.new(password_digest).is_password?(given_password)
  end

  def reset_session_token!
    self.session_token = self.class.random_token
    save!
  end

  def ensure_session_token
    self.session_token ||= self.class.random_token
  end

  def all_spreadsheets
    Spreadsheet
      .joins("LEFT JOIN shares ON spreadsheets.id = shares.spreadsheet_id")
      .where("spreadsheets.owner_id = ? OR shares.sharee_id = ?", id, id)
  end
end

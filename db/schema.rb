# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150923200436) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "cells", force: :cascade do |t|
    t.integer  "spreadsheet_id", null: false
    t.integer  "row_index",      null: false
    t.integer  "col_index",      null: false
    t.string   "contents_str"
    t.integer  "contents_int"
    t.float    "contents_flo"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "cells", ["spreadsheet_id", "row_index", "col_index"], name: "index_cells_on_spreadsheet_id_and_row_index_and_col_index", unique: true, using: :btree
  add_index "cells", ["spreadsheet_id"], name: "index_cells_on_spreadsheet_id", using: :btree

  create_table "columns", force: :cascade do |t|
    t.integer  "col_index",      null: false
    t.integer  "width",          null: false
    t.integer  "spreadsheet_id", null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "columns", ["spreadsheet_id", "col_index"], name: "index_columns_on_spreadsheet_id_and_col_index", unique: true, using: :btree
  add_index "columns", ["spreadsheet_id"], name: "index_columns_on_spreadsheet_id", using: :btree

  create_table "rows", force: :cascade do |t|
    t.integer  "row_index",      null: false
    t.integer  "height",         null: false
    t.integer  "spreadsheet_id", null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "rows", ["spreadsheet_id", "row_index"], name: "index_rows_on_spreadsheet_id_and_row_index", unique: true, using: :btree
  add_index "rows", ["spreadsheet_id"], name: "index_rows_on_spreadsheet_id", using: :btree

  create_table "shares", force: :cascade do |t|
    t.integer  "spreadsheet_id", null: false
    t.integer  "sharee_id",      null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "shares", ["sharee_id"], name: "index_shares_on_sharee_id", using: :btree
  add_index "shares", ["spreadsheet_id", "sharee_id"], name: "index_shares_on_spreadsheet_id_and_sharee_id", unique: true, using: :btree
  add_index "shares", ["spreadsheet_id"], name: "index_shares_on_spreadsheet_id", using: :btree

  create_table "spreadsheets", force: :cascade do |t|
    t.integer  "owner_id",                null: false
    t.string   "title",                   null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "width",      default: 26, null: false
    t.integer  "height",     default: 26, null: false
  end

  add_index "spreadsheets", ["owner_id"], name: "index_spreadsheets_on_owner_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "email",           null: false
    t.string   "name",            null: false
    t.string   "password_digest", null: false
    t.string   "session_token",   null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["session_token"], name: "index_users_on_session_token", unique: true, using: :btree

end

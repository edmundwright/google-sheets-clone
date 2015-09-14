# Schema Information

A note on formulae: all evaluations of formulae will occur on the front-end. Rails and SQL will only ever see and store the unevaluated formulae.

## users
column name     | data type | details
----------------|-----------|-----------------------
id              | integer   | not null, primary key
email           | string    | not null, unique
password_digest | string    | not null
session_token   | string    | not null, unique

## spreadsheets
column name | data type | details
------------|-----------|-----------------------
id          | integer   | not null, primary key
owner_id    | integer   | not null, foreign key (references `users`)
title       | string    | not null
public      | boolean   | not null, default: false
public_edit | boolean   | not null, default: false

## shares
column name    | data type | details
---------------|-----------|-----------------------
id             | integer   | not null, primary key
spreadsheet_id | integer   | not null, foreign key (references `spreadsheets`)
sharee_id      | integer   | not null, foreign key (references `users`)
edit           | boolean   | not null, default: false

## cells
column name    | data type | details
---------------|-----------|-----------------------
id             | integer   | not null, primary key
spreadsheet_id | integer   | not null, foreign key (references `spreadsheets`)
row_index      | integer   | not null
col_index      | integer   | not null, unique within scope of `row_index` and `spreadsheet_id`
text_color     | string    |
back_color     | string    |
currency       | boolean   |
percentage     | boolean   |
contents_str   | string    | must be null when `contents_int` or `contents_flo` is not null (contains contents of cell when cell contains formula, or data that is not a number)
contents_int   | integer   | must be null when `contents_str` or `contents_flo` is not null (contains contents of cell when cell contains integer)
contents_flo   | float     | must be null when `contents_int` or `contents_str` is not null (contains contents of cell when cell contains number that is non-integer)

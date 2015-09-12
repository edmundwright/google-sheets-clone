# Schema Information

A note on the *storage of the spreadsheet data*. There are I think two important priorities:

- That initially downloading the spreadsheet from the server is quick
- That uploading individual edits is quick

My current idea is to have a `cells` table referencing a `rows` table referencing a `spreadsheets` table. My worry about this is that while it will allow very quick uploading and saving of individual edits, as only the contents of the edited cell will need to be saved, it may lead to slow initial downloading of the spreadsheet, due to all the following being required:

- A query of the `spreadsheets` table for the entry with `id=x`.
- A query of the `rows` table for all entries with `spreadsheet_id=x`.
- A query of the `cells` table for all entries with `row_id IN [row_id1, row_id2, row_id3...]`.

It remains to be seen how quickly this will execute with a large database containing lots of spreadsheets. So this arrangement is subject to change.

A note on *formulae*: all evaluations of formulae will occur on the front-end. Rails and SQL will only ever see and store the unevaluated formulae.

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

## shares
column name    | data type | details
---------------|-----------|-----------------------
id             | integer   | not null, primary key
spreadsheet_id | integer   | not null, foreign key (references `spreadsheets`)
sharee_id      | integer   | not null, foreign key (references `users`)

## rows
column name    | data type | details
---------------|-----------|-----------------------
id             | integer   | not null, primary key
ord            | integer   | not null, unique in scope of spreadsheet_id (represents position of row in spreadsheet)
spreadsheet_id | integer   | not null, foreign key (references `spreadsheets`)

## cells
column name    | data type | details
---------------|-----------|-----------------------
id             | integer   | not null, primary key
ord            | integer   | not null, unique in scope of row_id (represents position of cell in row)
row_id         | integer   | not null, foreign key (references `rows`)
contents_str   | string    | may not be non-null when contents_int or contents_flo is non-null (contains contents of cell when cell contains formula or data that is not a number)
contents_int   | integer   | may not be non-null when contents_str or contents_flo is non-null (contains contents of cell when cell contains integer)
contents_flo   | float     | may not be non-null when contents_int or contents_str is non-null (contains contents of cell when cell contains number that is non-integer)

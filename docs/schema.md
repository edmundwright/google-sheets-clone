# Schema Information

A note on the storage of the spreadsheet data. There are I think two important priorities:

- That initially downloading the spreadsheet from the server is quick
- That uploading individual edits is quick

Loading the spreadsheet will be quicker the fewer SQL queries are necessary. This might, I think, favour storing the spreadsheet data in a single table entry containing a JSON representation of the entire spreadsheet.

But uploading individual edits will be quicker if only a small SQL update is necessary. This would favour storing the spreadsheet in a more granular fashion, with perhaps a cells table referencing a rows table referencing a spreadsheet table.

I am currently thinking of choosing a midpoint beteween the two approaches: a rows table, containing JSON arrays, referencing a spreadsheets table. This would mean that when a spreadsheet is downloaded, the number of queries necessary will be roughly equal to the number of rows. And when an individual edit is uploaded the entire row will have to be updated, but not the entire spreadsheet. I think in practice the best thing will be to test out different approaches, with spreadsheets of varying sizes, and see which gives the best balance of performance in dowloading versus editing. So this is subject to change.

## SQL

### users
column name     | data type | details
----------------|-----------|-----------------------
id              | integer   | not null, primary key
email           | string    | not null, unique
password_digest | string    | not null
session_token   | string    | not null, unique

### spreadsheets
column name | data type | details
------------|-----------|-----------------------
id          | integer   | not null, primary key
owner_id    | integer   | not null, foreign key (references users)
title       | string    | not null
public      | boolean   | not null, default: false

### shares
column name    | data type | details
---------------|-----------|-----------------------
id             | integer   | not null, primary key
spreadsheet_id | integer   | not null, foreign key (references spreadsheets)
sharee_id      | integer   | not null, foreign key (references users)

### rows
column name    | data type | details
---------------|-----------|-----------------------
id             | integer   | not null, primary key
spreadsheet_id | integer   | not null, foreign key (references spreadsheets)
contents       | string    | not null (contains JSON array, with each element being a string or integer representation of cell)

## JSON

The contents column of the `rows` SQL table will contain a JSON representation of a row. For example:

```
["=A1+B2", 5 , "Edmund", "=SUM(B2:B13)"]
```

All evaluations of formulae will occur on the front-end: Rails will only ever see and store the unevaluated formulae.

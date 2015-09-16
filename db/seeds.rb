# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

User.create(email: "edmund@edmund.io", name: "Edmund Wright", password: "password")
edmund_id = User.find_by(email: "edmund@edmund.io").id
Spreadsheet.create(owner_id: edmund_id, title: "My first spreadsheet")
Spreadsheet.create(owner_id: edmund_id, title: "Another spreadsheet")
Spreadsheet.create(owner_id: edmund_id, title: "Fruit")
Spreadsheet.create(owner_id: edmund_id, title: "Elephants", updated_at: "2013-09-14T14:19:31.285Z")
Spreadsheet.create(owner_id: edmund_id, title: "Tightrope walkers", updated_at: "2015-06-14T14:19:31.285Z")
Spreadsheet.create(owner_id: edmund_id, title: "Mountain walkers", updated_at: "2015-09-02T14:19:31.285Z")
Spreadsheet.create(owner_id: edmund_id, title: "Unicyclists", updated_at: "2015-09-03T14:19:31.285Z")
Spreadsheet.create(owner_id: edmund_id, title: "Venereal diseases", updated_at: "2015-09-14T14:19:31.285Z")

User.create(email: "jill@edmund.io", name: "Jill Fake", password: "password")
jill_id = User.find_by(email: "jill@edmund.io").id
Spreadsheet.create(owner_id: jill_id, title: "Jill's goals")
Spreadsheet.create(owner_id: jill_id, title: "Jill's lunch places")

Spreadsheet.all.each do |spreadsheet|
  (0...26).each do |row_index|
    (0...26).each do |col_index|
      Cell.create(
        spreadsheet_id: spreadsheet.id,
        row_index: row_index,
        col_index: col_index,
        contents_str: "r: #{row_index} c: #{col_index}"
      )
    end
  end
end

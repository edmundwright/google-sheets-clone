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
Spreadsheet.create(owner_id: edmund_id, title: "Elephants")

User.create(email: "jill@edmund.io", name: "Jill Fake", password: "password")
jill_id = User.find_by(email: "jill@edmund.io").id
Spreadsheet.create(owner_id: jill_id, title: "Jill's goals")
Spreadsheet.create(owner_id: jill_id, title: "Jill's lunch places")

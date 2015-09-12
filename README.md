# Google Sheets Clone

[Heroku link (not yet live)][heroku]

[heroku]: http://google-sheets-clone.herokuapp.com

## Minimum Viable Product
Google Sheets Clone (final name TBD) is a clone of Google Sheets built on Rails and Backbone. Users can:

<!-- This is a Markdown checklist. Use it to keep track of your progress! -->

- [ ] Create accounts
- [ ] Create sessions (log in)
- [ ] Create new spreadsheets
- [ ] See a list of their spreadsheets
- [ ] Input a formula into a cell, and see it calculated immediately upon pressing enter
- [ ] See any changes to a cell have an immediate effect on other cells that reference it
- [ ] Click on a cell to insert a reference to it into the formula currently being edited
- [ ] Select multiple cells by clicking and dragging
- [ ] Select whole rows or columns by clicking their headings
- [ ] Select multiple cells to insert a reference to them into the formula currently being edited
- [ ] Have their work be autosaved to the server immediately following any change
- [ ] Share a spreadsheet with other users
- [ ] See a list of the spreadsheets shared with them
- [ ] Make a spreadsheet public so that any other person with the link can access it

## Design Docs
* [View Wireframes][views]
* [DB schema][schema]

[views]: ./docs/views.md
[schema]: ./docs/schema.md

## Implementation Timeline

### Phase 1: User Authentication, Blog Creation (~1 day)
I will implement user authentication in Rails based on the practices learned at
App Academy. By the end of this phase, users will be able to create blogs using
a simple text form in a Rails view. The most important part of this phase will
be pushing the app to Heroku and ensuring that everything works before moving on
to phase 2.

[Details][phase-one]

### Phase 2: Viewing Blogs and Posts (~2 days)
I will add API routes to serve blog and post data as JSON, then add Backbone
models and collections that fetch data from those routes. By the end of this
phase, users will be able to create blogs and view both blogs and posts, all
inside a single Backbone app.

[Details][phase-two]

### Phase 3: Editing and Displaying Posts (~2 days)
I plan to use third-party libraries to add functionality to the `PostForm` and
`PostShow` views in this phase. First I'll need to add a Markdown editor to the
`PostForm`, and make sure that the Markdown is properly escaped and formatted in
the `PostShow` view. I also plan to integrate Filepicker for file upload so
users can add images to blog posts.

[Details][phase-three]

### Phase 4: User Feeds (~1-2 days)
I'll start by adding a `feed` route that uses the `current_user`'s
`subscribed_blogs` association to serve a list of blog posts ordered
chronologically. On the Backbone side, I'll make a `FeedShow` view whose `posts`
collection fetches from the new route.  Ultimately, this will be the page users
see after logging in.

[Details][phase-four]

### Phase 5: Searching for Blogs and Posts (~2 days)
I'll need to add `search` routes to both the Blogs and Posts controllers. On the
Backbone side, there will be a `SearchResults` composite view has `BlogsIndex`
and `PostsIndex` subviews. These views will use plain old `blogs` and `posts`
collections, but they will fetch from the new `search` routes.

[Details][phase-five]

### Bonus Features (TBD)
- [ ] Randomly generated spreadsheet URLs, to ensure security of publicly shared spreadsheets
- [ ] Drag to resize rows and columns
- [ ] Edit a spreadsheet simultaneously with another user, seeing their edits appear live
- [ ] Format cells with custom background and/or text colour

[phase-one]: ./docs/phases/phase1.md
[phase-two]: ./docs/phases/phase2.md
[phase-three]: ./docs/phases/phase3.md
[phase-four]: ./docs/phases/phase4.md
[phase-five]: ./docs/phases/phase5.md


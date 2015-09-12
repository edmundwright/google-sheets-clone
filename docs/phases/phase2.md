# Phase 2: Viewing Blogs and Posts

## Rails
### Models

### Controllers
Api::BlogsController (create, destroy, index, show)
Api::PostsController (create, destroy, show, update)

### Views
* blogs/show.json.jbuilder

## Backbone
### Models
* Blog (parses nested `posts` association)
* Post

### Collections
* Blogs
* Posts

### Views
* BlogForm
* BlogShow (composite view, contains PostsIndex subview)
* PostsIndex (composite view, contains PostsIndexItem subviews)
* PostsIndexItem
* PostShow

## Gems/Libraries

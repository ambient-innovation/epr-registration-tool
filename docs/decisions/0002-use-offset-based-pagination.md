# Use offset based pagination in Graphql API

* Status: accepted
* Deciders: Robin, Jens, Bartosz
* Date: 18.07.2022

Technical Story: [#18](https://gitlab.ambient-innovation.com/giz/epr-registration-tool/-/issues/18/)

## Context and Problem Statement

This list of packaging reports requires some kind of pagination in our GraphQL API.
This is the first time we are implementing a pagination within this project.  
There is [two types of pagination](https://uxdesign.cc/why-facebook-says-cursor-pagination-is-the-greatest-d6b98d86b6c0), 
which are relevant to us:
 - cursor based
 - offset based

The GraphQL spec generally recommends a cursor based pagination.
But we are also limited to the features offered by our GraphQL library `strawberry` 
and to the requirements of our project. 

## Decision Drivers

* PO wanted page stepper instead of "load more" button in the first place
* Strawberry does not provide pagination out of the box

## Considered Options

* cursor based
  * custom implementation
  * use third party package [strawberry-graphql-django-plus
](https://github.com/blb-ventures/strawberry-django-plus)
* offset based
  * custom implementation using standard Django  
    [Djnago pagination docs](https://docs.djangoproject.com/en/4.0/topics/pagination/)
  * use official django extension [strawberry-graphql-django
](https://github.com/strawberry-graphql/strawberry-graphql-django/tree/main/docs)

## Decision Outcome

Chosen option: **offset based custom implementation**, because:
- offset based pagination meets the wishes of the PO
- it does not require a third party library
- it is easy to implement

### Cursor based custom implementation

* Good, because of general advantages of cursor based pagination (see article at the top)
* Bad, because it can be tricky to implement

### Cursor based using strawberry-django-plus

* Good, because no custom implementation required
* Good, because strawberry-django-plus provides other useful features,  
  such as a Django Debug Toolbar integration and querset optimization
* Bad, because we are introducing another dependency
* Bad, because the package is maintained by a single developer, and it is not very popular

### Offset based using strawberry-graphql-django

* Bad, because it does not meet our requirements.  
  The pagination works, but the result does not contain any information about the
  current page (total number of results, number pages, has next page, etc.)

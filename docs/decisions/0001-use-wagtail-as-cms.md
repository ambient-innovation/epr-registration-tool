# Use Wagtail as CMS

* Status: accepted
* Deciders: Robin Zachmann (Dev), Ibrahim Taaloulou (Dev), Arne Ebner (UX), Dorothee Buerkle (PO, from GIZ) 
* Date: 2022-06-30

Technical Story: [#28](https://gitlab.ambient-innovation.com/giz/epr-registration-tool/-/issues/28)

## Context and Problem Statement

This project is mainly an interactive tool for creating packaging reports + handling fee calculation + invoices. 
But on top of that we need some content pages, providing information about the tool.
Because the budget of this project is very limited, we need either a very simple solution
or something that provides a lot of out-of-the-box components, so we don't have to waste
money on building things from scratch. 



## Decision Drivers

* required: multi-lang + rtl support
* goal: we need to be able to build a couple of content pages within 2-4 weeks

## Considered Options

* [Wagtail](https://wagtail.org/)
* [strapi](https://strapi.io/)
* [contentful](https://www.contentful.com/)
* [Wordpress](https://wordpress.com/) (self hosted)
* [storyblok](https://www.storyblok.com/)

| Backend<br/>Frontend | Django integrated          | External CMS<br/>(self hosted) | External CMS<br/>(cloud)       |
|----------------------|----------------------------|--------------------------------|--------------------------------|
| Headless             | Wagtail API v2             | Strapi                         | contenful                      |
| Full stack           | Wagtail template rendering | Wordpress                      | squarespace / storyblock / ... |


## Decision Outcome

In the end we had to decide between **Wordpress** and **Wagtail**.

Chosen option: **Wagtail**, because
- It's "free", means it does not cause extra monthly service costs
- We stick with one tech stack + have experience in the team
- We can use existing FE styling
- We can start simple + extend building blocks if the budget allows it
- (key argument) The customer want's to be able to use the CMS without much prior knowledge

### Positive Consequences

* Relatively easy setup, because we stick with the same tech stack as the rest of the application
* Dev team does not have to learn a new technology
* Good UX for the content editors
    * We can restrict what an editor can do and what not (avoid breaking things by accident)
    * Allows a single login for Django Admin and the CMS / one user account
* We can use static site generation within the existing next.js FE setup, 
  which was a wish of the dev team at the beginning of the project

### Negative Consequences <!-- optional -->

* We have to build everything from scratch, although there is no need for very custom styling
* Our monolith grows
* We may need to introduce roles / permissions in the backed to separate Django admin from contend editors
* The Wagtail API v2 is very limited

## Pros and Cons of the Options <!-- optional -->

### Wordpress (self-hosted)

* Good, because there is a huge ecosystem of free templates, plugins etc.
* Good, because the customer will easily find someone who is capable of extending a Wordpress site, 
  but with Wagtail it might be harder.
* Good, because we separate the complexity of the cms from our existing app (DDD)
* Bad, because Wordpress is huge, grown and hard to maintain
* Bad, because we have no experience in the team
* Bad, because Wordpress is hard to use for the customer without prior knowledge + the customer
  might break things by accident (main argument agains Wordpress in the end)

### Strapi

* Good, because of positive experience at Ambient
* Good, because it provides a REST + GraphQL Api out of the box
* Good, because we separate our Django backend from the CMS backend (DDD)
* Bad, because we have no experience in the dev team
* Bad, because the official examples didn't work 
  and the developer experience in the first programming attempts was not very good
* Bad, because it does not integrate well with Django, in case our backends have to talk to each other
* Bad, because admins have to create two accounts (Django admin + strapi)

### Wagtail (full-stack)

(compared to headless Wagtail)

* Good, because we don't need to worry about a web api
* Good, preview works out of the box
* Bad, because we cannot use existing FE styles / components
* Bad, we cannot make use of static-site-generation
* Bad, because we have to use/maintain two different approaches within the same project
  (api + react vs. classic template rendering)

__conclusion__: Using next.js does not seem to be so much more work, 
 so we think the benefits of using next.js outweigh the additional effort for setting up the api

### Contentful

* Good, because modern, easy to use headless CMS. 
* Out, because the monthly costs are not acceptable for the customer

### Squarespace / Storyblok

* Good, because it provides a lot of ready-made building blocks
* Good, because it has a modern web editor
* Out, because the monthly costs are not acceptable for the customer


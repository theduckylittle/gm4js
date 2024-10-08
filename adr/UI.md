# Choosing a UI Library

## Requirements

- Helpful with modal layout
- Provides utilities for grid rendering
- Customize-able with a size-based CSS

## Selection criteria

- Minimize bundle size impact
- 3+ years in existance
- MIT compatible license

## Notes on candidates

Duck used [Bundlephobia](https://bundlephobia.com/) to generate the size estimates and used the "minified" number as the guide.

### Rolling our own the GMV3 way

*Bundle size:* 0MB

Duck's notes:

- Too many bugs and too much work for things that are not at our core.

### React bootstrap

*Bundle size:* 123kb for react-boostrap, 59.1kb for bootstrap (peer dep)

- https://react-bootstrap.netlify.app/

### Primereact

*Bundle size:* 1.2MB

- https://primereact.org/

Duck's notes:

- Styles appear to be readable CSS.
- All components come in a single package.
- The library is pretty extensive.
- The table customization is off the charts and has an "everything" approach.

### Chakra UI

- https://v2.chakra-ui.com/getting-started

Duck's notes:

- I dismissed this one because of the length dependency packages.
- Being very emotion-centric also makes this one a difficult choice for allowing the 
  builder scripts (or light hackers) to customize the CSS.

### Mantine

*Bundle size:* 452kb for @mantine/core and 35.7kb for @mantine/hooks

Duck's notes:

- All components we need are in @mantine/core. 
- Light research shows they have a history of breaking things in feature version changes but 
  I think version pinning and our infrequent release cycle may hedge against this problem.
- Mantine is heavy on CSS variables. We could insert a mapping of `--geomoose-xxx` variables and
  backfill critical ones for custom themes.

## Paginating the Data Table

In GM3, virtualization was added to the data table to increase table rendering performance.
This was a great improvement but has also led to a number of bugs and a maintenance headache of
small, not-always-reproduceable UI quirks. Instead, the new version should support pagination,
this decision is suspported by a few sources:

- https://blog.hubspot.com/website/pagination-vs-infinite-scroll
- https://www.nngroup.com/articles/infinite-scrolling-tips/
- https://uxplanet.org/ux-infinite-scrolling-vs-pagination-1030d29376f1

The general vibe is that we can get a better, more consistent, and more meaningful use out of
the table if pagination is used instead of infinite scrolling.

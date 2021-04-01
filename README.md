[![Build Status](https://travis-ci.org/ebiwd/EBI-Corporatesite.svg?branch=master)](https://travis-ci.org/ebiwd/EBI-Corporatesite)

# EBI 'Corporate site' static pages

Static pages for the main www.ebi.ac.uk 'corporate' site.

The pages in this repository will be served as static files (they won't be served with Drupal).

## Why?

Some pages are better served as plain .html files and not through Drupal when:

1. They have very unique layouts (like the front page)
2. There is a need for more speed
3. They are unique and don't have much reusable content (travel page)
4. There is a lot "application" functionality (Services page)

Content from the Drupal site can still be used on static pages through dynamic JavaScript content (i.e. a news feed).

## Making changes to pages

You will need access to the Github repo to make edits (ask your friendly web-dev colleague).

1. Making development edits: All commits will be built and deployed to the EBI wwwdev server.
2. Edits to live site: "tagged" releases will be sent to the production server (this is currently limited to web dev staff).

# Code structure, developing the fonts

## Code structure

Source files are in /src, they map like so:

```
          Source                      Optimised                    Deployed
          ------                      ---------                    --------
Front:    src/index.html           >  build/index.html           >  www.ebi.ac.uk/
Training: src/training/index.html  >  build/training/index.html  >  www.ebi.ac.uk/training
```

## Use of branches

We use [Gitlab's CI service* to build the assets](https://gitlab.ebi.ac.uk/ebiwd/EBI-Corporatesite/blob/master/.gitlab-ci.yml); here's the branch structure:

- main: Source code that will be pulled into EBI's Gitlab server for gulp compilation and distribution

* This Gitlab instance is only accessible from the EBI network.

### Versioning

We use semantic versioning style of releases.

| Major release | Minor release | Note |
| ------------- | ------------- | ---- |
| (Branch)      | (Tag)         | |
| master        | .0            | Initial release  |
| master        | .1            | Tagged minor release |

### Test changes

More radical changes should be done on a feature branch.

### Configuring the site

- In `package.json` update `vfConfig`
- In `elevnety.js` update `pathPrefix`
- Update `./src/site/_data/siteConfig.js`

Otherwise configure gulp and eleventy as you would for any other project.

### Developing and adding content

1. You'll need to [install npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
1. If you don't have `yarn`, install it
   - https://yarnpkg.com/lang/en/docs/install/
1. Install all the things
   - `yarn install`
1. Generate the site in `/build`
   - `gulp dev` renders and serves
   - `gulp build` build static assets
1. Edit all the things:
   - pages: `./src/site/`
   - templates: `.src/site/_includes`
   - site information: `./src/site/_data`
   - local css: `./src/scss`

### Adding Visual Framework components

To add a component you can use Yarn or install it manually.

In either case you'll need to re-run `gulp dev` to ensure the component is fully loaded.

#### By package

- installation: `yarn add @visual-framework/vf-logo`
- updating components: `yarn upgrade-interactive --latest`
  - alias: `yarn run update-components`

#### Manual installation for customisation

1. Download a pattern
2. Copy it to `./src/components/vf-component-name`

#### Create your own local component

You can add a custom VF-compatible component to `./src/components` and use it in
your site.

- `gulp vf-component`

You'll find a `vf-sample` component already placed in `./src/components`

### Footnotes

- Why `yarn` and not `npm`?
  For the particular structure of the Visual Framework components, Yarn is considerably
  faster at installing and does so more efficiently (about half the total file size). You'll
  also be able to use `yarn upgrade-interactive --latest`, which makes it easier to update
  VF components.

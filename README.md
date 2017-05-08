# EBI-Corporatesite
Static pages for the main www.ebi.ac.uk site. -- At present we just have the front page, but other interior pages should be added soon.

## Strcuture
Source files are in /src, they map like so:

```
src/index.html          > www.ebi.ac.uk/
src/training/index.html > www.ebi.ac.uk/training
```

## Coming soon
We're working on a build process that:
1. Adds the critical path CSS (minus fonts, images)
2. Optionally bakes in images (does not support relative url: //, must have local or http/s)
3. Minifies any inline css/js

### Demo
The Github server is not production, but this compares the static page before/after:

- Before: https://ebiwd.github.io/EBI-Corporatesite/src
- After: https://ebiwd.github.io/EBI-Corporatesite/dist

#### Results

[![alt text](assets/readme/performance-timings.png "Performance timings")](https://www.webpagetest.org/video/compare.php?tests=170508_5G_bbac80592e8a6982bb442dfce733f626,170508_66_5c3bd9d66aeb872d713be241f738dba4,170508_4X_18331d7513ef3beae9ddbfec1c8eaf0a)
A comparison of the above two URLs. [View the more detailed report](https://www.webpagetest.org/video/compare.php?tests=170508_5G_bbac80592e8a6982bb442dfce733f626,170508_66_5c3bd9d66aeb872d713be241f738dba4,170508_4X_18331d7513ef3beae9ddbfec1c8eaf0a)

## To do?
- Handlebars optimisations?
- Concat all external css/js?

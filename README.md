i18n
====

To add a locale:

* Set `lang='ISO'` on HTML elements
* Add language `ISO` to `_/js/Config.js` `langSupported`
* Add `ISO_*` fields to `stock.json`
* Make sure the CSS and related `flag.png` support the language — cf [Flag Sprites](http://www.flag-sprites.com/)
* Update `jQuery('#menu').slicknav.label` in `Router.js`

Optinally append ?en or ?hu to URIs:

    http://judit/?hu
    http://judit/?hu#/gallery/New

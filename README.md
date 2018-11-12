# Unhosted!

https://unhosted.org/

# TODO
* Remove bloody jQuery
* Fix initial view of http://localhost:8080/?#search/spring/SKU2
* Fix click-zoom port
* Replace Fluid-Masonry
* Restore mobile menu pre-scroll
* Use one global basket collection
* Add search page for slide nav
* Singletons via .extend's second arg, `classProperties`
* Use the JSON on Google Drive for Judit's account

# i18n

We have few locales, and little text, so we mainly rely upon
inline `lang` attributes, which suits SEO.

To add a locale:

* Add `ISO_*` fields to `stock.json`
* Set `lang='ISO'` on HTML elements
* Add language `ISO` to `_/js/Config.js` `langSupported`
* Make sure the CSS and related `flag.png` support the language — cf [Flag Sprites](http://www.flag-sprites.com/)
* Update `jQuery('#menu').slicknav.label` in `Router.js`

Optinally append `?en` or `?hu` to URIs:

    http://judit/?hu
    http://judit/?hu#/gallery/New

To get or set a language, use the `Languages.js` JavaScript 'bean'.

# References

## PayPal

https://www.paypal.com/cgi-bin/webscr?cmd=p/pdn/howto_checkout-outside

https://developer.paypal.com/docs/classic/paypal-payments-standard/integration-guide/encryptedwebpayments/#id08A3I0P017Q

## Responsive Images

http://www.smashingmagazine.com/2014/05/14/responsive-images-done-right-guide-picture-srcset/

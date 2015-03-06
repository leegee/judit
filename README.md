# TODO

Use one global basket collection

Add search page for slide nav

# i18n

To add a locale:

* Add `ISO_*` fields to `stock.json`
* Set `lang='ISO'` on HTML elements
* Add language `ISO` to `_/js/Config.js` `langSupported`
* Make sure the CSS and related `flag.png` support the language — cf [Flag Sprites](http://www.flag-sprites.com/)
* Update `jQuery('#menu').slicknav.label` in `Router.js`

Optinally append ?en or ?hu to URIs:

    http://judit/?hu
    http://judit/?hu#/gallery/New

To get or set a language, use the `Languages.js` JavaScript bean.

# References

## PayPal

https://www.paypal.com/cgi-bin/webscr?cmd=p/pdn/howto_checkout-outside

https://developer.paypal.com/docs/classic/paypal-payments-standard/integration-guide/encryptedwebpayments/#id08A3I0P017Q

## Responsive Images

http://www.smashingmagazine.com/2014/05/14/responsive-images-done-right-guide-picture-srcset/

define([
    'jQuery', 'Backbone', 'Underscore', 'Config'
], function (
    jQuery, Backbone, _, Config
) {

    var Language; // Private

    var Languages = {
        init: function () {
            jQuery('.change-language').on('click', function (e) {
                var lang = 'en';
                if (this.dataset.setlang && Config.langSupported[ this.dataset.setlang ]){
                    lang = this.dataset.setlang;
                }
                return Languages.set( lang );
            });
        },

        get: function () {
            return Language;
        },

        set: function (lang) {
            var qs = document.location.search.match(/^\?(..)/);
            if (qs != null && qs.length > 0) {
                qs = qs[1];
            }
            Language = lang || qs || navigator.language.match('^(..)')[1];

            if (!Config.langSupported[Language]){
                Language = Config.defaultLang;
            }

            var styles = [];
            Object.keys(Config.langSupported).forEach( function (i,j){
                if (i !== Language){
                    styles.push( "[lang='"+i+"']" );
                }
            });

            jQuery('#set-languages').remove();
            var html = "<style id='set-languages'>" +
                styles.join(",") +
                " { display:none; background:yellow }</style>";
            jQuery(html).appendTo("head");

            jQuery("[data-setlang]").show();
            jQuery("[data-setlang=" + Language + "]").hide();

            Languages.trigger("change", Language);
        }
    };

    _.extend(Languages, Backbone.Events);

    return Languages;
});

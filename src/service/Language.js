import jQuery from 'jquery';
import _ from 'underscore';
import { Config } from '../Config';
import Backbone from 'backbone';

let Language;

const _Languages = {
    init: function () {
        jQuery('.change-language').on('click', function () {
            let lang = 'en';
            if (this.dataset.setlang && Config.langSupported[this.dataset.setlang]) {
                lang = this.dataset.setlang;
            }
            return _Languages.set(lang);
        });
    },

    get: function () {
        return Language;
    },

    set: function (lang) {
        const qs = document.location.search.match(/^\?(..)/);
        if (qs != null && qs.length > 0) {
            qs = qs[1];
        }
        Language = lang || qs || navigator.language.match('^(..)')[1];

        if (!Config.langSupported[Language]) {
            Language = Config.defaultLang;
        }

        const styles = [];
    Object.keys(Config.langSupported).forEach((i) => {
            if (i !== Language) {
                styles.push("[lang='" + i + "']");
            }
        });

        jQuery('#set-_Languages').remove();
        const html = "<style id='set-_Languages'>" +
            styles.join(",") +
            " { display:none }</style>";
        jQuery(html).appendTo("head");

        jQuery("[data-setlang]").show();
        jQuery("[data-setlang=" + Language + "]").hide();

        _Languages.trigger("change", Language);
    }
};

_.extend(_Languages, Backbone.Events);

export const Languages = _Languages;
import { Backbone } from 'backbone';
import { jQuery } from 'jquery';

export class Modal {
    constructor() {
        this.$close = null;
        this.bodyCss = {};
        this.open = false;
    }
    show(options) {
        if (this.open) {
            return;
        }
        var self = this;
        this.open = true;
        this.templateCompiled = options.templateCompiled;
        this.$el = options.$el;
        this.closeUrl = options.closeUrl;
        Backbone.history.navigate(options.showUrl);
        this.$body = jQuery(document.body);
        this.bodyCssDefault = this.bodyCssDefault || {
            overflow: self.$body.css('overflow'),
            height: self.$body.css('height'),
            width: self.$body.css('width')
        };
        this.$body.css({
            overflow: 'hidden',
            height: window.innerHeight,
            width: window.innerWidth
        });
        jQuery(document).on('touchmove.modal', function (e) {
            e.preventDefault();
        });
        this.$el.html(this.templateCompiled(options.model));
        this.$el.show();
        window.scrollTo(0, 0);
        this.$close = jQuery('#modal-close');
        this.$close.on('click', function () {
            self.close();
        });
        jQuery(document).on('keyup.modal', function (e) {
            e = e || window.event;
            if (e.keyCode === 27) {
                self.close();
            }
        });
    }
    close() {
        var self = this;
        this.$close.off('click');
        this.$el.hide('fast', this.afterClose(this));
    }
    afterClose(self) {
        self.open = false;
        self.$el.empty();
        self.$body.css({
            overflow: self.bodyCssDefault.overflow,
            width: self.bodyCssDefault.width,
            height: self.bodyCssDefault.height
        });
        jQuery(document).off('touchmove.modal');
        jQuery(document).off('keyup.modal');
        if (self.closeUrl) {
            Backbone.history.navigate(self.closeUrl, { trigger: true });
        }
        else {
            Backbone.history.history.back();
        }
    }
}


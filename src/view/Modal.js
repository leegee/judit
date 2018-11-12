import jQuery from 'jquery';
import Backbone from 'backbone';

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
        this.open = true;
        this.templateCompiled = options.templateCompiled;
        this.$el = options.$el;
        this.closeUrl = options.closeUrl;
        Backbone.history.navigate(options.showUrl);
        this.$body = jQuery(document.body);
        this.bodyCssDefault = this.bodyCssDefault || {
            overflow: this.$body.css('overflow'),
            height: this.$body.css('height'),
            width: this.$body.css('width')
        };
        this.$body.css({
            overflow: 'hidden',
            height: window.innerHeight,
            width: window.innerWidth
        });
        jQuery(document).on('touchmove.modal', (e) => {
            e.preventDefault();
        });
        this.$el.html(this.templateCompiled(options.model));
        this.$el.show();
        window.scrollTo(0, 0);
        this.$close = jQuery('#modal-close');
        this.$close.on('click', () => {
            this.close();
        });
        jQuery(document).on('keyup.modal', (e) => {
            e = e || window.event;
            if (e.keyCode === 27) {
                this.close();
            }
        });
    }
    close() {
        this.$close.off('click');
        this.$el.hide('fast', this.afterClose());
    }
    afterClose() {
        this.open = false;
        this.$el.empty();
        this.$body.css({
            overflow: this.bodyCssDefault.overflow,
            width: this.bodyCssDefault.width,
            height: this.bodyCssDefault.height
        });
        jQuery(document).off('touchmove.modal');
        jQuery(document).off('keyup.modal');
        if (this.closeUrl) {
            Backbone.history.navigate(this.closeUrl, { trigger: true });
        }
        else {
            Backbone.history.history.back();
        }
    }
}


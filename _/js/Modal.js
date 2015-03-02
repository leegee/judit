define( [
    'jQuery', 'Backbone', 'Underscore'
], function (
    jQuery, Backbone, _
){
    'use strict';

    var Modal = function (options) {
        this.templateCompiled = options.templateCompiled;
        this.$el              = options.$el;
        this.$close           = null;
        this.bodyCss          = {};
        this.open             = false;
    };

    Modal.prototype.show = function (options) {
        if (this.open){
            return;
        }
        var self = this;
        this.open = true;

        console.log("Open");
        console.trace();

        Backbone.history.navigate(options.showUrl);
        this.closeUrl = options.closeUrl;

        this.$body = jQuery(document.body);
        this.bodyCssDefault  = {
            overflow:   self.$body.css('overflow'),
            height:     self.$body.css('height'),
            width:      self.$body.css('width')
        };
        this.$body.css({
            overflow: 'hidden',
            height: window.innerHeight,
            width: window.innerWidth
        });
        jQuery(document).on('touchmove.modal', function (e) {
            e.preventDefault();
        });

        this.$el.html(
            this.templateCompiled( options.model )
        );
        this.$el.show();

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
    };

    Modal.prototype.close = function () {
        var self = this;
        this.$close.off('click');
        this.$el.hide('fast', this.afterClose(this) );
    };

    Modal.prototype.afterClose = function (self) {
        self.open = false;
        self.$el.empty();
        self.$body.css({
            overflow:   self.bodyCssDefault.overflow,
            width:      self.bodyCssDefault.width,
            height:     self.bodyCssDefault.height
        });
        console.log("Close");
        console.trace();

        jQuery(document).off('touchmove.modal');
        jQuery(document).off('keyup.modal');
        Backbone.history.navigate(self.closeUrl);
    };

    return Modal;
});

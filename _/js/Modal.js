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
        this.open = true;

        var self = this;
        Backbone.history.navigate(options.showUrl);
        this.closeUrl = options.closeUrl;

        self.$body = jQuery(document.body);
        this.bodyCssDefault  = {
            overflow:   self.$body.css('overflow'),
            height:     self.$body.css('height'),
            width:      self.$body.css('width')
        };
        self.$body.css({
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
            if (e.keyCode == 27) {
                self.close();
            }
        });
    };

    Modal.prototype.close = function () {
        var self = this;
        this.$el.hide('slow', function () {
            self.open = false;
            self.$el.empty();
            self.$body.css({
                overflow:   self.bodyCssDefault.overflow,
                width:      self.bodyCssDefault.width,
                height:     self.bodyCssDefault.height
            });
            jQuery(document).off('touchmove.modal');
            jQuery(document).off('keyup.modal');
            Backbone.history.navigate(self.closeUrl);
        });
    };

    return Modal;
});

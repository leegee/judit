define( [
    'jQuery', 'Backbone', 'Underscore'
], function (
    jQuery, Backbone, _
){
    'use strict';

    var Modal = function (options) {
        this.template   = _.template( options.template );
        this.$el        = options.$el;
        this.$close     = null;
        this.bodyCss    = {};
        this.open       = false;
    };

    Modal.prototype.show = function (options) {
        if (this.open){
            return;
        }
        this.open = true;

        var self = this;
        Backbone.history.navigate(options.showUrl);
        this.closeUrl = options.closeUrl;

        this.bodyCss.overflow = jQuery(document.body).css('overflow');
        jQuery(document.body).css('overflow', 'hidden');

        this.$el.html(
            this.template( options.model )
        );
        this.$el.show();

        this.$close = jQuery('#modal-close')
        this.$close.on('click', function () {
            self.close();
        });

        jQuery(document).on('keyup.modal', function (e) {
            e = e || window.event;
            if (e.keyCode == 27) {
                self.close();
                jQuery(document).off('keyup.modal');
            }
        });
    };

    Modal.prototype.close = function () {
        var self = this;
        this.$el.hide('slow', function () {
            self.open = false;
            self.$el.empty();
            jQuery(document.body).css('overflow', self.bodyCss.overflow);
            Backbone.history.navigate(self.closeUrl);
        });
    };

    return Modal;
});

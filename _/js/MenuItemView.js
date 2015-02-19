define( [
    'jQuery', 'Backbone', 'Underscore'
], function (
    jQuery, Backbone, _
){
    'use strict';

    // MenuItemView
    return Backbone.View.extend({
        tagName: 'li',
        className: 'scroll',

        initialize: function (options) {
            this.template = _.template( jQuery('#menu-gallery-item-template').text() );
            this.model = options;
        },

        render: function () {
            this.$el.html(
                this.template( this.model )
            );
            this.$el.insertBefore('#menu-contact');
        }
    });
});

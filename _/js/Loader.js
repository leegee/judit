define( ['jQuery','Underscore'], function (jQuery, _) {
    var Rendered = false;
    var Loader = function (options) {
        if (! Rendered){
            this.template = _.template( jQuery('#loader-template').text() );
            this.$el = jQuery(this.template());
            this.$el.hide();
            jQuery(document.body).append( this.$el );
        }
        else {
            this.$el.hide();
            this.$el = jQuery('#loader');
        }
        this.$status = jQuery('#loader-status-inside');
        this.total = this.current = null;
        this.reset( options.total );
    };

    Loader.prototype.reset = function (total) {
        this.current = 0;
        this.$status.css( 'width', 0 );
        if (total) this.total = total;
    };

    Loader.prototype.show = function () {
        this.$el.show();
    };

    Loader.prototype.hide = function () {
        this.$el.hide();
    };

    Loader.prototype.increment = function () {
        this.current ++;
        this.$status.css( 'width', ((this.current / this.total) * 100) + '%');
    };

    return Loader;
});

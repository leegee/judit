import jQuery from 'jquery';
import _ from 'underscore';

const Rendered = false;
export const Loader = function (options) {
    if (!Rendered) {
        this.template = _.template(jQuery('#loader').text());
        this.$el = jQuery(this.template());
        this.$el.hide();
        jQuery(document.body).append(this.$el);
    }
    else {
        this.$el.hide();
        this.$el = jQuery('#loader');
    }
    this.$status = jQuery('#loader-status-inside');
    this.total = this.current = null;
    this.reset(options.total);
};

Loader.prototype.reset = function (total) {
    this.current = 0;
    this.$status.css('width', 0);
    if (total) {
        this.total = total;
    }
    return this;
};

Loader.prototype.show = function () {
    this.$el.show();
    return this;
};

Loader.prototype.hide = function () {
    this.$el.hide();
    return this;
};

Loader.prototype.increment = function () {
    this.current++;
    this.$status.css('width', ((this.current / this.total) * 100) + '%');
    return this;
};


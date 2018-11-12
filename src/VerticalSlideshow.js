/** 
 * Vertically scrolling slide show, 
 * cf Valentino document.body.scrollTop = document.documentElement.scrollTop = 0;
 * 
 * ```
 * new VerticalSlideShow({
        container: '#container', // leave blank for window
        selector: 'img'
    });
* ```
**/

import { jQuery } from 'jquery';

export const VerticalSlideShow = function (args) {
    if (typeof args.container === 'undefined') {
        this.isWindow = true;
        args.container = 'html'
        this.container = jQuery('html');
    } else {
        this.container = jQuery(args.container);
    }
    this.container.css({
        overflow: 'auto',
        position: 'relative'
    });

    this.selector = args.selector || 'img';
    this.offset = args.offset || 0;

    this.els = jQuery(args.container + ' ' + this.selector);
    for (var i = 0; i < this.els.length; i++) {
        this.els[i] = jQuery(this.els[i]);
    }

    this.direction = 0;
    this.scrollDuration = 300;
    this.delayAfter = 500;
    this.currentIndex = 0;
    this.lastViewTop = -1;
    this.ready = true;
};

VerticalSlideShow.prototype.start = function () {
    var self = this;
    var o = this.isWindow ? jQuery(window) : this.container;
    o.on('scroll.VerticalSlideShow touchmove.VerticalSlideShow', function (e) {
        self.scrollContainer();
    });
};

VerticalSlideShow.prototype.stop = function () {
    var o = this.isWindow ? jQuery(window) : this.container;
    o.off('scroll.VerticalSlideShow touchmove.VerticalSlideShow');
};

VerticalSlideShow.prototype.scrollContainer = function () {
    if (this.ready == false) {
        return;
    }

    this.ready = false;
    this.viewTop = this.container.scrollTop();
    this.viewBottom = this.viewTop + jQuery(window).height();
    this.direction = this.viewTop >= this.lastViewTop ? 1 : -1;
    this.currentIndex += this.direction;

    if (this.currentIndex >= 0 && this.currentIndex < this.els.length - 1) {
        var self = this;
        self.container.animate(
            {
                scrollTop: self.els[self.currentIndex].offset().top
                    + (self.isWindow ?
                        0 : self.container.scrollTop()
                        + self.offset
                    )
                // - self.container.offset().top
            },
            self.scrollDuration,
            function () {
                self.lastViewTop = self.container.scrollTop();
                setTimeout(function () {
                    self.ready = true
                }, self.delayAfter);
            }
        );
    }

    else {
        this.currentIndex -= this.direction;
        this.ready = true;
    }
};





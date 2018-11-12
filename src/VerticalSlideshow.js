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

import 'velocity-animate';

export class VerticalSlideShow {
    constructor(args) {
        if (typeof args.container === 'undefined') {
            this.isWindow = true;
            args.container = 'html';
        }
        this.container = document.querySelector(args.container);
        this.container.style.overflow = 'auto';
        this.container.style.position = 'relative';

        this.selector = args.selector || 'img';
        this.offset = args.offset || 0;

        const selector = args.container + ' ' + this.selector;
        this.els = document.querySelectorAll(selector);
        this.direction = 0;
        this.scrollDuration = 300;
        this.delayAfter = 500;
        this.currentIndex = 0;
        this.lastViewTop = -1;
        this.ready = true;
        this.o = this.isWindow ? window : this.container;
    }

    start() {

        // this.o.on('scroll.VerticalSlideShow touchmove.VerticalSlideShow', (e) => {
        //     this.scrollContainer();
        // });
        this.o.onscroll = this.o.touchmove = () => {
            this.scrollContainer();
        };
    }

    stop() {
        // this.o.off('scroll.VerticalSlideShow touchmove.VerticalSlideShow');
    }

    scrollContainer() {
        if (!this.ready) {
            return;
        }

        this.ready = false;
        this.viewTop = this.container.scrollTop();
        this.viewBottom = this.viewTop + Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

        this.direction = this.viewTop >= this.lastViewTop ? 1 : -1;
        this.currentIndex += this.direction;

        if (this.currentIndex >= 0 && this.currentIndex < this.els.length - 1) {
            this.container.velocity({
                scrollTop: this.els[this.currentIndex].offset().top
                    + (this.isWindow ?
                        0 : this.container.scrollTop()
                        + this.offset)
                // - this.container.offset().top
            }, this.scrollDuration, () => {
                this.lastViewTop = this.container.scrollTop();
                setTimeout(() => {
                    this.ready = true;
                }, this.delayAfter);
            });
        }
        else {
            this.currentIndex -= this.direction;
            this.ready = true;
        }
    }
}








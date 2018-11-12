import jQuery from 'jquery';
import Backbone from 'backbone';
import { promiseToCreateRouter } from '../Router';
import { Languages } from '../service/Language';

function setVariableHeader() {
    const MenuBar = jQuery('header.nav-ctrl').clone();
    let Scrolled = false;

    MenuBar.removeClass('nav-ctrl');
    MenuBar.addClass('menubar');
    jQuery(document.body).prepend(MenuBar);
    const MenuBarHeight = MenuBar.height();

    jQuery(window).on("scroll touchmove", () => {
        Scrolled = true;
    });
    setInterval(() => {
        if (Scrolled) {
            Scrolled = false;
            jQuery(document.body).toggleClass(
                'scrolled',
                jQuery(document).scrollTop() > MenuBarHeight
            );
        }
    }, 333);
}

export const ViewMain = Backbone.View.extend({
    initialize: function () {
        promiseToCreateRouter.then(
            (AppRouter) => {
                const router = new AppRouter();

                setVariableHeader();

                Languages.init();
                Languages.set();

                // Close/open the mobile menu when clicked
                jQuery('.nav-ctrl').on('click', () => {
                    jQuery(document.body).toggleClass('nav-open');
                });

                // Don't close the mobile menu if clicking for search
                jQuery('.search .q').on('click', (e) => {
                    e.stopPropagation();
                });

                jQuery('.search').on('submit', () => {
                    jQuery(document.body).removeClass('nav-open');
                    router.navigate('#/search/' + jQuery('.q').val());
                });

                Backbone.history.start({ pushState: false });
            },

            (err) => {
                console.error('Error initing router', err);
            }
        );
    },

    render: function (dressIdToShow) {
        console.warn('called render', dressIdToShow);
    }
});

import { Backbone } from 'backbone';
import { jQuery } from 'jquery';
import { promiseToCreateRouter } from '../Router';
import { Language } from '../service/Language';

function setVariableHeader() {
    var MenuBar = jQuery('header.nav-ctrl').clone(),
        MenuBarHeight = null,
        Scrolled = false;

    MenuBar.removeClass('nav-ctrl');
    MenuBar.addClass('menubar');
    jQuery(document.body).prepend(MenuBar);
    MenuBarHeight = MenuBar.height();

    jQuery(window).on("scroll touchmove", function () {
        Scrolled = true;
    });
    setInterval(function () {
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
    initialize: function (options) {
        promiseToCreateRouter.then(
            function (AppRouter) {
                var router = new AppRouter();

                setVariableHeader();

                Language.init();
                Language.set();

                // Close/open the mobile menu when clicked
                jQuery('.nav-ctrl').on('click', function (e) {
                    jQuery(document.body).toggleClass('nav-open');
                });

                // Don't close the mobile menu if clicking for search
                jQuery('.search .q').on('click', function (e) {
                    e.stopPropagation();
                });

                jQuery('.search').on('submit', function (e) {
                    jQuery(document.body).removeClass('nav-open');
                    router.navigate('#/search/' + jQuery('.q').val());
                });

                Backbone.history.start({ pushState: false });
            },

            function (err) {
                console.error('Error initing router', err);
            }
        );
    },

    render: function (dressIdToShow) {
    }
});

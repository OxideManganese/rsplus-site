/* A polyfill for browsers that don't support ligatures. */
/* The script tag referring to this file must be placed before the ending body tag. */

/* To provide support for elements dynamically added, this script adds
   method 'icomoonLiga' to the window object. You can pass element references to this method.
*/
(function () {
    'use strict';
    function supportsProperty(p) {
        var prefixes = ['Webkit', 'Moz', 'O', 'ms'],
            i,
            div = document.createElement('div'),
            ret = p in div.style;
        if (!ret) {
            p = p.charAt(0).toUpperCase() + p.substr(1);
            for (i = 0; i < prefixes.length; i += 1) {
                ret = prefixes[i] + p in div.style;
                if (ret) {
                    break;
                }
            }
        }
        return ret;
    }
    var icons;
    if (!supportsProperty('fontFeatureSettings')) {
        icons = {
            'phone': '&#xe942;',
            'telephone': '&#xe942;',
            'undo2': '&#xe967;',
            'left': '&#xe967;',
            'bubble2': '&#xe96e;',
            'comment2': '&#xe96e;',
            'cogs': '&#xe995;',
            'gears': '&#xe995;',
            'arrow-up': '&#xea32;',
            'up': '&#xea32;',
            'arrow-right': '&#xea34;',
            'right3': '&#xea34;',
            'arrow-down': '&#xea36;',
            'down': '&#xea36;',
            'arrow-left': '&#xea38;',
            'left3': '&#xea38;',
            'circle-left': '&#xea44;',
            'left5': '&#xea44;',
            'mail3': '&#xea84;',
            'contact3': '&#xea84;',
            'mail5': '&#xea86;',
            'contact5': '&#xea86;',
            'feed3': '&#xea9c;',
            'rss2': '&#xea9c;',
          '0': 0
        };
        delete icons['0'];
        window.icomoonLiga = function (els) {
            var classes,
                el,
                i,
                innerHTML,
                key;
            els = els || document.getElementsByTagName('*');
            if (!els.length) {
                els = [els];
            }
            for (i = 0; ; i += 1) {
                el = els[i];
                if (!el) {
                    break;
                }
                classes = el.className;
                if (/icon-/.test(classes)) {
                    innerHTML = el.innerHTML;
                    if (innerHTML && innerHTML.length > 1) {
                        for (key in icons) {
                            if (icons.hasOwnProperty(key)) {
                                innerHTML = innerHTML.replace(new RegExp(key, 'g'), icons[key]);
                            }
                        }
                        el.innerHTML = innerHTML;
                    }
                }
            }
        };
        window.icomoonLiga();
    }
}());

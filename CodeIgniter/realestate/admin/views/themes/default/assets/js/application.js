
// Variables
// ------------------------------
var headerHeight = 56;

// ------------------------------
// Browser Detection Plugin
// https://github.com/gabceb/jquery-browser-plugin/
// ------------------------------
!function(a,b){"use strict";var c,d;if(a.uaMatch=function(a){a=a.toLowerCase();var b=/(opr)[\/]([\w.]+)/.exec(a)||/(chrome)[ \/]([\w.]+)/.exec(a)||/(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(a)||/(webkit)[ \/]([\w.]+)/.exec(a)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(a)||/(msie) ([\w.]+)/.exec(a)||a.indexOf("trident")>=0&&/(rv)(?::| )([\w.]+)/.exec(a)||a.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(a)||[],c=/(ipad)/.exec(a)||/(iphone)/.exec(a)||/(android)/.exec(a)||/(windows phone)/.exec(a)||/(win)/.exec(a)||/(mac)/.exec(a)||/(linux)/.exec(a)||/(cros)/i.exec(a)||[];return{browser:b[3]||b[1]||"",version:b[2]||"0",platform:c[0]||""}},c=a.uaMatch(b.navigator.userAgent),d={},c.browser&&(d[c.browser]=!0,d.version=c.version,d.versionNumber=parseInt(c.version)),c.platform&&(d[c.platform]=!0),(d.android||d.ipad||d.iphone||d["windows phone"])&&(d.mobile=!0),(d.cros||d.mac||d.linux||d.win)&&(d.desktop=!0),(d.chrome||d.opr||d.safari)&&(d.webkit=!0),d.rv){var e="msie";c.browser=e,d[e]=!0}if(d.opr){var f="opera";c.browser=f,d[f]=!0}if(d.safari&&d.android){var g="android";c.browser=g,d[g]=!0}d.name=c.browser,d.platform=c.platform,a.browser=d}(jQuery,window);


// ------------------------------
// =UTILITY BELT
// Psst: Search for '=u' to come straight here. You're welcome.
// ------------------------------
var Utility = {
    str_replace: function(c, d, b) {
        var a = c.split(d);
        return a.join(b);
    },
    str_exists: function(b, c) {
        var a = b.split(c);
        if (a[0] === b) {
            return false;
        } else {
            return true;
        }
    },
    toggle_fullscreen: function(elem) {
        // can fullscreen any element
        if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
            if (elem.requestFullScreen) {
                elem.requestFullScreen();
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullScreen) {
                elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            }
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    },
    getViewPort: function() {
        var e = window, a = 'inner';
        if (!('innerWidth' in window)) {
            a = 'client';
            e = document.documentElement || document.body;
        }
        return {
            width: e[a + 'Width'],
            height: e[a + 'Height']
        };
    },
    getSidebarViewportHeight: function () {
        var h;
        h = $(window).height() - headerHeight;
        return h;
    },
    sidebar_resizing: function() {
        if ($('#topnav').hasClass('navbar-fixed-top')) {
            $('.static-sidebar').css('top', headerHeight + 'px');
        } else {
            var scr = $('body').scrollTop();

            $('.static-sidebar').css('top', '0px');


            if (scr < headerHeight) {
                $('.static-sidebar').css('top',(headerHeight - scr) + 'px');
            } else {
                $('.static-sidebar').css('top','0px');
            }
        }

        Utility.initScroller();
    },
    getBrandColor: function (name) {
        // Store Brand colors in JS so it can be called from plugins
        var brandColors = {
            'default':      '#fafafa',
            'gray':         '#9e9e9e',

            'inverse':      '#757575',
            'primary':      '#03a9f4',
            'success':      '#8bc34a',
            'warning':      '#ffc107',
            'danger':       '#e51c23',
            'info':         '#00bcd4',
            
            'brown':        '#795548',
            'indigo':       '#3f51b5',
            'orange':       '#ff9800',
            'midnightblue': '#37474f',
            'teal':         '#009688',
            'pink':         '#e91e63',
            'purple':       '#9c27b0',
            'green':        '#4caf50',
            'deeppurple':   '#673ab7',
            'deeporange':   '#ff5722',
            'lime':         '#cddc39',
            'lime':         '#2196f3'
        };

        if (brandColors[name]) {
            return brandColors[name];
        } else {
            return brandColors['default'];
        }
    },
    toggle_leftbar: function() {
        var menuCollapsed = localStorage.getItem('collapsed_menu');
        
        $('body').toggleClass('sidebar-collapsed');

        if (menuCollapsed == "true")
            localStorage.setItem('collapsed_menu', "false");
        else if (menuCollapsed == "false")
            localStorage.setItem('collapsed_menu', "true");
        
        setTimeout(function(){                  // wait 500ms before calling resize
            $(window).trigger('resize');        // so toggle happens faster instead of
        }, 500);                                // sticking out
    },
    initScroller: function() {
        $(".scroll-pane").nanoScroller({ paneClass: 'scroll-track',  sliderClass: 'scroll-thumb', contentClass: 'scroll-content' });
    },
    destroyScroller: function(elem) {
        $(elem).nanoScroller({ destroy: true });
    },
    animateContent: function () {
        if ($.fn.velocity) {
            $('.animated-content .info-tile, .animated-content .panel')
            .css('visibility', 'visible')
            .velocity('transition.slideUpIn', {stagger: 50});
        }
    }
};
// ------------------------------
// =/U
// ------------------------------


// ------------------------------
// =PLUGINS. custom made shizzle, yo!
// ------------------------------
(function($) {


    // ------------------------------
    // ScrollSidebar
    // ------------------------------
    $.scrollSidebar = function(element, options) {
        var defaults = {};
        var plugin = this;

        plugin.settings = {};
        var $element = $(element),
            element = element;

    }
    $.fn.scrollSidebar = function(options) {
        return this.each(function() {
            if (undefined == $(this).data('scrollSidebar')) {
                var plugin = new $.scrollSidebar(this, options);
                $(this).data('scrollSidebar', plugin);
            };
        });
    };


    // ------------------------------
    // Sidebar Accordion Menu
    // ------------------------------
    $.sidebarAccordion = function(element, options) {
        var defaults = {};
        var plugin = this;

        plugin.settings = {};
        var $element = $(element),
            element = element;

        plugin.init = function() {
            plugin.settings = $.extend({}, defaults, options);

            var menuCollapsed = localStorage.getItem('collapsed_menu');
            if (menuCollapsed === null) {
                localStorage.setItem('collapsed_menu', "false");
            }
            if (menuCollapsed === "true") {
                $('body').addClass('sidebar-collapsed');
            }

            $('body').on('click', 'ul.acc-menu a', function() {
                var LIs = $(this).closest('ul.acc-menu').children('li');
                $(this).closest('li').addClass('clicked');
                $.each( LIs, function(i) {
                    if( $(LIs[i]).hasClass('clicked') ) {
                        $(LIs[i]).removeClass('clicked');
                        return true;
                    }
                    $(LIs[i]).find('ul.acc-menu:visible').slideToggle({duration: 100});
                    $(LIs[i]).removeClass('open');
                });

                if (!$('body').hasClass('sidebar-collapsed') || $(this).parents('ul.acc-menu').length > 1) {
                    if($(this).siblings('ul.acc-menu:visible').length>0)
                        $(this).closest('li').removeClass('open');
                    else
                        $(this).closest('li').addClass('open');
                        $(this).siblings('ul.acc-menu').slideToggle({duration: 100});
                }
            });

            var targetAnchor;
            $.each ($('ul.acc-menu a'), function() {
                if( this.href == window.location ) {
                    targetAnchor = this;
                    return false;
                };
            });

            var parent = $(targetAnchor).closest('li');
            while(true) {
                parent.addClass('active');
                parent.closest('ul.acc-menu').show().closest('li').addClass('open');
                parent = $(parent).parents('li').eq(0);
                if( $(parent).parents('ul.acc-menu').length <= 0 ) break;
            };

            var liHasUlChild = $('li').filter(function(){
                return $(this).find('ul.acc-menu').length;
            });
            $(liHasUlChild).addClass('hasChild');

        };
        plugin.init();
    }
    $.fn.sidebarAccordion = function(options) {
        return this.each(function() {
            if (undefined === $(this).data('sidebarAccordion')) {
                var plugin = new $.sidebarAccordion(this, options);
                $(this).data('sidebarAccordion', plugin);
            }
        });
    }

})(jQuery);
// ------------------------------
// =/P
// ------------------------------


// ------------------------------
// =DOM Ready
// ------------------------------
$(document).ready(function () {

    enquire.register("screen and (max-width: 767px)", {
        match : function() {
            //small
            if (!($('body').hasClass('sidebar-scroll'))) { //if not already added
                $('.static-sidebar').addClass('scroll-pane');
                $('.static-sidebar > .sidebar').addClass('scroll-content');
            }
        },  
        unmatch : function() {
            //big
            if (!($('body').hasClass('sidebar-scroll'))) { //if not already added
                console.log('here');
                $('.static-sidebar').removeClass('scroll-pane has-scrollbar');
                $('.static-sidebar > .sidebar').removeClass('scroll-content');
                $('.static-sidebar > .sidebar').css('margin-right','');
                $('.static-sidebar > .sidebar').css('right','');
                $('.static-sidebar.scroll-pane').nanoScroller({ stop: true });
            }
        }
    });

    // Add These To support nanoScroller
    if ($('body').hasClass('sidebar-scroll')) {
        $('.static-sidebar').addClass('scroll-pane');
        $('.sidebar').addClass('scroll-content');
    }


    // Scrollbar and reinitting scrollbars
    Utility.initScroller();
    $('.toolbar').on('shown.bs.dropdown', function () {Utility.initScroller();});
    $('.widget').on('shown.bs.collapse', function () {Utility.initScroller();});
    $('.widget').on('hidden.bs.collapse', function () {Utility.initScroller();});



    Utility.sidebar_resizing();

    // ------------------------------
    // Sidebar Accordion
    // ------------------------------
    $('body').sidebarAccordion();


    // ------------------------------
    // Toggling Sidebars
    // ------------------------------
    $('#trigger-sidebar>a').click(function () {
        Utility.toggle_leftbar();
    });

    $('#trigger-fullscreen').click(function () {
       
        Utility.toggle_fullscreen(document.documentElement);
      
    });

    // ------------------------------
    // Megamenu
    // This code will prevent unexpected menu close 
    // when using some components (like accordion, forms, etc)
    // ------------------------------
    $('body').on('click', '.yamm .dropdown-menu, .dropdown-menu-form', function(e) {
      e.stopPropagation()
    })
    
    // -------------------------------
    // For tabs inside dropdowns
    // -------------------------------
    $('.dropdown-menu a[data-toggle="tab"]').click(function (e) {
        e.stopPropagation();
        $(this).tab('show');
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        $(this).closest('.dropdown').removeClass('active');        
    });

    // -------------------------------
    // Small screen
    // -------------------------------
    //enquire.register("screen and (min-width: 768px)", {
    //    match : function() {
    //        $('.static-sidebar').css('transform','');
    //    }
    //});

    // -------------------------------
    // Back to Top button
    // -------------------------------
    $('#back-to-top').click(function () {
        $('body,html').animate({
            scrollTop: 0
        }, 500);
        return false;
    });

    // -------------------------------
    // Panel Collapses
    // -------------------------------
    $('a.panel-collapse').click(function() {
        $(this).children().toggleClass("fa-chevron-down fa-chevron-up");
        $(this).closest(".panel-heading").next().slideToggle({duration: 200});
        $(this).closest(".panel-heading").toggleClass('rounded-bottom');
        return false;
    });

    // -------------------------------
    // Quick Start
    // -------------------------------
    $('#headerbardropdown').click(function() {
        $('#headerbar').css('top',0);
        return false;
    });

    $('#headerbardropdown').click(function(event) {
      $('html').one('click',function() {
        $('#headerbar').css('top','-1000px');
      });

      event.stopPropagation();
    });


    // -------------------------------
    // FireFox Shim
    // FireFox is the *only* browser that doesn't support position:relative for
    // block elements with display set to table-cell, which is needed for the footer.
    // TODO: Replace $.browser with Modernizer.
    // -------------------------------
    if ($.browser.mozilla) {
        $('footer').css('width',$('footer').parent().width());

        $(window).on('resize', function() {
            $('footer').css('width',$('footer').parent().width());
        });
    }

    // ---------------------------------
    // Faux Off-cavas effect on collapse
    // ---------------------------------
    enquire.register("screen and (max-width: 767px)", {
        match : function() {  //smallscreen
            $('body').addClass('sidebar-collapsed');

            // if ($('body').hasClass('sidebar-collapsed')) {
                setWidthtoContent();
            // }
            $(window).on('resize', setWidthtoContent);
        },
        unmatch : function() {  //bigscreen
            $('body').removeClass('sidebar-collapsed');

            $('.static-content').css('width','');
            $(window).off('resize', setWidthtoContent);
        }
    });
        
    function setWidthtoContent() {
        var w = $('#wrapper').innerWidth();
        $('.static-content').css('width',(w)+'px');
    }

    // -------------------------------
    // Search on Top
    // -------------------------------
    $('#trigger-toolbar-search').click( function() {
        $("#toolbar-search").toggleClass('active');
        $("#toolbar-search input.form-control").focus();
        $("header#topnav > .toolbar").toggle();
    });

    $('#toolbar-search .input-group-btn:last-child button').click( function() {
        $("#toolbar-search").toggleClass('active');
        $("header#topnav > .toolbar").toggle();
    });

    enquire.register("screen and (max-width: 767px)", {
        unmatch : function() {  //bigscreen
            $("#toolbar-search").removeClass('active');
            $("header#topnav > .toolbar").show();
        }
    });


});
// ------------------------------
// =/D No more D for you.
// ------------------------------


// ------------------------------
// DOM Loaded
// ------------------------------
$(window).bind("load", function() { 
    Utility.animateContent();
    $('body').scrollSidebar();
    $(window).trigger('resize');
});


$(window).scroll(function(){
    //Utility.sidebar_resizing();
});

$(window).resize(function(){
   // Utility.sidebar_resizing();
});

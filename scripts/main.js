'use strict';

var pagingSystem = function () {
    var subscribers = [];

    function subscribe(fn) {
        subscribers.push(fn);
    }

    function unsubscribe(fn) {
        var fnIndex = subscribers.indexOf(fn);
        if (fnIndex != -1) {
            subscribers.splice(fnIndex, 1);
        }
    }

    function notify(data) {
        for (var i = 0; i < subscribers.length; i++) {
            subscribers[i](data);
        }
    }

    return {
        subscribe: subscribe,
        unsubscribe: unsubscribe,
        notify: notify
    };
}();

window.pagingSystem = pagingSystem;

$(function () {
    FastClick.attach(document.body);
});

$(function () {
    $('.navbar-collapse a').click(function () {
        $('.navbar-collapse').collapse('hide');
    });
});

$(document).ready(function () {
    $('.top-header a, a.arrow-bottom, .simulator-button a').on('click', function (e) {
        var anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $(anchor.attr('href')).offset().top
        }, 1400);
        e.preventDefault();
    });
});

$(document).ready(function () {
    var $menu = $('.top-header');
    $(window).scroll(function () {
        if ($(this).scrollTop() > 70 && $menu.hasClass('default')) {
            $menu.removeClass('default').addClass('fixed');
        } else if ($(this).scrollTop() <= 70 && $menu.hasClass('fixed')) {
            $menu.removeClass('fixed').addClass('default');
        }
    }); //scroll
});

$(function () {
    // Cache selectors
    var lastId,
        topMenu = $('.nav.nav-pills'),
        topMenuHeight = topMenu.outerHeight() + 10,

    // All list items
    menuItems = topMenu.find('a'),

    // Anchors corresponding to menu items
    scrollItems = menuItems.map(function () {
        var item = $($(this).attr('href'));
        if (item.length) {
            return item;
        }
    });
    // Bind to scroll
    $(window).scroll(function () {

        var fromTop = $(this).scrollTop() + topMenuHeight;

        if ($(window).scrollTop() + $(window).outerHeight() > $('.wrapper').outerHeight() - 100) {
            lastId = 'contact';
            window.pagingSystem.notify('contact');
            menuItems.removeClass('selected').filter('[href=\\#contact]').addClass('selected');
            return;
        }

        var cur = scrollItems.map(function () {
            if ($(this).offset().top < fromTop) {
                return this;
            }
        });

        cur = cur[cur.length - 1];
        var id = cur && cur.length ? cur[0].id : 'product-link';
        if (lastId !== id) {
            lastId = id;
            window.pagingSystem.notify(id);
            menuItems.removeClass('selected').filter('[href=\\#' + id + ']').addClass('selected');
        }
    });
});

$(function () {
    var swiper;
    if ($(window).outerWidth() < 767) {
        swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            nextButton: '.swiper-button-next',
            prevButton: '.swiper-button-prev',
            paginationClickable: true,
            spaceBetween: 10,
            centeredSlides: true,
            autoplay: 3000,
            slidesPerView: 2,
            autoplayDisableOnInteraction: false,
            onSlideChangeStart: function onSlideChangeStart(swiper) {
                var index = swiper.activeIndex;

                $('.app-list li').removeClass('selected');
                $($('.app-list li')[index]).addClass('selected');
                if (typeof dataLayer !== 'undefined') {
                    dataLayer.push({ 'event-data': $($('.app-list li a')[index]).html(), 'event': 'screen-select' });
                }
            }
        });
    } else {
        swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            nextButton: '.swiper-button-next',
            prevButton: '.swiper-button-prev',
            paginationClickable: true,
            spaceBetween: 10,
            centeredSlides: true,
            autoplay: 3000,
            autoplayDisableOnInteraction: false,
            onSlideChangeStart: function onSlideChangeStart(swiper) {
                var index = swiper.activeIndex;

                $('.app-list li').removeClass('selected');
                $($('.app-list li')[index]).addClass('selected');
                if (typeof dataLayer !== 'undefined') {
                    dataLayer.push({ 'event-data': $($('.app-list li a')[index]).html(), 'event': 'screen-select' });
                }
            }
        });
    }

    var autoplayInited = false;

    swiper.stopAutoplay();

    window.pagingSystem.subscribe(function (pageId) {
        if (pageId == 'app' && !autoplayInited) {
            swiper.startAutoplay();
            autoplayInited = true;
        }
    });

    $('.swiper-button-next, .swiper-button-prev, .app-list li a').click(function () {
        swiper.stopAutoplay();
    });

    $('.app-list li a').click(function () {
        var li = $(this).parent().parent();
        var appList = $('.app-list li');
        appList.removeClass('selected');
        li.addClass('selected');
        swiper.slideTo(li.index());
    });

    $('#app').on('click', '.android', function () {
        if (typeof dataLayer !== 'undefined') {
            dataLayer.push({ 'event-data': 'android', 'event': 'app-click' });
        }
    });
    $('#app').on('click', '.apple', function () {
        if (typeof dataLayer !== 'undefined') {
            dataLayer.push({ 'event-data': 'iphone', 'event': 'app-click' });
        }
    });
});

//uses classList, setAttribute, and querySelectorAll
//if you want this to work in IE8/9 youll need to polyfill these
(function () {
    var d = document,
        accordionToggles = d.querySelectorAll('.js-accordionTrigger'),
        setAccordionAria,
        switchAccordion;

    var setAriaAttr = function setAriaAttr(el, ariaType, newProperty) {
        el.setAttribute(ariaType, newProperty);
    };
    setAccordionAria = function setAccordionAria(el1, el2, expanded) {
        switch (expanded) {
            case 'true':
                setAriaAttr(el1, 'aria-expanded', 'true');
                setAriaAttr(el2, 'aria-hidden', 'false');
                break;
            case 'false':
                setAriaAttr(el1, 'aria-expanded', 'false');
                setAriaAttr(el2, 'aria-hidden', 'true');
                break;
            default:
                break;
        }
    };

    //function
    switchAccordion = function switchAccordion(e) {
        e.preventDefault();
        var thisAnswer = e.target.parentNode.nextElementSibling;
        var thisQuestion = e.target;
        if (thisAnswer.classList.contains('is-collapsed')) {
            setAccordionAria(thisQuestion, thisAnswer, 'true');
            $('.js-accordionTrigger').removeClass('is-expanded');
            $('.js-accordionTrigger').parent().next().removeClass('is-expanded');
            $('.js-accordionTrigger').addClass('is-collapsed');
            $('.js-accordionTrigger').parent().next().addClass('is-collapsed');
            $(thisQuestion).addClass('is-expanded');
            $(thisAnswer).addClass('is-expanded');
            $(thisQuestion).removeClass('is-collapsed');
            $(thisAnswer).removeClass('is-collapsed');
        } else {
            setAccordionAria(thisQuestion, thisAnswer, 'false');
            $(thisQuestion).addClass('is-collapsed');
            $(thisAnswer).addClass('is-collapsed');
            $(thisQuestion).removeClass('is-expanded');
            $(thisAnswer).removeClass('is-expanded');
        }

        thisAnswer.classList.toggle('animateIn');
    };
    $('.accordion').on('click', '.js-accordionTrigger', switchAccordion);
    accordionToggles[0].click();

    $('.accordion-title').click(function () {
        if (dataLayer) {
            dataLayer.push({ 'event-data': this.innerText, 'event': 'faq-click' });
        }
    });

    $('#open-faq-dialog-mobile').click(function () {
        if (dataLayer) {
            dataLayer.push({ 'event-data': 'faq-agency-list', 'event': 'faq-click' });
        }
    });

    $('.faq-list a').click(function () {
        if (dataLayer) {
            dataLayer.push({ 'event-data': this.innerText, 'event': 'faq-agency-click' });
        }
    });
})();

$(function () {
    var buttonOffset = $('.simulator-button').offset().top + $('.simulator-button').height();
    $(window).scroll(function () {
        var scrollTop = $(window).scrollTop();
        var screenHeight = $(window).outerHeight();
        if (scrollTop + screenHeight - buttonOffset >= 56) {
            $('.simulator-button').addClass('stick');
        } else {
            $('.simulator-button').removeClass('stick');
        }

        if (scrollTop < $('#contact').offset().top - screenHeight / 3) {
            $('.simulator-button').removeClass('fadeOut').addClass('animated fadeIn').css('z-index', '9999');
        } else {
            $('.simulator-button').removeClass('fadeIn').addClass('animated fadeOut').css('z-index', '0');
        }
    });

    $('#faq-modal').on('show.bs.modal', function () {
        return $('.simulator-button').hide();
    });
    $('#faq-modal').on('hidden.bs.modal', function () {
        return $('.simulator-button').show();
    });
});

$(function () {
    // $('.needs-animate').hide();
    var productNumberAnimated = false;
    $(window).scroll(function () {
        var scrollTop = $(window).scrollTop();
        var screenHeight = $(window).outerHeight();

        if (scrollTop > $('#product').offset().top - screenHeight / 1.7) {
            // $('#product .needs-animate').show();
            $('#product .needs-animate._fadeInRight').addClass('fadeInRight').removeClass('_fadeInRight');
            $('#product .needs-animate._fadeIn').addClass('fadeIn').removeClass('_fadeIn');
            $('#product .needs-animate._zoomIn').addClass('zoomIn').removeClass('_zooomIn');
            $('#product .needs-animate').addClass('animated').removeClass('needs-animate');
            if (!productNumberAnimated) {
                productNumberAnimated = true;
                var options = {
                    useEasing: false,
                    useGrouping: true,
                    separator: ',',
                    decimal: '',
                    prefix: '',
                    suffix: ''
                };
                var num = Number($('#product-number').html());
                var counter = new CountUp('product-number', 0, num, 0, 3.5, options);
                counter.start();
            }
        }
        if (scrollTop > $('#simulator').offset().top - screenHeight / 1.5) {
            $('#simulator .needs-animate._fadeInRight').addClass('fadeInRight').removeClass('_fadeInRight');
            $('#simulator .needs-animate._fadeIn').addClass('fadeIn').removeClass('_fadeIn');
            $('#simulator .needs-animate._zoomIn').addClass('zoomIn').removeClass('_zooomIn');
            $('#simulator .needs-animate').addClass('animated').removeClass('needs-animate');
        }
        if (scrollTop > $('#app').offset().top - screenHeight / 1.5) {
            $('#app .needs-animate._fadeInRight').addClass('fadeInRight').removeClass('_fadeInRight');
            $('#app .needs-animate._fadeIn').addClass('fadeIn').removeClass('_fadeIn');
            $('#app .needs-animate._zoomIn').addClass('zoomIn').removeClass('_zooomIn');
            $('#app .needs-animate').addClass('animated').removeClass('needs-animate');
        }
        if (scrollTop > $('#video').offset().top - screenHeight / 1.5) {
            $('#video .needs-animate._fadeInRight').addClass('fadeInRight').removeClass('_fadeInRight');
            $('#video .needs-animate._fadeIn').addClass('fadeIn').removeClass('_fadeIn');
            $('#video .needs-animate._zoomIn').addClass('zoomIn').removeClass('_zooomIn');
            $('#video .needs-animate').addClass('animated').removeClass('needs-animate');
        }
        if (scrollTop > $('#faq').offset().top - screenHeight / 1.25) {
            $('#faq .needs-animate._fadeInRight').addClass('fadeInRight').removeClass('_fadeInRight');
            $('#faq .needs-animate._fadeIn').addClass('fadeIn').removeClass('_fadeIn');
            $('#faq .needs-animate._zoomIn').addClass('zoomIn').removeClass('_zooomIn');
            $('#faq .needs-animate').addClass('animated').removeClass('needs-animate');
        }
        if (scrollTop > $('#contact').offset().top - screenHeight / 1.5) {
            if ($(window).outerWidth() < 995) {
                $('total-animation-car').remove();
                $('.mobile-car-animation').addClass('animate');
                setTimeout(function () {
                    $('.questions input').css('opacity', '1');
                    $('.questions li > span label').css('opacity', '1');
                }, 10);
            } else {
                $('.total-animation-car').addClass('car-div-after-position');
                setTimeout(function () {
                    $('.car-tires-shadow').addClass('animated fadeOut');
                    setTimeout(function () {
                        $('.total-animation-car').remove();
                    }, 2000);
                }, 4000);
                setTimeout(function () {
                    $('.questions input').css('opacity', '1');
                    $('.questions li > span label').css('opacity', '1');
                }, 10);
            }
        }
    });

    // $('.needs-animate').hide();
    // var text2Animated = false;
    // $(window).scroll(() => {
    //     if ($(window).scrollTop() < $('.road-text').offset().top && text2Animated) return;
    //     text2Animated = true;

    //     $('.needs-animate').show();
    //     $('.needs-animate').addClass('animated').removeClass('needs-animate');
    // });
});

$(function () {
    window.pagingSystem.subscribe(function (pageId) {
        if (pageId == 'product') {
            $('.animated-1').show().addClass('animated hinge');
        }
    });
});
$(function () {
    var swiper = new Swiper('.swiper-container-2', {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: 3000,
        autoplayDisableOnInteraction: false,
        effect: 'fade'

    });
});

function showNoLandscape() {
    $('.no-landscape').removeClass('hidden');
    if (window.orientation != 0) {
        $('.no-landscape').removeClass('hidden');
    } else {
        $('.no-landscape').addClass('hidden');
    }
}
if (typeof window.orientation == 'number') {
    $(window).on('orientationchange', showNoLandscape);
    showNoLandscape();
}

$(function () {
    $(window).trigger('scroll');
    setTimeout(function () {
        $(window).trigger('scroll');
    }, 500);
    setTimeout(function () {
        $(window).trigger('scroll');
    }, 1500);
});

$(function () {
    var onLeavePopup = ouibounce($('.pop-up-exit')[0], {
        timer: window.popupTimer,
        cookieExpire: window.popupCookieExpire,
        cookieName: 'leavePopupViewed'
    });
    $('.pop-up-exit .close-button, .pop-up-exit .exit-bg').click(function () {
        $('.pop-up-exit').hide();
    });
});
//# sourceMappingURL=main.js.map

'use strict';

(function () {
    var inited = false;

    function setPagesHeight() {
        var isChromium = window.chrome;
        var winNav = window.navigator;
        var vendorName = winNav.vendor;
        var isOpera = winNav.userAgent.indexOf('OPR') > -1;
        var isIEedge = winNav.userAgent.indexOf('Edge') > -1;

        var isChrome = isChromium !== null && isChromium !== undefined && vendorName === 'Google Inc.' && isOpera == false && isIEedge == false;

        if ((isChromium || isChrome) && $(window).outerWidth() < 992) {
            if (inited) return;else {
                inited = true;
                var width = $(window).outerWidth();
                if (width >= 319 && width <= 479) {
                    $('#intro').css('height', $(window).height() * 0.9 + 'px');
                    $('.content-box').css('height', $(window).height() + 'px');
                    $('#faq.content-box').css('height', 'auto');
                    $('#app.content-box').css('height', $(window).height() + 'px');
                    $('.left.full-height').css('height', $(window).height() + 'px');
                } else if (width >= 480 && width <= 768) {
                    $('#intro').css('height', $(window).height() * 0.9 + 'px');
                    $('.content-box').css('height', $(window).height() + 'px');
                    $('#faq.content-box').css('height', 'auto');
                    $('#app.content-box').css('height', $(window).height() + 'px');
                    $('.left.full-height').css('height', $(window).height() + 'px');
                } else if (width >= 769 && width <= 991) {
                    $('#intro').css('height', $(window).height() * 0.9 + 'px');
                    $('.content-box').css('height', $(window).height() - 91 + 'px');
                    $('#faq.content-box').css('height', 'auto');
                    $('#app.content-box').css('height', $(window).height() - 91 + 'px');
                    $('.left.full-height').css('height', $(window).height() - 91 + 'px');
                } else {
                    $('#intro').css('height', $(window).height() * 0.9 + 'px');
                    $('.content-box').css('height', $(window).height() - 79 + 'px');
                    $('#faq.content-box').css('height', 'auto');
                    $('#app.content-box').css('height', $(window).height() - 79 + 'px');
                    $('.left.full-height').css('height', $(window).height() - 79 + 'px');
                }
            }
        } else {
            var width = $(window).outerWidth();
            if (width >= 319 && width <= 479) {
                $('#intro').css('height', $(window).height() * 0.9 + 'px');
                $('.content-box').css('height', $(window).height() + 'px');
                $('#faq.content-box').css('height', 'auto');
                $('#app.content-box').css('height', $(window).height() + 'px');
                $('.left.full-height').css('height', $(window).height() + 'px');
            } else if (width >= 480 && width <= 768) {
                $('#intro').css('height', $(window).height() * 0.9 + 'px');
                $('.content-box').css('height', $(window).height() + 'px');
                $('#faq.content-box').css('height', 'auto');
                $('#app.content-box').css('height', $(window).height() + 'px');
                $('.left.full-height').css('height', $(window).height() + 'px');
            } else if (width >= 769 && width <= 991) {
                $('#intro').css('height', $(window).height() * 0.9 + 'px');
                $('.content-box').css('height', $(window).height() - 91 + 'px');
                $('#faq.content-box').css('height', 'auto');
                $('#app.content-box').css('height', $(window).height() - 91 + 'px');
                $('.left.full-height').css('height', $(window).height() - 91 + 'px');
            } else {
                $('#intro').css('height', $(window).height() * 0.9 + 'px');
                $('.content-box').css('height', $(window).height() - 79 + 'px');
                $('#faq.content-box').css('height', 'auto');
                $('#app.content-box').css('height', $(window).height() - 79 + 'px');
                $('.left.full-height').css('height', $(window).height() - 79 + 'px');
            }
        }
    };

    setPagesHeight();
    $(window).resize(setPagesHeight);
})();
//# sourceMappingURL=androidFix.js.map

'use strict';

var slider;

jQuery(document).ready(function ($) {
    var redCar = $('.car-average-animation .red-car'),
        scrollMin = $('.car-average-animation .red-car').attr('data-scroll-min'),
        counter = $('.car-average-animation .number'),
        backgrounds = $('.car-average-animation .background'),
        greenLine = $('.car-average-animation .green-line'),
        progress = $('.car-average-animation .ui-slider-handle'),
        counterVal = window.sliderStepSums[0],
        animated = false;

    var steps = [{
        minWidth: 0,
        maxWidth: 767,
        data: [{ line: '0vw', car: '0vw' }, { line: '200px', car: '100px' }, { line: '392px', car: '293px' }, { line: '587px', car: '489px' }]
    }, {
        minWidth: 768,
        maxWidth: 991,
        data: [{ line: '0vw', car: '0vw' }, { line: '236px', car: '129px' }, { line: '467px', car: '359px' }, { line: '700px', car: '589px' }]
    }, {
        minWidth: 992,
        maxWidth: 1199,
        data: [{ line: '0vw', car: '0vw' }, { line: '346px', car: '199px' }, { line: '685px', car: '537px' }, { line: '943px', car: '800px' }]
    }, {
        minWidth: 1200,
        maxWidth: 99999,
        data: [{ line: '0vw', car: '0vw' }, { line: '346px', car: '199px' }, { line: '685px', car: '537px' }, { line: '1027px', car: '873px' }]
    }, {
        minWidth: 1366,
        maxWidth: 1850,
        minHeight: 579,
        maxHeight: 767,
        data: [{ line: '0vw', car: '0vw' }, { line: '245px', car: '293px' }, { line: '484px', car: '532px' }, { line: '726px', car: '772px' }]
    }];

    function setScale() {
        var width = $(window).outerWidth();
        var height = $(window).outerHeight();
        if (width < 640 && width >= 400) {
            var scale = $(window).outerWidth() / 640;
            var realScale = scale * (582 / 640);
            var translate = -((1 - scale) * 640) / (2.7068 * Math.log(width) - 15.041);
            $('.car-average-animation-1').css('transform', 'scale(' + realScale + ') translate(' + translate + 'px, 0px)');
        } else if (width < 400 && width >= 360) {
            var scale = $(window).outerWidth() / 640;
            var realScale = scale * (582 / 640);
            var translate = -((1 - scale) * 640) / (0.0062 * width - 1.1344);
            $('.car-average-animation-1').css('transform', 'scale(' + realScale + ') translate(' + translate + 'px, 0px)');
        } else if (width < 360 && width >= 320) {
            var scale = $(window).outerWidth() / 640;
            var realScale = scale * (582 / 640);
            var translate = -((1 - scale) * 640) / (0.00665 * width - 1.1344);
            $('.car-average-animation-1').css('transform', 'scale(' + realScale + ') translate(' + translate + 'px, 0px)');
        } else if (height > 579 && width >= 1366 && height <= 768) {
            var scale = $('#simulator').outerHeight() / 500;
            $('.car-average-animation').css('transform', 'scale(' + scale + ')');
        }
    }

    function getCarStep(id) {
        var width = $(window).outerWidth();
        var height = $(window).outerHeight();
        var currentMedia;
        var i = steps.length;
        while (i--) {
            if (width >= steps[i].minWidth && width <= steps[i].maxWidth) {
                if (!steps[i].minHeight && !steps[i].maxHeight || height >= steps[i].minHeight && height <= steps[i].maxHeight) {
                    currentMedia = steps[i];
                    break;
                }
            }
        }
        // for (var i in steps) {
        //     console.log(steps[i].minWidth, steps[i].maxWidth, steps[i].minHeight, steps[i].maxHeight);
        //     console.log(width >= steps[i].minWidth && width <= steps[i].maxWidth);
        //     console.log((!steps[i].minHeight && !steps[i].maxHeight));
        //     console.log((height >= steps[i].minHeight && height <= steps[i].maxHeight));
        //     if (width >= steps[i].minWidth && width <= steps[i].maxWidth) {
        //         if((!steps[i].minHeight && !steps[i].maxHeight) || (height >= steps[i].minHeight && height <= steps[i].maxHeight)) currentMedia = steps[i];
        //         break;
        //     }
        // }

        return currentMedia.data[id].car;
    }

    function getLineStep(id) {
        var width = $(window).outerWidth();
        var height = $(window).outerHeight();
        var currentMedia;
        var i = steps.length;
        while (i--) {
            if (width >= steps[i].minWidth && width <= steps[i].maxWidth) {
                if (!steps[i].minHeight && !steps[i].maxHeight || height >= steps[i].minHeight && height <= steps[i].maxHeight) {
                    currentMedia = steps[i];
                    break;
                }
            }
        }
        // for (var i in steps) {
        //     if (width >= steps[i].minWidth && width <= steps[i].maxWidth) {
        //         if((!steps[i].minHeight && !steps[i].maxHeight) || (height >= steps[i].minHeight && height <= steps[i].maxHeight)) currentMedia = steps[i];
        //         break;
        //     }
        // }

        return currentMedia.data[id].line;
    }

    var sliderSteps = [0, 33, 66, 100];

    function animateFunc() {
        // var slideStep = $('.progress-bar').slider('value');
        var slideStep = Number(slider.get());
        var value = sliderSteps[slideStep];
        redCar.animate({
            left: getCarStep(slideStep)
        }, 1200);
        greenLine.animate({
            width: getLineStep(slideStep)
        }, 1200);
        if (value == 33) {
            animateCounter(window.sliderStepSums[1]);
        } else if (value == 66) {
            animateCounter(window.sliderStepSums[2]);
        } else if (value == 100) {
            animateCounter(window.sliderStepSums[3]);
        }
    }

    // $(window).resize(animateFunc);
    $(window).resize(setScale);

    var graphInited = false;
    setTimeout(function () {
        return setScale();
    }, 500);
    $(window).scroll(function () {
        if ($(window).scrollTop() < $('.car-average-animation').offset().top - $(window).height() && graphInited) return;
        graphInited = true;

        if (!animated && $(window).scrollTop() > scrollMin) {
            animated = true;
            redCar.animate({
                left: getCarStep(1)
            }, 1200, 'linear', function () {
                $('.car-average-animation .progress-bar').fadeIn(1200);
                $('.car-average-animation .shabby').fadeIn(1200);
            });
            greenLine.animate({
                width: getLineStep(1)
            }, 1200);
            progress.animate({
                left: '100%'
            }, 1200);

            var k = 0;
            var h = setInterval(function () {
                $(backgrounds[k++]).animate({
                    height: '0px'
                }, 1600);
                if (k >= backgrounds.length) {
                    clearInterval(h);
                }
            }, 125);

            animateCounter(window.sliderStepSums[1]);

            // var sliderSteps = [0, 33, 66, 100];

            if ($('.progress-bar').length) {
                // $('.progress-bar').slider({
                //     value: sliderSteps.length - 1,
                //     min: 0,
                //     max: sliderSteps.length - 1,
                //     range: 'min',
                //     change: animateFunc,
                //     slide: function (event, ui) {
                //         if (ui.value == 0) {
                //             return false;
                //         }
                //     }
                // });

                slider = noUiSlider.create($('.progress-bar')[0], {
                    start: 1,
                    step: 1,
                    connect: 'lower',
                    margin: 1,
                    range: {
                        'min': [0],
                        'max': [sliderSteps.length - 1]
                    }
                });

                slider.on('change', function () {
                    var val = slider.get();
                    if (val == 0) {
                        slider.set(1);
                        if (typeof dataLayer !== 'undefined') {
                            dataLayer.push({ 'event-data': 33.3 * slider.get() + '%', 'event': 'interactive-button' });
                        }
                        var counterWithComma = counter.html();
                        var counterState = Number(counterWithComma.substring(0, 1) + counterWithComma.substring(2, counterWithComma.length));
                        if (counterState != window.sliderStepSums[1]) animateFunc();
                    } else animateFunc();
                });
            }
        }
    });

    var options = {
        useEasing: false,
        useGrouping: true,
        separator: ',',
        decimal: '',
        prefix: '',
        suffix: ''
    };
    var counter = new CountUp('simulator-number', 0, 0, 0, 1.5, options);
    counter.start();
    var animateCounter = function animateCounter(count) {
        counter.update(count);
    };
});
//# sourceMappingURL=car-average.js.map

'use strict';

var game_entry;
var game_shortcut;
var game_start_button;
var game_form;
var game_player_name;
var game_preloader;
var preload_marker;
var preload_bar;
var preload_width;
var hud;
var gl_canvas;
var onyx_bg;
var replay_button;
var game_over_screen;
var blue_road;
var road_path;
var scroll_car;
var scroll_position;
var last_scroll_position = 0;
var road_top;
var road_start;
var road_end;
var info_points = [];
var lerps = [0, 0, 0, 0, 0, 0, 0, 0];
var sharing;
var widthСorrection = 0;

window.addEventListener('load', info_graphic_init, false);

// requestAnimationFrame fix for IE9
(function () {
	var lastTime = 0;
	var vendors = ['webkit', 'moz'];
	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback, element) {
		var currTime = new Date().getTime();
		var timeToCall = Math.max(0, 16 - (currTime - lastTime));
		var id = window.setTimeout(function () {
			callback(currTime + timeToCall);
		}, timeToCall);
		lastTime = currTime + timeToCall;
		return id;
	};

	if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) {
		clearTimeout(id);
	};
})();

var InfoIcon = function InfoIcon() {
	this.icon;
	this.header;
	this.text;
};

function info_graphic_init() {
	game_entry = document.querySelector('.game-entry');
	// game_shortcut = document.querySelector('.game-shortcut');
	// game_shortcut.addEventListener('click', on_game_shortcut);
	game_player_name = document.querySelector('#game-player-name');

	if (game_player_name !== null) {
		game_player_name.addEventListener('keypress', function (e) {
			if (e.keyCode == 13) {
				on_game_start_press();
			}
		});
	}
	game_start_button = document.querySelector('.game-start-button');
	if (game_start_button !== null) {
		game_start_button.addEventListener('click', on_game_start_press);
	}
	game_form = document.querySelector('.game-form');
	game_preloader = document.querySelector('.game-preloader');
	preload_marker = document.querySelector('.preload-marker');
	preload_bar = document.querySelector('.preload-bar');
	game_over_screen = document.querySelector('.game-over-screen');
	onyx_bg = document.querySelector('.onyx');
	hud = document.querySelector('.hud');
	replay_button = document.querySelector('.play-again-button');
	//replay_button.addEventListener('click', on_replay);

	sharing = document.querySelector('.sharing');

	blue_road = document.querySelector('.blue-road');

	var w = document.documentElement.clientWidth;
	if (w > 978) {
		road_path = document.getElementById('road-path-target');
	}
	if (w < 978) {
		road_path = document.getElementById('road-path-target-1');
	}
	if (w < 768) {
		road_path = document.getElementById('road-path-target-2');
		widthСorrection = 300;
	}

	scroll_car = document.querySelector('.car');

	var info_elements = document.querySelectorAll('.info-point');

	var n = info_elements.length;
	for (var i = 0; i < n; ++i) {
		var element = info_elements[i];
		var icon = new InfoIcon();
		icon.icon = element.querySelector('.info-icon');
		icon.header = element.querySelector('h3');
		icon.text = element.querySelector('p');

		icon.icon.style.opacity = 0;
		icon.icon.style.transform = 'scale(0,0)';
		icon.header.style.opacity = 0;
		icon.text.style.opacity = 0;

		info_points.push(icon);
	}
	window.addEventListener('scroll', on_scroll, false);

	road_start = road_path.getPointAtLength(0);
	road_end = road_start + road_path.getTotalLength();

	preload_width = 0;
	game_over_screen = document.querySelector('.game-over-screen');

	var win_width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	// if (win_width < 1000) {
	// 	game_entry.classList.add('inactive');
	// }


	requestAnimationFrame(info_upA);
}

function on_game_start_press() {
	game_start_button.removeEventListener('click', on_game_start_press);
	game_form.classList.remove('visible');
	game_preloader.classList.add('visible');

	blue_road.classList.remove('visible');
}

function load_progress(percent) {
	preload_marker.style.width = percent + '%';
}

function load_complete() {
	preload_marker.style.width = 100 + '%';
	game_preloader.classList.remove('visible');
	onyx_bg.classList.add('active');
	game_entry.classList.add('playing');
	gl_canvas = document.querySelector('.glcanvas');
	gl_canvas.classList.add('active');
	hud.classList.add('visible');
	game_init();
}

function on_game_shortcut() {
	window.scrollTo(0, 5000);
}

function on_replay() {
	onyx_bg.classList.add('active');
	game_entry.classList.add('playing');
	gl_canvas.classList.add('active');
	hud.classList.add('visible');
	blue_road.classList.remove('visible');
	game_over_screen.classList.remove('visible');
	sharing.classList.remove('visible');
	game_retry();
}

function on_scroll(e) {
	if (typeof window.scrollY !== 'undefined') {
		scroll_position = window.scrollY + widthСorrection;
	} else {
		scroll_position = document.documentElement.scrollTop;
	}
}

function info_upA(t) {
	info_update();
	requestAnimationFrame(info_upB);
}

function info_upB(t) {
	info_update();
	requestAnimationFrame(info_upA);
}

function info_update() {
	if (scroll_position > 0) {
		var t = 0.5;
		var scroll = (1 - t) * last_scroll_position + t * scroll_position;
		last_scroll_position = scroll_position;

		if (scroll < 0) scroll = 0;

		if (scroll > road_end) scroll = road_end;
		var start = road_start;

		var pa = road_path.getPointAtLength(scroll);
		var pb = road_path.getPointAtLength(scroll + 10);

		var vx = pb.x - pa.x;
		var vy = pb.y - pa.y;
		var angle = Math.atan2(vy, vx) * 57.2957795;

		var dx = pb.x - start.x + 64;
		var dy = pb.y - start.y;

		update_transform(scroll_car, 1, 1, dx, dy, -angle - 180);

		var start = 30;
		var end = 950;
		for (var i = 0; i < 8; ++i) {
			var t = clamp((scroll - start) / (end - start), 0, 1);
			start += 450;
			end += 450;

			// info_points[i].icon.style.opacity = t;
			// info_points[i].icon.style.transform = "scale(" + t + "," + t + ")";

			// info_points[i].header.style.opacity = cubic_bezier(0, 0, 0.5, 1, t);
			// info_points[i].text.style.opacity = cubic_bezier(0, 0, 0, 1, t);
		}
	}
}

function clamp(val, min, max) {
	if (val < min) return min;else if (val > max) return max;
	return val;
}

function cubic_bezier(a, b, c, d, t) {
	var cy = 3 * (b - a);
	var by = 3 * (c - b) - cy;
	var ay = d - a - cy - by;
	var tt = t * t;
	var ttt = tt * t;
	var r = ay * ttt + by * tt + cy * t + a;
	return r;
}

function update_transform(ent, sx, sy, tx, ty, r) {
	//console.log(Consts.DEG2RAD);
	var ang = r * 0.017453292519943295; //Consts.DEG2RAD;
	var a = Math.cos(ang); // * sx;
	var b = -Math.sin(ang);
	var c = tx;
	var d = Math.sin(ang);
	var e = Math.cos(ang); // * sy;
	var f = ty;

	var matrix = 'matrix(' + a + ',' + b + ',' + d + ',' + e + ',' + c + ',' + f + ')';

	ent.style['webkitTransform'] = matrix;
	ent.style.MozTransform = matrix;
	ent.style['oTransform'] = matrix;
	ent.style['msTransform'] = matrix;
	ent.style['transform'] = matrix;
}

window.addEventListener('resize', function () {
	var w = document.documentElement.clientWidth;
	var h = document.documentElement.clientHeight;
	$('.screen-params').html(w + ' and ' + h);
	//choose car position
	if (w >= 1200) {
		$('.car').css('right', '31%');
	}
	if (w >= 978 && w <= 1200) {
		$('.car').css('right', '31%');
	}
	if (w <= 978) {
		$('.car').css('right', '-2%');
	}
	if (w < 768) {
		$('.car').css('right', '-20%');
	}
	if (w <= 780 && w >= 740) {
		$('.car').css('right', '-2%');
	}
	if (w <= 360) {
		$('.car').css('right', '-20%');
	}

	//choose path
	if (w >= 978) {
		road_path = document.getElementById('road-path-target');
	}
	if (w <= 978) {
		road_path = document.getElementById('road-path-target-1');
	}
	if (w < 768) {
		road_path = document.getElementById('road-path-target-2');
		widthСorrection = 300;
	}
	if (w <= 360) {
		$('.car').css('right', '-20%');
	}
}, false);

//parallax for clouds
$(document).ready(function () {

	//adaptive screen
	var w = document.documentElement.clientWidth;
	var h = document.documentElement.clientHeight;
	$('.screen-params').html(w + ' and ' + h);

	if (w >= 1200) {
		$('.car').css('right', '31%');
	}
	if (w >= 978 && w <= 1200) {
		$('.car').css('right', '31%');
	}
	if (w <= 978) {
		$('.car').css('right', '-2%');
	}
	if (w <= 770) {
		$('.car').css('right', '-20%');
	}
	if (w <= 780 && w >= 740) {
		$('.car').css('right', '-2%');
	}
	if (w <= 360) {
		$('.car').css('right', '-20%');
	}

	var movementStrength = 10;
	var height = movementStrength / $(window).height();
	var width = movementStrength / $(window).width();
	$('html').mousemove(function (e) {
		var pageX = e.pageX - $(window).width() / 2;
		var pageY = e.pageY - $(window).height() / 2;
		var newvalueX = width * pageX * -1;
		var newvalueY = height * pageY * -1;
		$('.cloud-1').css('background-position', newvalueX + 'px ' + newvalueY + 'px');
		$('.cloud-2').css('background-position', newvalueX + 'px ' + newvalueY + 'px');
		$('.cloud-3').css('background-position', newvalueX + 'px ' + newvalueY + 'px');
	});
});
//# sourceMappingURL=car-animate.js.map

'use strict';

(function (window) {

	'use strict';

	// class helper functions from bonzo https://github.com/ded/bonzo

	function classReg(className) {
		return new RegExp('(^|\\s+)' + className + '(\\s+|$)');
	}

	// classList support for class management
	// altho to be fair, the api sucks because it won't accept multiple classes at once
	var hasClass, addClass, removeClass;

	if ('classList' in document.documentElement) {
		hasClass = function hasClass(elem, c) {
			return elem.classList.contains(c);
		};
		addClass = function addClass(elem, c) {
			elem.classList.add(c);
		};
		removeClass = function removeClass(elem, c) {
			elem.classList.remove(c);
		};
	} else {
		hasClass = function hasClass(elem, c) {
			return classReg(c).test(elem.className);
		};
		addClass = function addClass(elem, c) {
			if (!hasClass(elem, c)) {
				elem.className = elem.className + ' ' + c;
			}
		};
		removeClass = function removeClass(elem, c) {
			elem.className = elem.className.replace(classReg(c), ' ');
		};
	}

	function toggleClass(elem, c) {
		var fn = hasClass(elem, c) ? removeClass : addClass;
		fn(elem, c);
	}

	var classie = {
		// full names
		hasClass: hasClass,
		addClass: addClass,
		removeClass: removeClass,
		toggleClass: toggleClass,
		// short names
		has: hasClass,
		add: addClass,
		remove: removeClass,
		toggle: toggleClass
	};

	// transport
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(classie);
	} else {
		// browser global
		window.classie = classie;
	}
})(window);

/**
 * stepsForm.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2014, Codrops
 * http://www.codrops.com
 */
;(function (window) {

	'use strict';

	var transEndEventNames = {
		'WebkitTransition': 'webkitTransitionEnd',
		'MozTransition': 'transitionend',
		'OTransition': 'oTransitionEnd',
		'msTransition': 'MSTransitionEnd',
		'transition': 'transitionend'
	},
	    transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
	    support = { transitions: Modernizr.csstransitions };

	function extend(a, b) {
		for (var key in b) {
			if (b.hasOwnProperty(key)) {
				a[key] = b[key];
			}
		}
		return a;
	}

	function stepsForm(el, options) {
		this.el = el;
		this.options = extend({}, this.options);
		extend(this.options, options);
		this._init();
	}

	stepsForm.prototype.options = {
		onSubmit: function onSubmit() {
			return false;
		},
		onStepChange: function onStepChange() {
			return false;
		}
	};

	stepsForm.prototype._init = function () {
		// current question
		this.current = 0;

		// questions
		this.questions = [].slice.call(this.el.querySelectorAll('ol.questions > li'));
		// total questions
		this.questionsCount = this.questions.length;
		// show first question
		classie.addClass(this.questions[0], 'current');

		// next question control
		this.ctrlNext = this.el.querySelector('button.next');

		// progress bar
		this.progress = this.el.querySelector('div.progress');

		// question number status
		this.questionStatus = this.el.querySelector('span.number');
		// current question placeholder
		this.currentNum = this.questionStatus.querySelector('span.number-current');
		this.currentNum.innerHTML = Number(this.current + 1);
		// total questions placeholder
		this.totalQuestionNum = this.questionStatus.querySelector('span.number-total');
		this.totalQuestionNum.innerHTML = this.questionsCount;

		// error message
		this.error = this.el.querySelector('span.error-message');

		// init events
		this._initEvents();
	};

	stepsForm.prototype._initEvents = function () {
		var self = this,

		// first input
		firstElInput = this.questions[this.current].querySelector('input'),

		// focus
		onFocusStartFn = function onFocusStartFn() {
			firstElInput.removeEventListener('focus', onFocusStartFn);
			classie.addClass(self.ctrlNext, 'show');
		};

		// show the next question control first time the input gets focused
		firstElInput.addEventListener('focus', onFocusStartFn);

		// show next question
		this.ctrlNext.addEventListener('click', function (ev) {
			ev.preventDefault();
			self._nextQuestion();
		});

		$(document).on('keydown', '#q1, #q2, #q3, #q4, #q5, #q2-1, #q2-2, #q2-3, #q2-4, #q2-5', function (ev) {
			var keyCode = ev.keyCode || ev.which;
			// enter
			if (keyCode === 13) {
				ev.preventDefault();
				self._nextQuestion();
			}
		});

		// disable tab
		$(document).on('keydown', '#q1, #q2, #q3, #q4, #q5, #q2-1, #q2-2, #q2-3, #q2-4, #q2-5', function (ev) {
			var keyCode = ev.keyCode || ev.which;
			// tab
			if (keyCode === 9) {
				ev.preventDefault();
			}
		});
	};

	stepsForm.prototype._nextQuestion = function () {
		if (!this._validade()) {
			return false;
		}

		// check if form is filled
		if (this.current === this.questionsCount - 1) {
			this.isFilled = true;
		}

		// clear any previous error messages
		this._clearError();

		// current question
		var currentQuestion = this.questions[this.current];

		// increment current question iterator
		++this.current;

		// update progress bar
		this._progress();

		if (!this.isFilled) {
			// change the current question number/status
			this._updateQuestionNumber();

			// add class "show-next" to form element (start animations)
			classie.addClass(this.el, 'show-next');

			// remove class "current" from current question and add it to the next one
			// current question
			var nextQuestion = this.questions[this.current];
			classie.removeClass(currentQuestion, 'current');
			classie.addClass(nextQuestion, 'current');
			this.options.onStepChange(this.current + 1);
		}

		// after animation ends, remove class "show-next" from form element and change current question placeholder
		var self = this,
		    onEndTransitionFn = function onEndTransitionFn(ev) {
			if (support.transitions) {
				this.removeEventListener(transEndEventName, onEndTransitionFn);
			}
			if (self.isFilled) {
				self._submit();
			} else {
				classie.removeClass(self.el, 'show-next');
				self.currentNum.innerHTML = self.nextQuestionNum.innerHTML;
				self.questionStatus.removeChild(self.nextQuestionNum);
				// force the focus on the next input
				nextQuestion.querySelector('input').focus();
			}
		};

		if (support.transitions) {
			this.progress.addEventListener(transEndEventName, onEndTransitionFn);
		} else {
			onEndTransitionFn();
		}
	};

	// updates the progress bar by setting its width
	stepsForm.prototype._progress = function () {
		this.progress.style.width = this.current * (100 / this.questionsCount) + '%';
	};

	// changes the current question number
	stepsForm.prototype._updateQuestionNumber = function () {
		// first, create next question number placeholder
		this.nextQuestionNum = document.createElement('span');
		this.nextQuestionNum.className = 'number-next';
		this.nextQuestionNum.innerHTML = Number(this.current + 1);
		// insert it in the DOM
		this.questionStatus.appendChild(this.nextQuestionNum);
	};

	// submits the form
	stepsForm.prototype._submit = function () {
		this.options.onSubmit(this.el);
	};

	// TODO (next version..)
	// the validation function
	stepsForm.prototype._validade = function () {
		// current question´s input
		var input = $($(this.el).find('input')[this.current]).val().trim();
		switch (this.current) {
			case 0:
				var regex = /^[a-zA-Zא-ת][a-zA-Zא-ת ]+$/;
				if (input && regex.test(input)) return true;else {
					$(this.error).html('יש להקליד את שמך');
					$(this.error).addClass('show');
					return false;
				}
			case 1:
				var regex = /^[0-9\-]+$/;
				if (!regex.test(input)) {
					$(this.error).html('יש להקליד מספר בלבד');
					$(this.error).addClass('show');
					return false;
				} else if (input.replace(new RegExp('-', 'g'), '').length < 7) {
					$(this.error).html('יש להקליד מס\' טלפון תקני');
					$(this.error).addClass('show');
					return false;
				} else if (input.replace(new RegExp('-', 'g'), '').length > 10) {
					$(this.error).html('ניתן להקליד מקסימום 10 תווים');
					$(this.error).addClass('show');
					return false;
				} else if (input[0] == '0' && (input[1] == '2' || input[1] == '3' || input[1] == '4' || input[1] == '5' || input[1] == '7')) {
					return true;
				} else {
					$(this.error).html('יש להקליד מס\' טלפון תקני');
					$(this.error).addClass('show');
					return false;
				}
			case 2:
				var regex = /^[0-9]+$/;
				if (!input) {
					$(this.error).html('יש להקליד גיל תקין');
					$(this.error).addClass('show');
					return false;
				}
				if (!regex.test(input)) {
					$(this.error).html('יש להקליד מספר בלבד');
					$(this.error).addClass('show');
					return false;
				} else if (parseInt(input) < 17 || parseInt(input) > 23) {
					$(this.error).html('נהג צעיר הוא בגילאי 17-23');
					$(this.error).addClass('show');
					return false;
				} else return true;
			case 3:
				if (!input) {
					$(this.error).html('יש להקליד מספר בלבד');
					$(this.error).addClass('show');
					return false;
				}
				if (_.findIndex(manufacturers, function (item) {
					return item == input;
				}) != -1) return true;else {
					$(this.error).html('יש לבחור יצרן מהרשימה בלבד');
					$(this.error).addClass('show');
					return false;
				}
			case 4:
				if (!input) {
					$(this.error).html('יש להקליד מספר בלבד');
					$(this.error).addClass('show');
					return false;
				}
				var manufacturer = $($('#theForm input')[3]).val();
				if (_.findIndex(models[manufacturer], function (item) {
					return item == input;
				}) != -1) return true;else {
					$(this.error).html('יש לבחור יצרן מהרשימה בלבד');
					$(this.error).addClass('show');
					return false;
				}
		}
		// if (input === '') {
		// 	this._showError('EMPTYSTR');
		// 	return false;
		// }

		// return true;
	};

	// TODO (next version..)
	stepsForm.prototype._showError = function (err) {
		var message = '';
		switch (err) {
			case 'EMPTYSTR':
				message = 'יש למלא את השדה';
				break;
			case 'INVALIDEMAIL':
				message = 'Please fill a valid email address';
				break;
			// ...
		};
		this.error.innerHTML = message;
		classie.addClass(this.error, 'show');
	};

	// clears/hides the current error message
	stepsForm.prototype._clearError = function () {
		classie.removeClass(this.error, 'show');
	};

	// add to global namespace
	window.stepsForm = stepsForm;
})(window);
//# sourceMappingURL=stepsForm.js.map

'use strict';

// var videoId1 = 'BsekcY04xvQ';
// var videoId2 = 'hepFlpCdTgU';

$(function () {
	$('#video-close-1').hide();
	$('#video-close-2').hide();

	if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
		$('#video-play-1, #video-play-2').addClass('onlyIOS');
	}

	$('#video-play-1').click(function () {
		$('#video-close-1').show();
		$('#video-play-1').hide();
		$('#video-1').show();
		// $('#title-video-1').css('visibility', 'hidden');
	});
	$('#video-play-2').click(function () {
		$('#video-close-2').show();
		$('#video-play-2').hide();
		$('#video-2').show();
		$('.preloader-2').hide();
	});
	$('#video-close-1').click(function () {
		$('#video-close-1').hide();
		$('#video-play-1').show();
		$('#video-1').hide();
		// $('#title-video-1').css('visibility', 'visible');
	});
	$('#video-close-2').click(function () {
		$('#video-close-2').hide();
		$('#video-play-2').show();
		$('#video-2').hide();
		$('.preloader-2').show();
	});

	var player;
	var player2;

	window.onYouTubeIframeAPIReady = function () {
		player = new YT.Player('player', {
			height: '100%',
			width: '100%',
			videoId: window.videoId1,
			events: {
				// 'onReady': onPlayerReady,
				'onStateChange': onPlayerStateChange
			}
		});

		player2 = new YT.Player('player2', {
			height: '100%',
			width: '100%',
			videoId: window.videoId2,
			events: {
				// 'onReady': onPlayerReady2,
				'onStateChange': onPlayerStateChange2
			}
		});
	};

	$('#video-play-1').click(function () {
		if (player && player.playVideo) player.playVideo();else setTimeout(function () {
			if (player && player.playVideo) player.playVideo();
		}, 500);
	});

	$('#video-play-2').click(function () {
		if (player2 && player2.playVideo) player2.playVideo();else setTimeout(function () {
			if (player2 && player2.playVideo) player2.playVideo();
		}, 500);
	});
	// function onYouTubeIframeAPIReady() {
	// 	player = new YT.Player('player', {
	// 		height: '100%',
	// 		width: '100%',
	// 		videoId: 'BsekcY04xvQ',
	// 		events: {
	//             'onReady': onPlayerReady,
	//             'onStateChange': onPlayerStateChange
	// 		}
	// 	});
	// 	player2 = new YT.Player('player2', {
	// 		height: '100%',
	// 		width: '100%',
	// 		videoId: 'e0esjwrjRQU',
	// 		events: {
	//             'onReady': onPlayerReady2,
	//             'onStateChange': onPlayerStateChange2
	// 		}
	// 	});
	// }

	function onPlayerReady(event) {
		// $('#video-play-1').click(function () {
		event.target.playVideo();
		// })
	}

	function onPlayerReady2(event) {
		// $('#video-play-2').click(function () {
		event.target.playVideo();
		// })
	}

	function onPlayerStateChange(event) {
		if (event.data == 1) {
			if (typeof dataLayer !== 'undefined') {
				dataLayer.push({ 'event-data': 'intro', 'progress': 0, 'event': 'play video' });
			}
		}
		if (event.data == 0) {
			if (typeof dataLayer !== 'undefined') {
				dataLayer.push({ 'event-data': 'intro', 'progress': 100, 'event': 'play video' });
			}
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			}
			$('#video-1').hide();
			$('#video-close-1').hide();
			$('#video-play-1').show();
		}
		$('#video-close-1').click(function () {
			stopVideo();
		});
	}

	function onPlayerStateChange2(event) {
		if (event.data == 1) {
			if (typeof dataLayer !== 'undefined') {
				dataLayer.push({ 'event-data': 'tutorial', 'progress': 0, 'event': 'play video' });
			}
		}
		if (event.data == 0) {
			if (event.data == 1) {
				if (typeof dataLayer !== 'undefined') {
					dataLayer.push({ 'event-data': 'tutorial', 'progress': 100, 'event': 'play video' });
				}
			}
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			}
			$('#video-2').hide();
			$('#video-close-2').hide();
			$('#video-play-2').show();
			$('.preloader-2').show();
		}
		$('#video-close-2').click(function () {
			stopVideo2();
		});
	}

	function stopVideo() {
		player.stopVideo();
	}
	function stopVideo2() {
		player2.stopVideo();
	}
});
//# sourceMappingURL=youtubeVideos.js.map

/*--------------------- Copyright (c) 2020 -----------------------
[Master Javascript]
Project: Artist
Version: 1.0.0
Assigned to: Theme Forest
-------------------------------------------------------------------*/
(function($) {
    "use strict";
    /*-----------------------------------------------------
    	Function  Start
    -----------------------------------------------------*/
    var Artist = {
        initialised: false,
        version: 1.0,
        mobile: false,
        init: function() {
            if (!this.initialised) {
                this.initialised = true;
            } else {
                return;
            }
            /*-----------------------------------------------------
            	Function Calling
            -----------------------------------------------------*/
            this.preLoader();
            this.navMenu();
            this.focusText();
            this.counter();
            this.bannerSlider();
            this.fixFilter();
            this.testimonialSlider();
            this.clientSlider();
        },

        /*-----------------------------------------------------
        	Fix Preloader
        -----------------------------------------------------*/
        preLoader: function() {
            jQuery(window).on('load', function() {
                jQuery(".status").fadeOut();
                jQuery(".preloader").delay(350).fadeOut("slow");
            });
        },

        /*-----------------------------------------------------
        	Fix Mobile Menu 
        -----------------------------------------------------*/
        navMenu: function() {
            var w = window.innerWidth;
            if (w <= 991) {
                $(".main_menu_wrapper>ul li").on('click', function() {
                    $(this).find('ul.sub_menu').slideToggle();
                    $(this).toggleClass("open");
                });
                $(".main_menu_wrapper>ul").on('click', function() {
                    event.stopPropagation();
                });
                $(".menu_btn").on('click', function(e) {
                    event.stopPropagation();
                    $(".main_menu_wrapper, .menu_btn_wrap").toggleClass("open");
                });
                $("body").on('click', function() {
                    $(".main_menu_wrapper, .menu_btn_wrap").removeClass("open");
                });
            }
        },

        /*-----------------------------------------------------
        	Fix  On focus Placeholder
        -----------------------------------------------------*/
        focusText: function() {
            var place = '';
            $('input,textarea').focus(function() {
                place = $(this).attr('placeholder');
                $(this).attr('placeholder', '');
            }).blur(function() {
                $(this).attr('placeholder', place);
            });
        },



        /*-----------------------------------------------------
        	Fix Counter
        -----------------------------------------------------*/
        counter: function() {
            if ($('.counter_holder').length > 0) {
                var a = 0;
                $(window).scroll(function() {
                    var topScroll = $('.counter_holder').offset().top - window.innerHeight;
                    if (a == 0 && $(window).scrollTop() > topScroll) {
                        $('.count_no').each(function() {
                            var $this = $(this),
                                countTo = $this.attr('data-count');
                            $({
                                countNum: $this.text()
                            }).animate({
                                countNum: countTo
                            }, {
                                duration: 5000,
                                easing: 'swing',
                                step: function() {
                                    $this.text(Math.floor(this.countNum));
                                },
                                complete: function() {
                                    $this.text(this.countNum);
                                }
                            });
                        });
                        a = 1;
                    }
                });
            };
        },


        /*-----------------------------------------------------
        	Fix Banner Slider 
        -----------------------------------------------------*/
        bannerSlider: function() {
            var bannerSwiper = new Swiper('.swiper-container.hs_banner_slider', {
                autoHeight: false,
                autoplay: true,
                loop: true,
                spaceBetween: 0,
                centeredSlides: false,
                speed: 1000,
                autoplay: {
                    delay: 3000,
                },
                keyboard: {
                    enabled: true,
                },
                navigation: {
                    nextEl: '.ButtonNext',
                    prevEl: '.ButtonPrev',
                },
                pagination: {
                    el: '.pagination',
                    clickable: true,
                },
                breakpoints: {
                    0: {
                        slidesPerView: 1,
                    },
                    575: {
                        slidesPerView: 1,
                    },
                    767: {
                        slidesPerView: 1,
                    },
                    992: {
                        slidesPerView: 1,
                    },
                    1200: {
                        slidesPerView: 1,
                    },
                },
            });
        },


        /*-----------------------------------------------------
        	Fix Filter
        -----------------------------------------------------*/
        fixFilter: function() {
            $(function() {
                $('.portfolio_filter').mixItUp();
            });
        },

        /*-----------------------------------------------------
        	Fix Testimonial Slider 
        -----------------------------------------------------*/
        testimonialSlider: function() {
            var testimonialSwiper = new Swiper('.swiper-container.hs_testimonial_slider', {
                autoHeight: false,
                autoplay: true,
                loop: true,
                spaceBetween: 0,
                centeredSlides: false,
                speed: 1000,
                autoplay: {
                    delay: 3000,
                },
                navigation: {
                    nextEl: '.test-slide-next',
                    prevEl: '.test-slide-prev',
                },
            });
        },

        /*-----------------------------------------------------
        	Fix Client Slider 
        -----------------------------------------------------*/
        clientSlider: function() {
            var clientSwiper = new Swiper('.swiper-container.hs_client_slider', {
                autoHeight: false,
                autoplay: true,
                loop: true,
                spaceBetween: 0,
                centeredSlides: false,
                speed: 1000,
                autoplay: {
                    delay: 5000,
                },
                navigation: {
                    nextEl: '.client-slide-next',
                    prevEl: '.client-slide-prev',
                },
                slidesPerView: 4,
                breakpoints: {
                    0: {
                        slidesPerView: 1,
                    },
                    575: {
                        slidesPerView: 1,
                    },
                    767: {
                        slidesPerView: 2,
                    },
                    992: {
                        slidesPerView: 3,
                    },
                    1200: {
                        slidesPerView: 4,
                    },
                },
            });
        },


    };

    Artist.init();

})(jQuery);

/*-----------------------------------------------------
	Fix Contact Form Submission
-----------------------------------------------------*/
// Contact Form Submission
function checkRequire(formId, targetResp) {
    targetResp.html('');
    var email = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
    var url = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
    var image = /\.(jpe?g|gif|png|PNG|JPE?G)$/;
    var mobile = /^[\s()+-]*([0-9][\s()+-]*){6,20}$/;
    var facebook = /^(https?:\/\/)?(www\.)?facebook.com\/[a-zA-Z0-9(\.\?)?]/;
    var twitter = /^(https?:\/\/)?(www\.)?twitter.com\/[a-zA-Z0-9(\.\?)?]/;
    var google_plus = /^(https?:\/\/)?(www\.)?plus.google.com\/[a-zA-Z0-9(\.\?)?]/;
    var check = 0;
    $('#er_msg').remove();
    var target = (typeof formId == 'object') ? $(formId) : $('#' + formId);
    target.find('input , textarea , select').each(function() {
        if ($(this).hasClass('require')) {
            if ($(this).val().trim() == '') {
                check = 1;
                $(this).focus();
                $(this).parent('div').addClass('form_error');
                targetResp.html('You missed out some fields.');
                $(this).addClass('error');
                return false;
            } else {
                $(this).removeClass('error');
                $(this).parent('div').removeClass('form_error');
            }
        }
        if ($(this).val().trim() != '') {
            var valid = $(this).attr('data-valid');
            if (typeof valid != 'undefined') {
                if (!eval(valid).test($(this).val().trim())) {
                    $(this).addClass('error');
                    $(this).focus();
                    check = 1;
                    targetResp.html($(this).attr('data-error'));
                    return false;
                } else {
                    $(this).removeClass('error');
                }
            }
        }
    });
    return check;
}
$(".submitForm").on('click', function() {
    var _this = $(this);
    var targetForm = _this.closest('form');
    var errroTarget = targetForm.find('.response');
    var check = checkRequire(targetForm, errroTarget);

    if (check == 0) {
        var formDetail = new FormData(targetForm[0]);
        formDetail.append('form_type', _this.attr('form-type'));
        $.ajax({
            method: 'post',
            url: 'ajaxmail.php',
            data: formDetail,
            cache: false,
            contentType: false,
            processData: false
        }).done(function(resp) {
            console.log(resp);
            if (resp == 1) {
                targetForm.find('input').val('');
                targetForm.find('textarea').val('');
                errroTarget.html('<p style="color:green;">Mail has been sent successfully.</p>');
            } else {
                errroTarget.html('<p style="color:red;">Something went wrong please try again latter.</p>');
            }
        });
    }
});;
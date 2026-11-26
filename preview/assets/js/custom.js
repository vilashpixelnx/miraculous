/*--------------------- Copyright (c) 2021 -----------------------
[Master Javascript]
Project: Home Delivery
-------------------------------------------------------------------*/
(function ($) {
	"use strict";
	var MachineForHire = {
		initialised: false,
		version: 1.0,
		mobile: false,
		init: function () {
			if(!this.initialised) {
				this.initialised = true;
			} 
			else {
				return;
			}
		/*-------------- Home Delivery Design Functions Calling ---------------------------------------------------
		------------------------------------------------------------------------------------------------*/
		    
			this.menu_toggle();
			this.bottom_top();
			this.loader();
			
		},
		
		/*-------------- Home Delivery Design Functions Calling ---------------------------------------------------
		--------------------------------------------------------------------------------------------------*/
		
		// loader			
			loader: function () {
				jQuery(window).on('load', function() {
					$(".loader").fadeOut();
					$(".spinner").delay(500).fadeOut("slow");
				});
			},
		// loader
		
		// Navbar js
			menu_toggle: function() {
				$('.mq_toggle').click(function(e){
					e.stopPropagation();
					$('.mq_header_menu').toggleClass('menu_open');
				});

				$('.mq_header_menu').click(function(e){
					e.stopPropagation();
				});

				$('body,html').click(function(e){
				   $('.mq_header_menu').removeClass('menu_open');
				});
			},
		// Navbar js	
		
		// Bottom To Top
			bottom_top: function(){  
				if($('#button').length > 0){
					
					var btn = $('#button');

					$(window).scroll(function() {
					  if ($(window).scrollTop() > 300) {
						btn.addClass('show');
					  } else {
						btn.removeClass('show');
					  }
					});

					btn.on('click', function(e) {
					  e.preventDefault();
					  $('html, body').animate({scrollTop:0}, '300');
					});


				}
			},
		// Bottom To Top
		
		
	
	};
	MachineForHire.init();	

}(jQuery));	

;
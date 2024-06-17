(function ($) {
    "use strict";

    // Initiate the wowjs
    new WOW().init();


    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').addClass('shadow-sm').css('top', '0px');
        } else {
            $('.sticky-top').removeClass('shadow-sm').css('top', '-100px');
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Header carousel
    $(".header-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        items: 1,
        dots: true,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ]
    });


    // Testimonials carousel
    $(".testimonial-carousel, .news-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 24,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            992:{
                items:2
            }
        }
    });
	
	$(document).ready(function() {
		$.ajax({
			type: "GET",
			url: "content.xml",
			dataType: "xml",
			success: function(xml) {
				
				var address = $(xml).find('address').text()
				var phone = $(xml).find('phone').text()
				var email = $(xml).find('email').text()
				var youtube = $(xml).find('youtube').text()
				var facebook = $(xml).find('facebook').text()
				$("#fa-facebook").prop('href', facebook);
				$("#fa-youtube").prop('href', youtube);
				$("#fa-address").text(address);
				$("#fa-phone").text(phone);
				$("#fa-email").prop('href', 'mailto:' + email);
				$("#fa-email-text").text(email);
				$("#fa-address-contact").text(address);
				$("#fa-phone-contact").text(phone);
				$("#fa-email-contact").prop('href', 'mailto:' + email);
				$("#fa-email-contact-text").text(email);
				
				
				
				var newsHTML = '';
				const newsList = $(xml).find('news');
				newsList.each(function(index) {
					// Chỉ lấy 3 tin tức đầu tiên
					if (index < 3) { // Chỉ lấy 3 tin tức đầu tiên
                    const title = $(this).find('Title').text();
                    let content = $(this).find('Content').text();
                    // Cắt nội dung thành khoảng 20 từ
                    const words = content.split(' ');
                    if (words.length > 20) {
                        content = words.slice(0, 20).join(' ') + '...';
                    }
					const newsId = '#news-0' + (index + 1);
                    const newsHtml = `<div id=${newsId} class="testimonial-item bg-light rounded p-5"><p class="fs-5"><strong>${title}</strong><br>${content}</p></div>`;
                    $('.news-carousel').owlCarousel('add', newsHtml).owlCarousel('update');
					}
				});
				const imageList = $(xml).find('image');
				// Lặp qua từng phần tử image và chèn nội dung vào các div tương ứng
				imageList.each(function(index){
					if (index < 4) { // Chỉ lấy 4 ảnh đầu tiên
						const imageTitle = $(this).find('Description').text();
						const imageUrl = $(this).find('Filename').text();
						const imageId = `#image-0${index + 1}`;
						$(imageId).html(`<a href="${imageUrl}" data-lightbox="gallery" data-title="${imageTitle}"><img src="${imageUrl}" alt="${imageTitle}" /><p>${imageTitle}</p></a>`);
					}
				});
			},
			error: function(xhr, status, error) {
			// Mã xử lý khi có lỗi
			console.log('Error: ' + xhr.status + ' ' + error);
			}
		});
	});
    
})(jQuery);


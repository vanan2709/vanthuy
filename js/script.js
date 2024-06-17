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
	$(document).ready(function() {
		let newsData = [];
		const newsPerPage = 3;
		const imagesPerPage = 12;
		let imageData = [];
		let i = 0;
		let j = 0;

		// Hàm load XML
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
				
				var max_page = Number($(xml).find('max-page').text());
				//news section
				var max_news_item = newsPerPage * max_page;
				$(xml).find('news').each(function() {
					const title = $(this).find('Title').text();
					const content = $(this).find('Content').text();
					newsData.push({ title, content });
					i = i + 1;
					if (i > max_news_item)
					{
						return false;
					}
				});
				displayPage(1);
				setupPagination();
				//end news section
				
				//pictures section
				var max_images = imagesPerPage * max_page;
				$(xml).find('image').each(function() {
					const description = $(this).find('Description').text();
					const filename = $(this).find('Filename').text();
					imageData.push({ description, filename });
					j = j + 1;
					if (j > max_images)
					{
						return false;
					}
				});
				setupPaginationPictures();
				displayPagePictures(1);
				//end pictures section
				
				//videos section
				var videoContainer = $("#video-container");
				var videos = $(xml).find('video');
				var videoCount = videos.length;
				for (var i = 0; i < 6 && i < videoCount; i++) {
					var video = videos[i];
					var description = $(video).find('Description').text();
					var url = $(video).find('URL').text();

					// Extract YouTube video ID from URL
					var videoID = url.split('v=')[1];
					var ampersandPosition = videoID.indexOf('&');
					if (ampersandPosition != -1) {
						videoID = videoID.substring(0, ampersandPosition);
					}

					// Create iframe element
					var iframe = `<div class="video-item">
									<p>${description}</p>
									<iframe src="https://www.youtube.com/embed/${videoID}" frameborder="0" allowfullscreen></iframe>
								  </div>`;

					// Append iframe to container
					videoContainer.append(iframe);
				}
				
			},
			error: function() {
				console.log("An error occurred while processing XML file.");
			}
		});

		// Hàm hiển thị một trang
		function displayPage(page) {
			const start = (page - 1) * newsPerPage;
			const end = start + newsPerPage;
			const newsToDisplay = newsData.slice(start, end);
			$('#news-box').empty();

			newsToDisplay.forEach(news => {
				const titleHtml = `<h1 class="mb-4">${news.title}</h1>`;
				const words = news.content.split(' ');
				const truncatedContent = words.length > 50 ? words.slice(0, 50).join(' ') + '...' : news.content;
				const contentHtml = `<p>${truncatedContent}</p>`;
				const seeMoreButton = `
					<div style="text-align: right; margin-bottom: 10px;">
						<a class="btn btn-primary rounded-pill py-3 px-5 view-more" href="#" data-title="${news.title}" data-content="${encodeURIComponent(news.content)}">Xem thêm</a>
					</div>`;
				const newsHtml = `<div style=""><div>${titleHtml}${contentHtml}</div>${seeMoreButton}</div>`;
				$('#news-box').append(newsHtml);
			});

			// Xử lý sự kiện cho nút Xem thêm
			$('a.view-more').click(function(event) {
					event.preventDefault();
					const title = $(this).data('title');
					
					let content = decodeURIComponent($(this).data('content'));
					content = content.replace(/([.!?])\s+(?=[A-ZĐ])/g, "$1<p>");
					const detailHtml = `
						<button id="back-button" class="btn btn-secondary mb-4">Back</button>
						<h1>${title}</h1>
						<p>${content}</p>`;
					$('#news-detail').html(detailHtml);
					history.pushState({ page: 'detail' }, title, `#detail`);
					$('#news-box').hide();
					$('#pagination').hide();
					$('html, body').animate({ scrollTop: 0 }, 'slow');
					
					
					// Xử lý sự kiện cho nút Back
					$('#back-button').click(function() {
					$('#news-detail').empty();
					$('#news-box').show();
					$('#pagination').show();
					history.back();
				});
			});
		}

		// Hàm thiết lập phân trang
		function setupPagination() {
			const pageCount = Math.ceil(newsData.length / newsPerPage);
			$('#pagination').empty();
			for (let i = 1; i <= pageCount; i++) {
				const pageLink = `<a href="#" class="page-link page-news-link" data-page="${i}">${i}</a>`;
				$('#pagination').append(pageLink);
			}

			// Xử lý sự kiện cho các liên kết phân trang
			$('a.page-news-link').click(function(event) {
				event.preventDefault();
				const page = $(this).data('page');
				displayPage(page);
				$('a.page-news-link').removeClass('active');
				$(this).addClass('active');
			});

			// Đánh dấu trang đầu tiên là active
			$('a.page-news-link').first().addClass('active');
		}
		
		// Hàm hiển thị chi tiết từ hash
		function showDetailFromHash() {
			if (newsData.length > 0) {
				const newsToDisplay = newsData[0]; // Ví dụ: hiển thị tin tức đầu tiên
				const title = newsToDisplay.title;
				let content = newsToDisplay.content;
				content = content.replace(/([.!?])\s*(?=[A-Z])/g, "$1<p>");
				const detailHtml = `
					<button id="back-button" class="btn btn-secondary mb-4">Back</button>
					<h1>${title}</h1>
					<p>${content}</p>`;
				$('#news-detail').html(detailHtml);
				$('#news-box').hide();
				$('#pagination').hide();
				
				// Xử lý sự kiện cho nút Back
				$('#back-button').click(function() {
                $('#news-detail').empty();
                $('#news-box').show();
				$('#pagination').show();
                history.back();
				})
			}
		}
			
		// Xử lý sự kiện popstate để quay lại danh sách tin tức khi nhấn nút Back
		window.onpopstate = function(event) {
			if (event.state && event.state.page === 'detail') {
				// Xử lý khi quay lại trang chi tiết
			} else {
				// Quay lại danh sách tin tức
				$('#news-detail').empty();
				$('#news-box').show();
				$('#pagination').show();
			}
		};

		// Kiểm tra hash để hiển thị nội dung chi tiết nếu có
		if (window.location.hash === '#detail') {
			// Mô phỏng nhấn nút "Xem thêm" sau khi dữ liệu đã được tải
			$(window).on('load', function() {
				showDetailFromHash();
				//alert("Window Loaded.");
			});
		}
		
		//Pictures
		

		// Hàm thiết lập phân trang
		function setupPaginationPictures() {
			const pageCountPictures = Math.ceil(imageData.length / imagesPerPage);
			$('#pagination-gallery').empty();
			for (let i = 1; i <= pageCountPictures; i++) {
				const pagePicLink = `<a class="page-link page-pic-link" href="#" data-page="${i}">${i}</a>`;
				$('#pagination-gallery').append(pagePicLink);
			}

			// Xử lý sự kiện cho các liên kết phân trang
			$('a.page-pic-link').click(function(event) {
				event.preventDefault();
				const pagePic = $(this).data('page');
				displayPagePictures(pagePic);
				$('a.page-pic-link').removeClass('active');
				$(this).addClass('active');
			});

			// Đánh dấu trang đầu tiên là active
			$('a.page-pic-link').first().addClass('active');
		}

		// Hàm hiển thị một trang
		function displayPagePictures(page) {
			const start = (page - 1) * imagesPerPage;
			const end = start + imagesPerPage;
			const imagesToDisplay = imageData.slice(start, end);
			$('#image-gallery').empty();

			imagesToDisplay.forEach(image => {
				const imageHtml = `
						<div class="image-item">
							<span>${image.description}</span>
							<a href="${image.filename}" data-lightbox="gallery" data-title="${image.description}">
								<img src="${image.filename}" alt="${image.description}">
							</a>
						</div>`;
				$('#image-gallery').append(imageHtml);
			});
		}
		
		
	});

})(jQuery);
$(document).ready(function() {
	var pathname = window.location.pathname;
	$('.nav > li > a[href="'+pathname+'"]').parent().addClass('active');
});

$(document).ready(function() {
	$.get('/profile/friend-requests-num', function(data, status){
		if(data > 0){
			var curr_val = $('#length').text();
			var new_val = data;
			$('#length').text(new_val);  

                        var curr_val = $('#num').text();
			var new_val = data;
			$('#num').text(new_val); 
		}
	});
});

$(document).ready(function() {
	$.get('/profile/username', function(data){
		$('#username-text').text(data.username);
	});
});

//front-end settings logic
$(document).ready(function() {
	$('#toggle-side-panel').click(function(e) {
		e.preventDefault();
		$.get('/profile/settings', function(data, status, xhr) {
			if (data.status == 403) {
				return;
			}

			$.ajax({
				url: "/profile/settings",
				type: 'PUT',
				data: {
					_csrf: $('[name="csrfToken"]').attr('content'),
					sidePanelFlag: !data.sidePanelFlag,
					bgmFlag: data.bgmFlag
				},
				success: function() {
					$('#toggle-side-panel').trigger('toggleFlag');
				}
			});
		});
	});

	$('#toggle-background-music').click(function(e) {
		e.preventDefault();
		$.get('/profile/settings', function(data) {
			if (data.status == 403) {
				return;
			}

			$.ajax({
				url: "/profile/settings",
				type: 'PUT',
				data: {
					_csrf: $('[name="csrfToken"]').attr('content'),
					sidePanelFlag: data.sidePanelFlag,
					bgmFlag: !data.bgmFlag
				},
				success: function() {
					$('#toggle-background-music').trigger('toggleFlag');
				}
			});
		});
	});

	$.get('/profile/settings', function(data) {
		if (data.status == 403) {
			return;
		}

		if(data.sidePanelFlag) {
			$('#toggle-side-panel').trigger('toggleFlag');
		}

		if(data.bgmFlag) {
			$('#toggle-background-music').trigger('toggleFlag');
		}
	});
	
	$('#toggle-side-panel').on('toggleFlag', function() {
		$('#wrapper').toggleClass('toggled');
	});

	$('#toggle-background-music').on('toggleFlag', function() {
		if($('#bgm').length) {
			var player = document.getElementById('bgm');
			//reference: https://stackoverflow.com/questions/8029391/how-can-i-tell-if-an-html5-audio-element-is-playing-with-javascript
			var isPlaying = !player.paused && !player.ended && 0 < player.currentTime;
			if (isPlaying) {
				player.pause();
			} else {
				player.play();
			}
		}
	});

	$('ul.dropdown-menu>li>a.toggle-menu-option').on('toggleFlag', function(e) {
		e.preventDefault();
		$(this).children('span').toggleClass('glyphicon glyphicon-ok');
	});
});
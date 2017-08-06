$(document).ready(function() {
	$("#toggle-side-panel").click(function(e) {
		e.preventDefault();
		$("#wrapper").toggleClass("toggled");
	});
	$("ul.dropdown-menu>li>a.toggle-menu-option").click(function(e) {
		e.preventDefault();
		$(this).children("span").toggleClass("glyphicon glyphicon-ok");
	});
});

$(document).ready(function() {
	var pathname = window.location.pathname;
	$('.nav > li > a[href="'+pathname+'"]').parent().addClass('active');
});

$(document).ready(function() {
	$("#toggle-background-music").click(function(e) {
		$("#bgm").toggle();
		var thissound=document.getElementById("bg-music");
		thissound.pause();
		thissound.currentTime = 0;
	});
});

$(document).ready(function() {
	$.get("/profile/friend-requests-num", function(data, status){
		if(data > 0){
			var curr_val = $('#length').text();
			var new_val = data;
			$('#length').text(new_val);  
		}
	});
});

$(document).ready(function() {
	$.get("/profile/username", function(data){
		$("#username-text").text(data.username);
	});
});
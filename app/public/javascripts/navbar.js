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
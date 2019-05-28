jQuery(document).ready(function ($) {

  $(".btn-copy").click(function(e) {
	  e.preventDefault();
	});
	var clipboard = new ClipboardJS('.btn-copy');
	clipboard.on('success', function(e) {
	   console.log(e);
	});
	clipboard.on('error', function(e) {
	   console.log(e);
	});

  
});

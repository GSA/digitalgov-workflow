jQuery(document).ready(function($) {

	// Look for the '.article-list' element on the page
  var location = $('.card-list')
  // Get the data-api ID
	var api_id = $(location).data('api');

  // Look through content_types JSON and find the object that has the ID that has the same api_id
  // NOTE: The content_types object is set in the <head> of each page
  jQuery.grep(content_types, function(obj) {
    if(obj.id === api_id){
      api_path = obj.api;
    }
  });
	console.log(api_path);
  // Now that we have the api_path,...
  if (api_path) {
    // Let's get the API + data
    var get_pages = (function() {
      $.ajax({
    	  url: api_path,
    	 	dataType: 'json',
    	}).done(function(data) {
        // Wait until all of the API data is retrieved
				console.log(data);
				display_cards(data, "author", location);
      });
    })();
  }

	function display_cards(data, type, location){
    $.each( data.items, function( i, obj ) {
			$.each( obj, function( i, e ) {
				$(location).append(get_card(e, type));
			});
    });
  }



});

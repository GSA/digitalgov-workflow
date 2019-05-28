jQuery(document).ready(function($) {

  // Look for the '.card-list' element on the page
  var el = $('.card-list');
  if (el.length) {
    // Get the data-api ID
  	var api_id = $(el).data('api');

    // Look through content_types JSON and find the object that has the ID that has the same api_id
    // NOTE: The content_types object is set in the <head> of each page
    jQuery.grep(content_types, function(obj) {
      if(obj.id === api_id){
        api_path = obj.api;
      }
    });
    // Now that we have the api_path,...
    if (api_path) {
      console.log(api_path);
      // Let's get the API + data
      var get_pages = (function() {
        $.ajax({
      	  url: api_path,
      	 	dataType: 'json',
      	}).done(function(data) {
          // Wait until all of the API data is retrieved
  				display_card_list(data, api_id, el);
        });
      })();
    }
  }


  // display the list of cards
	function display_card_list(data, api_id, el){
    if (data.content == "authors") {
      $.each( data.items, function( i, obj ) {
  			$.each( obj, function( i, e ) {
  				$(el).append(get_card(e, api_id));
  			});
      });
    } else {
      $.each( data.items, function( i, obj ) {
        $(el).append(get_card(obj, data.content, data.type));
      });
    }
  }
});

jQuery(document).ready(function($) {

  // Look for the '.newsletter-list' element on the page
  var elems = document.getElementsByClassName( "newsletter-list" );
  var arr = jQuery.makeArray( elems );
  $.each( arr, function( i, el ) {

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
  				display_newsletter_list(data, api_id, el);
        });
      })();
    }
  });


  // display the list of cards
	function display_newsletter_list(data, api_id, el){
    if ($(el).hasClass('newsletter-code') == true) {
      var el = $('.newsletter-code pre');
      $(el).append(htmlEncode('<ul>'));
      $(el).append('\n');
      $.each( data.items, function( i, obj ) {
        $(el).append(htmlEncode(get_card(obj, data.content, 'newsletter')));
        $(el).append('\n');
      });
      $(el).append('\n');
      $(el).append(htmlEncode('</ul>'));
    } else {
      $.each( data.items, function( i, obj ) {
        $(el).append(get_card(obj, data.content, 'newsletter'));
      });
    }

  }


  function htmlEncode(value){
    return $('<div/>').text(value).html();
  }

});

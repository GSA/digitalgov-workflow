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
      // Let's get the API + data
      var get_pages = (function() {
        $.ajax({
      	  url: api_path,
      	 	dataType: 'json',
      	}).done(function(data) {
          // Wait until all of the API data is retrieved
  				display_newsletter_list(data, api_id, el);
  				display_newsletter_block(data, api_id, el);
        });
      })();
    }
  });


  // display the list of cards
	function display_newsletter_list(data, api_id, el){
    var i = 0;
    var events = data.items.slice(1, 10);
    var events = events.reverse();
    if ($(el).hasClass('newsletter-code') == true) {
      var el = $('.newsletter-code pre');
      $(el).append(htmlEncode('<ul>'));
      $(el).append('\n');
      $.each( events, function( i, obj ) {
        $(el).append(htmlEncode(get_card(obj, data.content, 'newsletter')));
        $(el).append('\n');
      });
      $(el).append('\n');
      $(el).append(htmlEncode('</ul>'));
    } else {
      $.each( events, function( i, obj ) {
        $(el).find('#list-box').append(get_card(obj, data.content, 'newsletter'));
      });
    }
  }

  function display_newsletter_block(data, api_id, el){
    var events_header = [
      '<p style="text-align: left; font-size: 20px; line-height: 1.15;"><strong style="color: #000000;">Upcoming Training and Events:</strong></p><p style="color: #666666;font-size: 16px;">Free online and in-person trainings and events for people and teams across the federal government, from <a href="https://digital.gov/digitalgov-university/" rel="noopener">DigitalGov University</a> (DGU).</p>',
      '<div><a href="https://www.digital.gov/events/" rel=" noopener" style="font-family: helvetica;color: #3574e3;font-size: 16px;">All Upcoming Events</a><span style="font-family: helvetica;color: #3574e3;font-size: 16px;">&nbsp;|&nbsp;</span><a href="https://www.youtube.com/c/DigitalGov" rel=" noopener" style="font-family: helvetica;color: #3574e3;font-size: 16px;">Past Events</a></div><div style="text-align: left; font-size: 14px;">&nbsp;</div>'
    ].join("\n");
    $('#post-matter').append(htmlEncode(events_header));

    var events = data.items.slice(1, 10);
    var events = events.reverse();
    // For each event
    $.each( events, function( i, e ) {
      var title = e.title;
      var summary = e.summary;
      var date_modified = e.date_modified;
      var date = e.date;
      var start_date = event_date_format(e.start_date);
      var start_time = event_time_format(e.start_date);
      var end_date = event_time_format(e.end_date);
      var url = e.url;
      var sourceoftruth = "https://digital.gov";
      var card = [
        '<div style="text-align: left; font-size: 14px;"><span style="background-color: transparent; color: #000000; font-family: helvetica; font-size: 20px;">- - - - - -</span></div><div style="text-align: left; font-size: 14px;">&nbsp;</div><div style="text-align: left; font-size: 14px;">',
        '<div style="text-align: left;"><a href="'+sourceoftruth+ url+'" title="'+title+'" rel=" noopener" style="font-size: 20px;color: #3574e3;"><strong>'+title+'</strong></a></div>',
        '<div style="text-align: left;"><strong style="font-size: 16px;color: #000000;">📆 '+start_date+'<br/>'+start_time+'-'+end_date+' ET</strong></div>',
        '<div style="text-align: left;"><p style="color: #000000; font-size: 16px;">'+summary+' <a href="'+sourceoftruth+ url+'" title="'+title+'" rel=" noopener" style="color: #3574e3;"><strong>REGISTER</strong></a></p></div>'
      ].join("\n");
      $('#post-matter').append(htmlEncode(card));
    });

  	// $( ".btn-edit" ).attr( 'href', editpathURL + "?message=Updated%20topics" );
  	// return card;
  }

  function htmlEncode(value){
    return $('<div/>').text(value).html();
  }


});

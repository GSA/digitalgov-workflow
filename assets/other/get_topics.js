jQuery(document).ready(function($) {


	// This file is for the topics editor workflow page.
	// It gets the topics for the article and initiates the select box
	
	var api_id = 'topics';

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
        add_weighted_topics(data, 3);
        add_weighted_topics(data, 2);
        add_weighted_topics(data, 1);
        add_weighted_topics(data, "");
        get_page_data();
      });
    })();
  }

  function add_weighted_topics(topics, weight) {
    var optgroup = '<optgroup class="weight-'+weight+'" label="Weight '+ weight +'"></optgroup>';
    $('#topic_select').append(optgroup).trigger('change');
    $.each( topics.items, function( i, e ) {
      if (e.weight == weight) {
        var options = new Option(e.display_name, e.slug, false, false);
        $("#topic_select optgroup.weight-"+weight+"").append(options).trigger('change');
      }
    });
  }






});

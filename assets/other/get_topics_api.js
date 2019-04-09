jQuery(document).ready(function($) {

	get_taxonomy_data('topics').done(get_options);
	get_taxonomy_data('people').done(get_authors);
	get_taxonomy_data('sources').done(get_sources);


	function get_sources(sources){
		var options = "";
		$.each( sources.items, function( i, e ) {
			options += '<option value="'+e.slug+'">'+e.name+'</option>';
    });
		localStorage.setItem("sources_options", options);
	}

	function get_authors(people){
		var options = "";
		$.each( people.items, function( i, e ) {
			$.each( e, function( n, peep ) {
      	options += '<option value="'+n+'">'+peep.display_name+'</option>';
    	});
    });
		localStorage.setItem("people_options", options);
	}

	function get_options_weighted(topics, weight) {
		var options = "";

		var weight_class = (weight) ? "weight-" + weight : "";
		var weight_label = (weight) ? "Weight " + weight : "";
		options += '<optgroup class="'+weight_class+'" label="'+ weight_label +'">';
    $.each( topics.items, function( i, e ) {
      if (e.weight == weight) {
      options += '<option value="'+e.slug+'">'+e.title+'</option>';
      }
    });
		options += '</optgroup>';
		return options;
  }

	function get_options(data){
		var options = "";
		options += get_options_weighted(data, 3);
		options += get_options_weighted(data, 2);
		options += get_options_weighted(data, 1);
		options += get_options_weighted(data, "");
		localStorage.setItem("topics_options", options);
	}

	function get_taxonomy_data(api_id){
		if (api_id) {
			jQuery.grep(content_types, function(obj) {
				if(obj.id === api_id){
					api_path = obj.api;
				}
			});
		}
	  if (api_path) {
	    // Let's get the API + data
	    return $.ajax({
	      url: api_path,
	      type: 'GET',
	      dataType: 'json',
	    });
	  } else {
	    console.log('The api_path for the taxonomy is not set');
	  }
	}

	// console.log("localStorage.topics_options");
	// console.log(localStorage.topics_options);
});

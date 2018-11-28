jQuery(document).ready(function($) {

	var api_id = 'topics';
	// Look through content_types and find the object that has the ID that has the same api_id
	// NOTE: The content_types object is set in the <head> of each page
	if (api_id) {
		jQuery.grep(content_types, function(obj) {
			if(obj.id === api_id){
				api_path = obj.api;
			}
		});
	}

	get_taxonomy_data(api_path).done(get_options);

	function get_options_weighted(topics, weight) {
		var options = "";

		var weight_class = (weight) ? "weight-" + weight : "";
		var weight_label = (weight) ? "Weight " + weight : "";
		options += '<optgroup class="'+weight_class+'" label="'+ weight_label +'">';
    $.each( topics.items, function( i, e ) {
      if (e.weight == weight) {
      options += '<option value="'+e.slug+'">'+e.display_name+'</option>';
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

	function get_taxonomy_data(api_path){
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

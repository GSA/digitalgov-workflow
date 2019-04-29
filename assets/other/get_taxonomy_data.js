jQuery(document).ready(function($) {

	get_taxonomy_data('sources').done(get_sources);
	get_taxonomy_data('authors').done(get_authors);
	get_taxonomy_data('topics').done(get_topics);


	function get_sources(sources){
		var options = "";
		$.each( sources.items, function( i, e ) {
			options += '<option value="'+e.slug+'">'+e.name+'</option>';
    });
		localStorage.setItem("sources_options", options);
	}

	function get_authors(authors){
		console.log('authors');
		console.log(authors);
		var options = "";
		$.each( authors.items, function( i, e ) {
			$.each( e, function( n, peep ) {
				console.log(peep.display_name);
      	options += '<option value="'+n+'">'+peep.display_name+'</option>';
    	});
    });
		localStorage.setItem("dg_authors", options);
	}

	function get_topics_weighted(topics, weight) {
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

	function get_topics(data){
		var options = "";
		options += get_topics_weighted(data, 3);
		options += get_topics_weighted(data, 2);
		options += get_topics_weighted(data, 1);
		options += get_topics_weighted(data, "");
		localStorage.setItem("dg_topics", options);
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
	    var data = $.ajax({
	      url: api_path,
	      type: 'GET',
	      dataType: 'json',
	    });
			return 'data';
	  } else {
	    console.log('The api_path for the taxonomy is not set');
	  }
	}

	// console.log("localStorage.dg_topics");
	// console.log(localStorage.dg_topics);
});

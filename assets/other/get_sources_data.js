jQuery(document).ready(function($) {

	get_taxonomy_data('sources');

	function get_sources(sources){
		var options = "";
		$.each( sources.items, function( i, e ) {
			options += '<option value="'+e.slug+'">'+e.name+'</option>';
    });
		localStorage.setItem("dg_sources", options);
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
			console.log(api_path);
	    // Let's get the API + data
	    $.ajax({
	      url: api_path,
	      type: 'GET',
	      dataType: 'json',
	    }).done(function(data) {
				get_sources(data);
				return data;
			});

	  } else {
	    console.log('The api_path for the '+api_id+' taxonomy is not set');
	  }
	}
});

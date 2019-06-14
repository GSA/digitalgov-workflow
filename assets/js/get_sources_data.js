jQuery(document).ready(function($) {

	get_taxonomy_data('sources');

	function get_sources(sources){
		var options = "";
		$.each( sources.items, function( i, e ) {
			options += '<option value="'+e.slug+'">'+e.name+'</option>';
    });
		sessionStorage.setItem("dg_sources", options);
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
			$.ajax({
	      url: api_path,
	      type: 'GET',
				crossDomain: true,
	      dataType: 'json',
				success: function(data) {
					get_sources(data);
		    },
				error : function(request,error){
					console.log('There was an error getting the '+api_id+' API — '+ error);
				}
			});

	  } else {
	    console.log('The api_path for the '+api_id+' taxonomy is not set');
	  }
	}
});

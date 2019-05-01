jQuery(document).ready(function($) {

	get_taxonomy_data('authors');


	function get_authors(data){
		var options = "";
		$.each( data.items, function( i, e ) {
			$.each( e, function( n, author ) {
      	options += '<option value="'+n+'">'+author.display_name+'</option>';
    	});
    });
		localStorage.setItem("dg_authors", options);
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
					get_authors(data);
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

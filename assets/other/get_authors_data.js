jQuery(document).ready(function($) {

	get_taxonomy_data('authors');

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
	      dataType: 'jsonp',
	    }).done(function(data) {
				console.log('data');
				console.log(data);
				get_authors(data);
				return data;
			});

	  } else {
	    console.log('The api_path for the '+api_id+' taxonomy is not set');
	  }
	}
});

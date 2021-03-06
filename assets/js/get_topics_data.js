jQuery(document).ready(function($) {

	get_taxonomy_data('topics');

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
		sessionStorage.setItem("dg_topics", options);
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
			console.log(api_path);
			$.ajax({
	      url: api_path,
	      type: 'GET',
				crossDomain: true,
	      dataType: 'json',
				success: function(data) {
					get_topics(data);
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

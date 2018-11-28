jQuery(document).ready(function($) {

	// Settings for the Select2 integration
	// https://select2.org/
	// This is what we are using to make it possible to pull topics from the TOPICS API and make them searchable and editable in the interface
	// It is not easy...
	$("#topic_select").select2({
	  tags: true,
	  width: 'element',
	  closeOnSelect: false,
	  tokenSeparators: [',', ' '],
	  createTag: function (params) {
	    // Don't offset to create a tag if there is no @ symbol
	    if (params.term.indexOf('@') === -1) {
	      // Return null to disable tag creation
	      return null;
	    }
	    return {
	      id: params.term,
	      text: params.term
	    }
	  }
	});

	$("#people_select").select2({
	  tags: true,
	  width: 'element',
	  closeOnSelect: false,
	  tokenSeparators: [',', ' '],
	  createTag: function (params) {
	    // Don't offset to create a tag if there is no @ symbol
	    if (params.term.indexOf('@') === -1) {
	      // Return null to disable tag creation
	      return null;
	    }
	    return {
	      id: params.term,
	      text: params.term
	    }
	  }
	});

	$("#topic_select").append(localStorage.topics_options).trigger('change');
	$("#people_select").append(localStorage.people_options).trigger('change');

	get_page_data().done(function(a,b,c) {
		var card_data = get_card(a, a.content, a.type);
		$('.card').append(card_data);
		insert_current_topics(a,b,c);
	});


	function insert_current_topics(data){
	  $.each( data.item, function( key, file ) {
	    // Getting an array of the topics
	    var topics_array = get_topics_array(file['topics']);
	    // Pass the current topics to the select2 field
	    $('#topic_select').val(topics_array).trigger("change");

	    // Now get the list of selected topics from the select2 field
	    // Note: We are using the select field as a way to filter out inconsistent topic name that may be in the front matter of the page.
	    // e.g. "apis" is not a topic, but "api" is
	    var selected_topics = get_selected_topics();

	    // re-build the front_matter list
	    build_topics_front_matter(selected_topics);
	  });
	}

	// returns an array the IDs or slugs for each topic
	// (e.g. 'content-strategy')
	function get_topics_array(data) {
	  var topics = [] ;
	  $.each( data, function( index, element ) {
	    topics.push(index);
	  });
	  return topics;
	}

	function get_selected_topics(){
	  var topics = $('#topic_select').select2('data');
	  var list = {};
	  $.each( topics, function( index, element ) {
	    list[element['id']] = element['title'];
	  });
	  return list;
	}

	function build_topics_front_matter(topics){
	  // Count the topics
	  var count = '';
	  var list = '';
	  $.each( topics, function( index, element ) {
	    list += '  - ' + index + '\n';
	    count++;
	  });

	  // Build the front_matter text
	  var front_matter = [
	  "topics:",
	      list,
	  ].join("\n");

	  // Inject the front_matter text into the page
	  $( "#topics_front_matter" ).html( front_matter );

	  // Update the topics count text on the page
	  $('.topics_count').html(count);
	}

	// Each time a topic is added/removed from the select,
	// get the new list of topics
	// and re-build the front_matter list
	$('#topic_select').on("select2:select select2:unselect", function(e) {
	  var topics = $('#topic_select').select2('data');
		console.log(topics);
	  var list = {};
	  $.each( topics, function( index, element ) {
	    list[element['id']] = element['title'];
	  });
	  // re-build the front_matter list
	  build_topics_front_matter(list);
	});

	// ====================================
	// These are functions that modify the editing experience and tools

	$(".btn-copy").click(function(e) {
	  e.preventDefault();
	});
	var clipboard = new ClipboardJS('.btn-copy');
	clipboard.on('success', function(e) {
	   console.log(e);
	});
	clipboard.on('error', function(e) {
	   console.log(e);
	});

});

jQuery(document).ready(function($) {

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


  // This file takes a URL parameter and uses it to fetch the JSON API for that file, and render it.
  // Example URL — 
  // http://localhost:4000/edit/?page=https%3A%2F%2Fdigital.gov%2F2018%2F07%2F17%2Fexperiments-in-tweaking-agile-for-ux%2F

  // ===========================

  function get_page_data() {
    // Get the URL parameter
    // For more info, see: https://davidwalsh.name/query-string-javascript
    var urlParams = new URLSearchParams(window.location.search);

    // This should be the URL of the digital.gov page that you are requesting data about
    var path = urlParams.get('page');
    var source = urlParams.get('source');
    jQuery.grep(content_types, function(obj) {
      if(obj.id === source){
        source_title = obj.title;
        source_url = obj.url;
      }
    });

    // API path
    // See all the digital.gov APIs https://github.com/GSA/digitalgov.gov/wiki/APIs
    var api_path = path + 'index.json';

    var post_data = (function() {
      $.ajax({
    	  url: api_path,
    	 	dataType: 'json',
    	}).done(function(data) {
        // We wait until all of the API data is retrieved to run any functions on the page
        change_source_link(source_title, source_url)
        display_article_card(data);
        display_current_topics(data);
        return data;
      });
    })();

    function display_article_card(data){
      $.each( data.item, function( key, file ) {
        $( "article.card .title" ).html( file['title'] );
        $( "article.card .summary" ).html( file['summary'] );
        $( "article.card .date_published" ).html( file['date_published'] );
        $( "article.card .authors" ).html( file['authors'] );
        $( "article.card .edit-btn" ).attr( 'href', file['editpathURL'] );
        $( ".btn-edit" ).attr( 'href', file['editpathURL'] + "?message=Updated%20topics" );
      });
    }
    
    function change_source_link(source_title, source_url) {
      if (source_title) {
        $('h5.source a').attr('href', source_url);
        $('h5.source a span').text('to '+source_title);
      } else {
        $('h5.source a').attr('onclick', "goBack()");
      }
    }

    function display_current_topics(data){
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
    var list = {};
    $.each( topics, function( index, element ) {
      list[element['id']] = element['title'];
    });
    // re-build the front_matter list
    build_topics_front_matter(list);
  });

  // Settings for the select2 integration
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

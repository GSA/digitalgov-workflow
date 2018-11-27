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

  // API path
  // See all the digital.gov APIs https://github.com/GSA/digitalgov.gov/wiki/APIs
  var api_path = path + 'index.json';
  console.log(api_path);

  return $.ajax({
    url: api_path,
    type: 'GET',
    dataType: 'json',
  });
}

function return_data(data) {
  console.log('data');
  console.log(data);
}
var foo = get_page_data().done(return_data);
console.log('foo');
console.log(foo);


// // The source is passed through the URL as a parameter, from the listing page.
// // We are using the source to change the navigation on the page
// // e.g. "<< Back to Resources"
// var source = urlParams.get('source');
// if (source) {
//   jQuery.grep(content_types, function(obj) {
//     if(obj.id === source){
//       source_title = obj.title;
//       source_url = obj.url;
//     }
//   });
// }

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
  console.log(data);
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

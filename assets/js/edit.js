jQuery(document).ready(function($) {

  // This file takes a URL parameter and uses it to fetch the JSON API for that file, and render it.
  // Example URL — 
  // http://localhost:4000/edit/?page=https%3A%2F%2Fdigital.gov%2F2018%2F07%2F17%2Fexperiments-in-tweaking-agile-for-ux%2F

  // ===========================

  // Get the URL parameter
  // For more info, see: https://davidwalsh.name/query-string-javascript
  var urlParams = new URLSearchParams(window.location.search);
  // console.log(urlParams.get('page')); // "edit"
  var path = urlParams.get('page');

  // API path
  // See all the digital.gov APIs https://github.com/GSA/digitalgov.gov/wiki/APIs
  var api_path = path + 'index.json';
  console.log(api_path);

  // Let's get the data for the post
  $.ajax({
	  url: api_path,
	 	dataType: 'json',
	}).done(function(data) {
    $.each( data.item, function( key, file ) {
      console.log(file);
      console.log(file['topics']);
      var title = file['title'];
      var summary = htmlDecode(file['summary']);
      var content = file['content'];
      var authors = get_authors(file['authors']);
      var topics_list = get_topics_list(file['topics']);
      var topics_html = get_topics_html(file['topics']);

      var date_modified = file['date_modified'];
      var date_published = file['date_published'];
      var editpathURL = file['editpathURL'];
      var filename = file['filename'];
      var filepath = file['filepath'];
      var filepathURL = file['filepathURL'];
      var url = file['url'];
      var editpathURL = file['editpathURL'];

      // Appends file_data to DIV
      build_title(title);
      build_summary(summary);
      build_date_published(date_published);
      build_authors(authors);
      build_taxonomy(topics_html);
      build_topics(topics_html);
      build_front_matter(title, summary);
      build_topics_front_matter(file['topics']);
      // build_tags_suggested(file['tags'], file['categories']);
      // build_tags_count(file['tags']);
      // build_categories_count(file['categories']);
      // build_merged_count(file['tags'], file['categories']);
      // build_duplicate_count(file['tags'], file['categories']);
      build_edit_btn(editpathURL);
    });
	});



  // ====================================
  // Template functions — these push content (HTML) to specific classnames
  // See _layouts/edit-taxonomy.html

  function build_title(title){
    $( ".title" ).html( title );
  }
  function build_summary(summary){
    $( ".summary" ).html( summary );
  }
  function build_date_published(date_published){
    $( ".date_published" ).html( date_published );
  }
  function build_authors(authors){
    $( ".authors" ).html( authors );
  }
  function build_taxonomy(topics_html){
    $( ".entry-taxonomy" ).append( topics_html );
  }

  function build_topics(topics_html){
    $( ".taxonomy-list-topics" ).append( topics_html );
  }

  function build_front_matter(title, summary){
    var front_matter = [
      "<pre>",
        "---",
        "title: '" + title + "'",
        "summary: '" + summary + "'",
        "---",
      "</pre>"
    ].join("\n");
    $( "#front_matter" ).append( front_matter );
  }

  function build_topics_front_matter(topics){
    // var tags = merge_taxonomy(tags, cats);
    var list = '';
    $.each( topics, function( index, element ) {
      list += '  - ' + index + '\n';
    });
    var front_matter = [
    "topics:",
        list,
    ].join("\n");
    $( "#topics_front_matter" ).append( front_matter );
  }

  function build_tags_suggested(tags, cats){
    var merged = merge_taxonomy(tags, cats);
    var tags = get_merged_html(merged);
    $( ".taxonomy-list-suggested" ).append( tags );
    // make_tags_editable();
  }

  function build_tags_count(){
    var n = $( ".tag-taxonomy" ).length;
    $( ".tag_count" ).prepend( n + ' ' );
  }

  function build_categories_count(){
    var n = $( ".cat-taxonomy" ).length;
    $( ".cat_count" ).prepend( n + ' ' );
  }

  function build_merged_count(tags, cats){
    var merged = $.extend(tags,cats);
    var len = Object.keys(merged).length;
    $( ".merged_count" ).html( len + ' tags' );
  }

  function build_duplicate_count(tags, cats){
    var merged = $.extend(tags,cats);
    var tags = Object.keys(tags).length;
    var cats = Object.keys(cats).length;
    var len = Object.keys(merged).length;
    $( ".duplicate_count" ).html( (+tags + +cats) - +len );
  }

  function build_edit_btn(url){
    $( ".edit-btn" ).attr( 'href', url );
  }

  // ====================================
  // These are functions that help to transform strings and data for use in the template functions

  function merge_taxonomy(tags, cats){
    return object = $.extend(tags,cats);
  }

  function htmlEncode(value){
    return $('<div/>').text(value).html();
  }

  function htmlDecode(value){
    return $('<div/>').html(value).text();
  }
  function get_authors(authors) {
    var list = '';
    i = 0;
    var len = $( authors ).length;
    $.each( authors, function( index, element ) {
      if (i < len) {
        list += element + ', ';
      } else {
        list += element;
      }
      i++;
    });
    return list;
  }

  function get_tax_md(type, data) {
    if (type == 'categories') {
      var t = 'cat';
    }
    if (type == 'tags') {
      var t = 'tag';
    }
    var tax = '';
    i = 1;
    var len = Object.keys(data).length
    $.each( data, function( index, element ) {
      if (i < len) {
        tax += element + ', ';
      } else {
        tax += element;
      }
      i++;
    });
    return tax;
  }

  // returns topics data into a comma-separated list
  function get_topics_list(data) {
    var t = 'topic';
    var tax = '';
    i = 1;
    var len = Object.keys(data).length
    $.each( data, function( index, element ) {
      if (i < len) {
        tax += element + ', ';
      } else {
        tax += element;
      }
      i++;
    });
    return tax;
  }

  function get_merged_html(tag_data) {
    var tags = '';
    $.each( tag_data, function( index, element ) {
      tags += '<a class="merged-taxonomy taxonomy" href="#" data-slug="'+index+'">'+element+'</a> '
    });
    return tags;
  }

  // returns topics as an HTML list
  function get_topics_html(data) {
    var topics = '';
    $.each( data, function( index, element ) {
      topics += '<a class="topic-taxonomy taxonomy" href="#" data-slug="'+index+'">'+element+'</a> '
    });
    return topics;
  }

  // ====================================
  // These are functions that modify the editing experience and tools

  function make_tags_editable(){
    $('.taxonomy-list-suggested .taxonomy').each(function(i, e) {
      var span = '<span>&#10799;</span>';
      $(this).addClass('editable').append(span);
    });
  }


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

  // function copy_copy() {
  //   /* Get the text field */
  //   console.log('copy');
  //   var front_matter = document.getElementById('tags_front_matter');
  //   var clipboard = new ClipboardJS('#tags_front_matter');
  //   clipboard.on('success', function(e) {
  //     console.log(e);
  //   });
  //   clipboard.on('error', function(e) {
  //     console.log(e);
  //   });
  // }
  // $(".btn-copy").click(function(e) {
  //   e.preventDefault();
  //   console.log('click');
  // 	copy_copy();
  // });

  // https://digital.gov/tag/v1/json/
  // $.getJSON( 'https://digital.gov/tag/v1/json/', function( data ) {
  //   var tags = new Array();
  //   $.each( data.items, function( index, element ) {
  //     $.each( element, function( i, tag ) {
  //       tags.push({
  //         id: i,
  //         name: tag.display_name,
  //       });
  //     });
  //   });
    // console.log(tags);

    // jQuery.map(tags, function(tag) {
    //   // console.log(tag);
    //   if(tag.name === "con"){
    //     console.log(obj);
    //     return obj; // or return obj.name, whatever.
    //   }
    // });
  // });

});

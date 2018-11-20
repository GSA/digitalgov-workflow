jQuery(document).ready(function ($) {

  // This file takes a URL parameter and uses it to fetch the JSON API for that file, and render it.
  // Example URL — 
  // http://localhost:4000/edit/?page=https%3A%2F%2Fdigital.gov%2F2018%2F07%2F17%2Fexperiments-in-tweaking-agile-for-ux%2F

  // ===========================

  // Get the URL parameter
  // For more info, see: https://davidwalsh.name/query-string-javascript
  var urlParams = new URLSearchParams(window.location.search);

  // This should be the URL of the digital.gov page that you are requesting data about
  var path = urlParams.get('page');

  // API path
  // See all the digital.gov APIs https://github.com/GSA/digitalgov.gov/wiki/APIs
  var api_path = "https://cors-anywhere.herokuapp.com/" + path + 'index.json';
  console.log(api_path);

  var post_data = (function () {
    $.ajax({
      url: api_path,
      dataType: 'json',
    }).done(function (data) {
      // We wait until all of the API data is retrieved to run any functions on the page
      display_article_card(data);
      display_current_topics(data);
      build_edit_btn(data.item[0].editpathURL);
      return data;
    });
  })();

  function display_article_card(data) {
    $.each(data.item, function (key, file) {
      $("article.card .title").html(file['title']);
      $("article.card .summary").html(file['summary']);
      $("article.card .date_published").html(file['date_published']);
    });
  }

  function display_current_topics(data) {
    $.each(data.item, function (key, file) {
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

  function build_topics_front_matter(topics) {
    // Count the topics
    var count = '';
    var list = '';
    $.each(topics, function (index, element) {
      list += '  - ' + index + '\n';
      count++;
    });

    // Build the front_matter text
    var front_matter = [
      "topics:",
      list,
    ].join("\n");

    // Inject the front_matter text into the page
    $("#topics_front_matter").html(front_matter);

    // Update the topics count text on the page
    $('.topics_count').html(count);
  }


  // returns an array the IDs or slugs for each topic
  // (e.g. 'content-strategy')
  function get_topics_array(data) {
    var topics = [];
    $.each(data, function (index, element) {
      topics.push(index);
    });
    return topics;
  }

  function get_selected_topics() {
    var topics = $('#topic_select').select2('data');
    var list = {};
    $.each(topics, function (index, element) {
      list[element['id']] = element['title'];
    });
    console.log("list");
    console.log(list);
    return list;
  }

  // Each time a topic is added/removed from the select,
  // get the new list of topics
  // and re-build the front_matter list
  $('#topic_select').on("select2:select select2:unselect", function (e) {
    var topics = $('#topic_select').select2('data');
    var list = {};
    $.each(topics, function (index, element) {
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

  // // Let's get the data for the post API
  // $.ajax({
  //   url: api_path,
  //  	dataType: 'json',
  // }).done(function(data) {
  //   $.each( data.item, function( key, file ) {
  //     console.log(file);
  //     console.log(file['topics']);
  //     var title = file['title'];
  //     var summary = htmlDecode(file['summary']);
  //     var content = file['content'];
  //     var authors = get_authors(file['authors']);
  //     var topics_list = get_topics_list(file['topics']);
  //     var topics_html = get_topics_html(file['topics']);
  //     var topics_array = get_topics_array(file['topics']);
  //
  //     var date_modified = file['date_modified'];
  //     var date_published = file['date_published'];
  //     var editpathURL = file['editpathURL'];
  //     var filename = file['filename'];
  //     var filepath = file['filepath'];
  //     var filepathURL = file['filepathURL'];
  //     var url = file['url'];
  //     var editpathURL = file['editpathURL'];
  //
  //     // Appends file_data to DIV
  //     $( ".title" ).html( title );
  //     $( ".summary" ).html( summary );
  //     $( ".date_published" ).html( date_published );
  //     $( ".authors" ).html( authors );
  //     $( ".entry-taxonomy" ).append( topics_html );
  //     $('#topic_select').val(topics_array).trigger("change");
  //     build_front_matter(title, summary);
  //     build_topics_front_matter(file['topics']);
  //     $( ".edit-btn" ).attr( 'href', editpathURL );
  //   });
  // });



  // ====================================
  // Template functions — these push content (HTML) to specific classnames
  // See _layouts/edit-taxonomy.html

  function build_front_matter(title, summary) {
    var front_matter = [
      "<pre>",
      "---",
      "title: '" + title + "'",
      "summary: '" + summary + "'",
      "---",
      "</pre>"
    ].join("\n");
    $("#front_matter").append(front_matter);
  }

  function build_edit_btn(url) {
    $(".btn-edit").attr('href', url);
  }

  // ====================================
  // These are functions that help to transform strings and data for use in the template functions

  function htmlDecode(value) {
    return $('<div/>').html(value).text();
  }
  function get_authors(authors) {
    var list = '';
    i = 0;
    var len = $(authors).length;
    $.each(authors, function (index, element) {
      if (i < len) {
        list += element + ', ';
      } else {
        list += element;
      }
      i++;
    });
    return list;
  }

  // returns topics data into a comma-separated list
  function get_topics_list(data) {
    var t = 'topic';
    var tax = '';
    i = 1;
    var len = Object.keys(data).length
    $.each(data, function (index, element) {
      if (i < len) {
        tax += element + ', ';
      } else {
        tax += element;
      }
      i++;
    });
    return tax;
  }

  // returns topics as an HTML list
  function get_topics_html(data) {
    var topics = '';
    $.each(data, function (index, element) {
      topics += '<a class="topic-taxonomy taxonomy" href="#" data-slug="' + index + '">' + element + '</a> '
    });
    return topics;
  }


  // ====================================
  // These are functions that modify the editing experience and tools

  $(".btn-copy").click(function (e) {
    e.preventDefault();
  });
  var clipboard = new ClipboardJS('.btn-copy');
  clipboard.on('success', function (e) {
    console.log(e);
  });
  clipboard.on('error', function (e) {
    console.log(e);
  });
});

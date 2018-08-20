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



  $.getJSON( api_path, function( data ) {
    console.log(data);
    $.each( data.item, function( key, file ) {
      var title = file['title'];
      var summary = file['summary'];
      var content = file['content'];
      var authors = get_authors(file['authors']);
      var categories = get_tax('categories', file['categories']);
      var tags = get_tax('tags', file['tags']);
      // var authors = get_tax(file['tags']);
      var date_modified = file['date_modified'];
      var date_published = file['date_published'];
      var editpathURL = file['editpathURL'];
      var filename = file['filename'];
      var filepath = file['filepath'];
      var filepathURL = file['filepathURL'];
      var url = file['url'];
      var file_data = [
        "<div class='card'>",
          "<h2>" + title + "</h2>",
          "<p>By " + authors + "</p>",
          "<p>" + summary + "</p>",
          "<div class='entry-taxonomy'>" + categories + tags + "</div>",
        "</div>"
      ].join("\n");

      // Appends file_data to DIV
      $( "#file-contents" ).append( file_data );
    });
  });


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

  function get_tax(type, data) {
    if (type == 'categories') {
      var t = 'cat';
    }
    if (type == 'tags') {
      var t = 'tag';
    }
    var tax = '';
    $.each( data, function( index, element ) {
      tax += '<a class="'+t+'-taxonomy taxonomy" href="#" data-slug="'+index+'">'+element+'</a>'
    });
    return tax;
  }


});

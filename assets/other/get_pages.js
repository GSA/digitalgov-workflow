jQuery(document).ready(function($) {


  // Look for the '.article-list' element on the page
  var card_list = $('.card-list')
  if (card_list) {
    var el = card_list;
    // Get the data-api ID
  	var api_id = $(el).data('api');

    // Look through content_types JSON and find the object that has the ID that has the same api_id
    // NOTE: The content_types object is set in the <head> of each page
    jQuery.grep(content_types, function(obj) {
      if(obj.id === api_id){
        api_path = obj.api;
      }
    });
  }




  // Now that we have the api_path,...
  if (api_path) {
    // Let's get the API + data
    var get_pages = (function() {
      $.ajax({
    	  url: api_path,
    	 	dataType: 'json',
    	}).done(function(data) {
        // Wait until all of the API data is retrieved
        // Display the article/page data
        display_card(data, el);
      });
    })();
  } else {
    console.log('No API path is set for this page.');
  }



  function display_card(data, el){
    $.each( data.items, function( i, e ) {
      // console.log(e);
      var title = e.title;
      var summary = e.summary;
      var topics = format_topics(e.topics);
      var authors = e.authors;
      var date_modified = e.date_modified;
      var date_published = e.date_published;
      var editpathURL = e.editpathURL;
      var filename = e.filename;
      var filepath = e.filepath;
      var filepathURL = e.filepathURL;
      var branch = e.branch;
      var url = e.url;
      var source_url = encodeURI(source_of_truth);
      var article = [
        '<article class="margin-bottom-105">',
          '<div class="grid-row grid-gap-1">',
            '<div class="grid-col-12 tablet:grid-col-10">',
              '<header class="bg-white padding-2 radius-sm">',
                '<h3 class="margin-0 margin-bottom-1">',
                  '<a class="text-no-underline text-ink visited:text-ink" href="'+source_url+ url+'" title="'+title+'">'+title+'</a>',
                '</h3>',
                '<p class="margin-0 font-sans-2xs">'+summary+'</p>',
                '<p class="font-sans-3xs">',
                  topics,
                '</p>',
              '</header>',
            '</div>',
            '<div class="grid-col-12 tablet:grid-col-2">',
              '<a class="margin-bottom-1 bg-primary hover:bg-primary-dark text-center text-no-underline padding-y-05 padding-x-05 display-block text-white font-sans-2xs visited:text-white hover:text-white radius-sm" href="'+editpathURL+'">edit page</a>',
              '<a class="margin-bottom-1 text-center text-no-underline padding-y-05 padding-x-05 display-block text-primary hover:text-primary-dark bg-white font-sans-2xs radius-sm border-primary border-width-1px border-solid" href="/edit-page/?page='+source_url+url+'&source='+api_id+'">edit page</a>',
              '<a class="margin-bottom-1 text-center text-no-underline padding-y-05 padding-x-05 display-block text-primary hover:text-primary-dark bg-white font-sans-2xs radius-sm border-primary border-width-1px border-solid" href="/edit-topics/?page='+source_url+url+'&source='+api_id+'">edit topics</a>',
            '</div>',
          '</div>',
        '</article>'
      ].join("\n");
      $(el).append(article);
    });
  }

  function format_topics(data){
    var topics = "";
    $.each( data, function( i, e ) {
      var topic = [
        '<span class="bg-gray-5 margin-bottom-05 padding-x-1 display-inline-block line-height-sans-1 padding-y-05 radius-md bg-secondary-lighter">'+e+'</span> '
      ].join("\n");
      topics += topic;
    });
    return topics;
  }


});

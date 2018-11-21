jQuery(document).ready(function($) {


  $('*[data-api]').each(function(){
		var el = $(this);
		var id = $(el).data('api');
    var api_path = apis[id];
    var get_pages = (function() {
      $.ajax({
    	  url: api_path,
    	 	dataType: 'json',
    	}).done(function(data) {
        // Wait until all of the API data is retrieved
        console.log("this is the data");
        console.log(data);
        display_article(data, el);
      });
    })();
	});


  function display_article(data, el){
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
      var article = [
        '<article class="margin-bottom-105">',
          '<div class="grid-row grid-gap-4">',
            '<div class="grid-col-12 tablet:grid-col-8">',
              '<header class="bg-white padding-2 radius-sm">',
                '<h3 class="margin-0 margin-bottom-1">',
                  '<a class="text-no-underline" href="'+url+'" title="'+title+'">'+title+'</a>',
                '</h3>',
                '<p class="margin-0 font-sans-2xs">'+summary+'</p>',
                '<p class="font-sans-3xs">',
                  topics,
                '</p>',
              '</header>',
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
        '<span class="bg-gray-5 padding-x-1 padding-y-1px radius-pill bg-primary-lighter">'+e+'</span> '
      ].join("\n");
      topics += topic;
    });
    return topics;
  }

});

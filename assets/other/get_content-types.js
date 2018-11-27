jQuery(document).ready(function($) {


  // Look for the '.article-list' element on the page
  var el = $('.content_types-list')
  $.each( content_types, function( i, e ) {
    console.log(e);
    var id = e.id;
    var title = e.title;
    var url = e.url;
    var api = e.api;
    var article = [
      '<h2 class="margin-0 margin-bottom-2"><a class="text-light text-no-underline border-2px radius-md text-primary visited:text-primary display-inline-block padding-y-05 padding-x-2  border-primary" href="'+url+'">'+title+'</a></h2>'
    ].join("\n");
    $(el).append(article);
  });

});

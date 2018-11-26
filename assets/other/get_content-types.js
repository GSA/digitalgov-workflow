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
      '<div class="grid-row grid-gap-4">',
        '<div class="grid-col-12 tablet:grid-col-4">',
          '<section class="">',
            '<h2><a href="'+url+'">'+title+'</a></h2>',
          '</section>',
        '</div>',
      '</div>'
    ].join("\n");
    $(el).append(article);
  });

});

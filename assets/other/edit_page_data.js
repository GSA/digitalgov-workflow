

get_page_data().done(function(page,b,c) {
  $.each( page.item[0], function( key, e ) {
    console.log(key);
    $('[data-block="'+ key +'"]').val(e);
  });
});

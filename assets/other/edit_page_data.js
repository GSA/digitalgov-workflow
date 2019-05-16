jQuery(document).ready(function ($) {
  get_page_data().done(function(page,b,c) {
    $.each( page.item[0], function( key, e ) {
      // console.log(key);
      $('[data-block="'+ key +'"]').val(e);

      if (key == 'date') {
        // NEW date
        var date = new Date(e);
        update_date(date);
      }


      update_matter();
    });
  });

  $("input").keyup(update_matter);
  $("textarea").keyup(update_matter);
  $("select").on("select2:select select2:unselect", function(e) {
    update_matter();
  });


});

jQuery(document).ready(function ($) {


  // NEW date
  var date = new Date(e);
  update_date(date);

  $('#block-event_organizer input').val('Digital.gov');


  update_matter();

  $("input").keyup(update_matter);
  $("textarea").keyup(update_matter);
  $("select").on("select2:select select2:unselect", function(e) {
    update_matter();
  });


  // Hide and show the Source and source_url fields
  if ($('#card_display_dg').is(':checked') == true) {
    $("#block-source, #block-source_url").addClass('display-none');
    update_matter();
  }

  $('#card_display input').click(function() {
    if($(this).is(':checked')){
      var val = $(this).val();
      if (val == 'card_display_dg') {
        $("#block-source, #block-source_url").addClass('display-none');
      } else {
        $("#block-source, #block-source_url").removeClass('display-none');
      }
      update_matter();
    }
  });

  // Venue information
  $('#block-venue input').change(function() {
    update_matter();
  });






});

jQuery(document).ready(function ($) {

  github_base = "https://github.com/"+workflow_org+"/"+workflow_repo+"/new/";

  var date = new Date();
  update_date(date);

  function update_date(date){
    // Get date — set to +1 date in the future
    var yearmoday = `${date.getFullYear()}-${('0' + (date.getMonth()+1)).slice(-2)}-${('0' + (date.getDate())).slice(-2)}`;

    // Get current time — not being used at the moment
    var time = `${date.getHours()+1}:${(date.getMinutes()<10?'0':'') + '00:00'}`;
    var end_time = `${date.getHours()+2}:${(date.getMinutes()<10?'0':'') + '00:00'}`;
    // Set time to 9am ET — our daily pub time
    // var time = '09:00';
    // Insert the time into the time fields
    $(".block-date input, .block-end_date input").val(yearmoday);
    $(".block-time input").val(time);
    $(".block-end_time input").val(end_time);
  }

  $('.block-event_organizer input').val('Digital.gov');
  $("input").keyup(update_matter);
  $("textarea").keyup(update_matter);
  $("select").on('change', function() {
    update_matter();
  });
  $("select").on("select2:select select2:unselect", function(e) {
    update_matter();
  });

});

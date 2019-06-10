jQuery(document).ready(function ($) {

  github_base = "https://github.com/"+workflow_org+"/"+workflow_repo+"/edit/";

  get_page_data().done(function(page,b,c) {
    console.log(page);
    var doc = jsyaml.load(page);
    console.log(doc);
  });

  function update_time(key, val){
    var date = new Date(val);
    // Get time — not being used at the moment
    var mins = date.getMinutes();
    var time = `${date.getHours()}:${(mins<1?'00':mins) + ':00'}`;
    if (key == 'date') {
      $("#block-time input").val(time);
    }
    if (key == 'end_date') {
      $("#block-end_time input").val(time);
    }
  }

  function update_date(key, val){
    var date = new Date(val);
    // Get date — set to +1 date in the future
    var yearmoday = `${date.getFullYear()}-${('0' + (date.getMonth()+1)).slice(-2)}-${('0' + (date.getDate())).slice(-2)}`;
    // Inserts the DATES into the fields
    $("#block-"+key+" input").val(yearmoday);
  }

  $('#block-event_organizer input').val('Digital.gov');
  $("input").keyup(update_matter);
  $("textarea").keyup(update_matter);
  $("select").on("select2:select select2:unselect", function(e) {
    update_matter();
  });


  function insert_current_taxonomy_data(key, val){
    // Getting an array of the taxonomy item from json data
    var array = make_array(val);
    // Pass the current items as an array to the select2 field
    $('#block-'+key+' select').val(array).trigger("change");
	}

  // returns an array the IDs or slugs for each topic or author
	// (e.g. 'content-strategy')
	function make_array(data) {
	  var array = [] ;
	  $.each( data, function( index, element ) {
	    array.push(index);
	  });
	  return array;
	}

  function check_source_url(val){
    if (true) {
      $("#card_display_elsewhere").attr('checked', 'checked');
    } else {
      $("#card_display_dg").attr('checked', 'checked');
      $("#block-source, #block-source_url").addClass('display-none');
    }
  }

});

jQuery(document).ready(function ($) {

  get_page_data().done(function(page,b,c) {

    // Checking for source_url
    // This indicates if it is a link post or a full blog post
    if ('source_url' in page.item[0]){
      $("#card_display_elsewhere").attr('checked', 'checked');
    } else {
      $("#card_display_dg").attr('checked', 'checked');
      $("#block-source, #block-source_url").addClass('display-none');
    }

    // Gets the "page" data and matches up each key in the data object with the corresponding field (block) in the editor
    $.each( page.item[0], function( key, val ) {

      // Decodes any HTML entities in the text by creating a textarea and returning the value
      var decodeHTML = function (html) {
      	var txt = document.createElement('textarea');
      	txt.innerHTML = html;
      	return txt.value;
      };

      // Checks to see if the element is data that belongs in a select2 field
      if (key == 'topics' || key == 'authors') {
        insert_current_taxonomy_data(key, val);
      } else {
        var txt = decodeHTML(val);
        // Inserts the text into the field
        $('[data-block="'+ key +'"]').val(txt);
      }

      // We want to make sure the date reflects the date in the page
      // This gets the date from the data object and inserts it into the field
      if (key == 'date') {
        // NEW date
        console.log(val);
        update_date(val);
      }

      if (key == 'url') {
        var url = source_of_truth + val;
        var api_url = source_of_truth + val + 'index.json';
        $('.preview-url a').attr('href', url);
        $('.preview-api a').attr('href', api_url);
        $('.preview-url').addClass('display-inline-block');
        $('.preview-api').addClass('display-inline-block');
      }

      if (key == 'editpathURL') {
        $('.preview-file a').attr('href', val);
        $('.preview-file').addClass('display-inline-block');
      }

      // Update the fron matter
      update_matter();
    });
  });

  function update_date(date){
    console.log(date);
    var date = new Date(date);
    console.log(date);
    // Get date — set to +1 date in the future
    var yearmoday = `${date.getFullYear()}-${('0' + (date.getMonth()+1)).slice(-2)}-${('0' + (date.getDate())).slice(-2)}`;

    // Get current time — not being used at the moment
    var time = `${date}`;
    console.log(time);
    // var time = `${date.getHours()+1}:${(date.getMinutes()<10?'0':'') + '0:00'}`;
    var time_end = `${date.getHours()+2}:${(date.getMinutes()<10?'0':'') + '0:00'}`;
    // Set time to 9am ET — our daily pub time
    // var time = '09:00';
    // Insert the time into the time fields
    $("#block-date input, #block-date-end input").val(yearmoday);
    $("#block-time input").val(time);
    $("#block-time-end input").val(time_end);
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

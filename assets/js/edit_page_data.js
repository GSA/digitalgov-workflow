jQuery(document).ready(function ($) {

  github_base = "https://github.com/"+workflow_org+"/"+workflow_repo+"/edit/";

  get_page_data().done(function(page,b,c) {

    if (content_type == "authors") {
      var page_data = page;
    } else {
      var page_data = page.item[0];
    }

    // Checking for source_url
    // This indicates if it is a link post or a full blog post
    if ('source_url' in page_data){
      $("#card_display_elsewhere").attr('checked', 'checked');
      $(".block-source, .block-source_url").removeClass('display-none');
    } else {
      $("#card_display_dg").attr('checked', 'checked');
      $(".block-source, .block-source_url").addClass('display-none');
    }

    // Gets the "page" data and matches up each key in the data object with the corresponding field (block) in the editor
    $.each( page_data, function( key, val ) {

      // Decodes any HTML entities in the text by creating a textarea and returning the value
      var decodeHTML = function (html) {
      	var txt = document.createElement('textarea');
      	txt.innerHTML = html;
      	return txt.value;
      };

      if (key == 'slug') {
        $('[data-block="'+ key +'"]').val(val).prop('readonly', true);
      }

      if (key == 'featured_image') {
        if (val.uid) {
          $('[data-block="primary_image"]').val(val.uid);
        }
        var notice = "<p class='notice margin-y-1 padding-x-1 padding-y-2px font-sans-3xs bg-gold'><strong>Update:</strong> There is a new format for featured images in GitHub. The image ID should still be the same, but featured_image is now called primary_image.</p>";
        $('.block-primary_image').append(notice);
      }

      // Checks to see if the element is data that belongs in a select2 field
      if (key == 'topics' || key == 'authors') {
        insert_current_taxonomy_data(key, val);
      } else {
        var txt = decodeHTML(val);
        // Inserts the text into the field
        $('[data-block="'+ key +'"]').val(txt);
      }

      if (key == 'primary_image') {
        if (val.uid) {
          $('[data-block="primary_image"]').val(val.uid);
        }
      }

      // We want to make sure the date reflects the date in the page
      // This gets the date from the data object and inserts it into the field
      if (key == 'date' || key == 'end_date') {
        update_date(key, val);
        update_time(key, val);
      }

      if (key == 'aliases') {
        var redirs = "";
        $.each( val, function( i, e ) {
          redirs += '  - ' + e + "\n";
    	  });
        $('[data-block="'+ key +'"]').val(redirs);
      }
      function add_field(key, el, val){
        $(el).clone().insertAfter(el).val(val);
      }

      if (key == 'community_list') {
        // community_list_data(key, val);
        var i = 1;
        $.each( val, function( index, element ) {
          $.each( element, function( key, value ) {
            $(".block-"+key+" .community_list-"+i).val(value);
          });
          i++;
    	  });
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
        $('.preview-file').addClass('display-inline-block');
        $(".btn-edit").attr('href', val);
      }

      // Update the fron matter
      update_matter();
    });
  });

  function update_time(key, val){
    var date = new Date(val);
    // Get time — not being used at the moment
    var mins = date.getMinutes();
    var time = `${date.getHours()}:${(mins<1?'00':mins) + ':00'}`;
    if (key == 'date') {
      $(".block-time input").val(time);
    }
    if (key == 'end_date') {
      $(".block-end_time input").val(time);
    }
  }

  function update_date(key, val){
    var date = new Date(val);
    // Get date — set to +1 date in the future
    var yearmoday = `${date.getFullYear()}-${('0' + (date.getMonth()+1)).slice(-2)}-${('0' + (date.getDate())).slice(-2)}`;
    // Inserts the DATES into the fields
    $(".block-"+key+" input").val(yearmoday);
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


  function insert_current_taxonomy_data(key, val){
    // Getting an array of the taxonomy item from json data
    var array = make_array(val);
    // Pass the current items as an array to the select2 field
    $('.block-'+key+' select').val(array).trigger("change");
	}

  function community_list_data(key, val){
    var i = 1;
    $.each( val, function( index, element ) {
      $.each( element, function( key, val ) {
        $(".block-"+key+" .community_list-"+i).val(val);
      });
      i++;
	  });
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
      $(".block-source, .block-source_url").addClass('display-none');
    }
  }

});

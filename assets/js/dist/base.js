var content_type = $('form').data('content_type');
var base_field = $('form').data('base_field');

// NEW date
// var date = new Date();


// returns the year and month for use in the filepath on GitHub
// Returns: 2019/09
function file_yearmo() {
  var dateInput = $(".block-date input").val().match(/^[^\s]+/);
  var dateObj = new Date(dateInput);
  var year = dateObj.getUTCFullYear();
  var month = ("0" + (dateObj.getUTCMonth() + 1)).slice(-2); //months from 1-12
  var yearmo = year + "/" + month + "/";

  return yearmo;
}
// returns the year and month for use in the filepath in the front matter
// Returns: 2019/09/01
function file_yearmoday() {
  if ($(".block-date input").length > 0) {
    var dateInput = $(".block-date input").val().match(/^[^\s]+/);
    var dateObj = new Date(dateInput);
    var year = dateObj.getUTCFullYear();
    var month = ("0" + (dateObj.getUTCMonth() + 1)).slice(-2); //months from 1-12
    var day = ("0" + (dateObj.getDate() + 1)).slice(-2); //months from 1-12
    return yearmoday = year + "/" + month + "/" + day + "/";
  }
}

function update_matter(){
  file_yearmoday();

  var post_matter = "";
  var page_url_comment = get_page_url_comment(content_type);
  var branch = "demo";
  post_matter += "---";
  post_matter += page_url_comment;
  post_matter += "\n# Learn how to edit our pages at https://workflow.digital.gov\n";

  var community_list_1 = false;
  var community_list_2 = false;

  // For each field in the editor...
  $('*[data-block]').each(function(i, e){

		var id = $(this).data('block'); // gets the id
		var data_type = $(this).data('block-data_type'); // gets the data_type
		var comment = $(this).data('block-comment') !== "" ? '\n# ' + $(this).data('block-comment') + '\n' : ""; // gets the comment

    // Process the text by
    var val = process_text(id, $(this));

    // checks if the data should 'skip' and not appear in the front matter
    if (val !== "skip") {
      if ((data_type == "string")) {
        var front_matter = '\n'+ comment + id + ': "' + val + '"';
      } else {
        var front_matter = '\n'+ comment+ id + ': ' + val;
      }
      post_matter += front_matter;
    }

    if ($(this).hasClass('community_list-1') == true ) {
      var output = "\n\n";
      output += "community_list:\n";
      output += get_community_list_data(id, $(this), 'community_list-1');
      if (community_list_1 == false) {
        post_matter += output;
      }
      community_list_1 = true;
    }

    if ($(this).hasClass('community_list-2') == true ) {
      var output = get_community_list_data(id, $(this), 'community_list-2');
      if (community_list_2 == false) {
        post_matter += output;
      }
      community_list_2 = true;
    }

	});
  post_matter += "\n\n# Make it better ♥\n";
  post_matter += "---";

  $("#post-matter").html(post_matter);
  var github_path = github_base + get_github_url(post_matter);
  $("#new_file").attr('href', github_path);
}


function process_text(id, el){
  if (id == base_field) {
    return el.val();
  } else if (id == 'authors') {
    var authors_list = make_yaml_list($('.block-authors select').val());
    if (authors_list == '') {
      return 'skip';
    } else {
      return authors_list;
    }
  } else if (id == 'topics'){
    var topics_list = make_yaml_list($('.block-topics select').val());
    if (topics_list == '') {
      return 'skip';
    } else {
      return topics_list;
    }
  } else if (id == 'source') {
    if ($('.block-'+id).hasClass('display-none') == true) {
      return 'skip';
    } else {
      return el.val();
    }
  } else if (id == 'source_url') {
    if ($('.block-'+id).hasClass('display-none') == true) {
      return 'skip';
    } else {
      return el.val();
    }
  } else if (id == 'aliases') {
    if (el.val() == '') {
      return 'skip';
    } else {
      return "\n"+el.val();
    }
  } else if (id == 'kicker') {
    if ($(el).val().length == 0) {
      return 'skip';
    } else {
      return $(el).val();
    }
  } else if (id == 'branch') {
    return 'skip';
  } else if (id == 'date') {
    var time = $('.block-time input').val();
    return el.val() + ' ' + time + ' -0500';
  } else if (id == 'end_date') {
    var time = $('.block-end_time input').val();
    return el.val() + ' ' + time;
  } else if (id == 'primary_image') {
    var primary_image = $(el).val();
    if (primary_image.length == 0) {
      return 'skip';
    } else {
      return primary_image;
    }
  } else if (id == 'time') {
    return 'skip';
  } else if (id == 'end_time') {
    return 'skip';
  } else if (id == 'slug') {
    if ($(el).is('[readonly]')){
      var slug = $(el).val();
      return slug;
    } else {
      var slug = slugify();
      $(el).val(slug);
      return slug;
    }

  } else if (id == 'weight') {
    var weight = $(el).val();
    if (weight.length == 0) {
      return 'skip';
    } else {
      return weight;
    }

  } else if (id == 'event_platform') {
    var event_platform = $(el).val();
    if (event_platform.length == 0) {
      return 'skip';
    } else {
      return event_platform;
    }
  } else if (id == 'filename') {
    var slug = slugify();
    var filename = slug + '.md';
    $('.block-filename input').val(filename);
    $('#filename').text(filename);
    return 'skip';
  } else if (id == 'filename-dated') {
    var slug = slugify();
    var date = $('.block-date input').val();
    var filename = date + '-' + slug + '.md';
    $('.block-filename-dated input').val(filename);
    $('#filename').text(filename);
    return 'skip';
  } else if (id == 'venue') {
    return 'skip';
  } else if (el.hasClass('community_list')) {
    return 'skip';
  } else if (id == 'venue_name' || id == 'room' || id == 'address' || id == 'city' || id == 'state' || id == 'country' || id == 'zip' || id == 'map') {
    return get_venue_info(id, el);
  } else {
    return el.val();
  }
}

function make_yaml_list(items) {
  var output = '';
  if (items.length === 0) {
    return output;
  } else {
    output += "\n";
    $.each( items, function( i, e ) {
      if (i === items.length - 1) {
        output += "  - " + $.trim(e);
      } else {
        output += "  - " + $.trim(e) + "\n";
      }
    });
    return output;
  }
}

function get_filename(){
  return $('#filename').text();
}

function get_edit_branch(){
  return "demo";
}

function get_page_url_comment(content_type){
  var url = get_publish_url(content_type);
  var comment = "\n# View this page at " + url;
  return comment;
}

function get_publish_url(content_type) {
  var slug = slugify();
  if (content_type == 'posts') {
    var url = "https://digital.gov/" + file_yearmoday() + slug;
  } else if (content_type == 'events') {
    var url = "https://digital.gov/event/" + file_yearmo() + slug;
  } else if (content_type == 'resources') {
    var url = "https://digital.gov/resources/" + slug;
  } else if (content_type == 'services') {
    var url = "https://digital.gov/services/" + slug;
  } else if (content_type == 'communities') {
    var url = "https://digital.gov/communities/" + slug;
  } else if (content_type == 'authors') {
    var url = "https://digital.gov/authors/" + slug;
  } else {
    var url = "https://digital.gov/" + file_yearmo() + slug;
  }
  return url;
}


function get_github_url(post_matter) {
  var base_url = get_edit_branch()+"/content/"+content_type+"/";

  // Passing in the commit message to GitHub
  var commit_msg = "New "+ content_type +": " + ($('.block-'+base_field +' input').val()).trim();

  // Passing in the commit description to GitHub
  var commit_desc = "";
  if ($(".block-deck textarea").length) {
    var commit_desc = ($(".block-deck textarea").val()).trim();
  }

  // Setting the file path based on content_type
  if (content_type == 'posts' || content_type == 'events') {
    base_url += file_yearmo() + '?filename=' + get_filename() + '&value=' + encodeURIComponent(post_matter) + '&message=' + encodeURIComponent(commit_msg) + '&description=' + encodeURIComponent(commit_desc) + '&target_branch=' + get_edit_branch();
  } else if (content_type == 'authors' || content_type == 'topics') {
    base_url += slugify() + '/?filename='+slugify()+'/_index.md' + '&value=' + encodeURIComponent(post_matter) + '&message=' + encodeURIComponent(commit_msg) + '&description=' + encodeURIComponent(commit_desc) + '&target_branch=' + get_edit_branch();
  } else {
    base_url += '?filename=' + get_filename() + '&value=' + encodeURIComponent(post_matter) + '&message=' + encodeURIComponent(commit_msg) + '&description=' + encodeURIComponent(commit_desc) + '&target_branch=' + get_edit_branch();
  }
  return base_url;
}

function get_venue_info(id, el){
  // If Venue is not checked
  if ($('.block-venue input').is(':checked') == false) {
    // hide the venue fields
    $('.block-'+id).addClass('display-none');
    return 'skip';
  } else {
    // show the venue fields
    $('.block-'+id).removeClass('display-none');
    return el.val();
  }
}


function get_community_list_data(id, el, group){

  // Find all the elements that have the .community_list class
  if ($(el).hasClass('community_list')) {
    var output = ""; // setting the output variable
    var i = 0; // count starts at 0

    // For each element that has the "group" class [community_list_1]
    $('*[class$="'+group+'"]').each(function(i, e) {
      var data = $(e).val(); // get the value from the field
      var block_id = $(this).data('block'); // gets the id or front matter key
      var data_type = $(this).data('block-data_type'); // gets the data_type
      if (data) {
        // Run only on the first iteraton of the each
        if (i == 0) {
          output += "  - " + block_id + ": "+ $.trim(data) + "\n";
        } else {
          // console.log(data_type + " --- " + data);
          if (data_type == "string") {
            output += '    ' + block_id + ': "'+ data + '"\n';
          } else {
            output += '    ' + block_id + ': '+ data + '\n';
          }
        }
        i++;
      }
    });
   return output;
  }
}


function slugify() {
  var base = $('.block-'+base_field +' input').val();
  var small_words = /\band |\bthe |\bare |\bis |\bof |\bto /gi;
  var slug = base.replace(new RegExp(small_words, "gi"), '');
  var output = slug.split(" ").splice(0,6).join(" ");
  output = output.replace(/[^a-zA-Z0-9\s]/g, "");
  output = output.toLowerCase();
  output = output.replace(/\s\s+/g, " ");
  output = output.trim();
  return output;
}

function encodeEntities(input) {
  var entityPattern = /[&<>"'’`)(=+*@$%\/]/g;

  var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    "’": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
    '*': '&#42;',
    '$': '&#36;',
    '%': '&#37;',
    '(': '&#40;',
    ')': '&#41;',
    '+': '&#43;',
    '@': '&#64;',
    '-': '&#8208;',
    '–': '&#8211;',
    '—': '&#8212;'
  };
  input.replace(entityPattern, function (s) {
    return entityMap[s];
  });
}


// Hide and show the Source and source_url fields
if ($('#card_display_dg').is(':checked') == true) {
  $(".block-source, .block-source_url").addClass('display-none');
  // update_matter();
}

$('#card_display input').click(function() {
  if($(this).is(':checked')){
    var val = $(this).val();
    if (val == 'card_display_dg') {
      $(".block-source, .block-source_url").addClass('display-none');
    } else {
      $(".block-source, .block-source_url").removeClass('display-none');
    }
    update_matter();
  }
});

// Venue information
$('.block-venue input').change(function() {
  update_matter();
});

jQuery(document).ready(function ($) {

  $(".btn-copy").click(function(e) {
	  e.preventDefault();
	});
	var clipboard = new ClipboardJS('.btn-copy');
	clipboard.on('success', function(e) {
	   console.log(e);
	});
	clipboard.on('error', function(e) {
	   console.log(e);
	});


});

jQuery(document).ready(function($) {

	// Settings for the Select2 integration
	// https://select2.org/
	// This is what we are using to make it possible to pull topics from the TOPICS API and make them searchable and editable in the interface
	// It is not easy...

	$(".block-topics select").select2({
	  tags: true,
	  width: 'element',
	  closeOnSelect: false,
	  tokenSeparators: [',', ' '],
	  createTag: function (params) {
	    // Don't offset to create a tag if there is no @ symbol
	    if (params.term.indexOf('@') === -1) {
	      // Return null to disable tag creation
	      return null;
	    }
	    return {
	      id: params.term,
	      text: params.term
	    }
	  }
	});
	$(".block-authors select").select2({
	  tags: true,
	  width: 'element',
	  closeOnSelect: false,
	  tokenSeparators: [',', ' '],
	  createTag: function (params) {
	    // Don't offset to create a tag if there is no @ symbol
	    if (params.term.indexOf('@') === -1) {
	      // Return null to disable tag creation
	      return null;
	    }
	    return {
	      id: params.term,
	      text: params.term
	    }
	  }
	});
	$(".block-source select").select2({
		minimumResultsForSearch: Infinity
	});

	// Why are we storing topics in local storage again?
	$(".block-topics select").append(sessionStorage.dg_topics).trigger('change');
	$(".block-authors select").append(sessionStorage.dg_authors).trigger('change');
	$(".block-source select").append(sessionStorage.dg_sources).trigger('change');

});

jQuery(document).ready(function ($) {


});

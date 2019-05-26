var content_type = $('form').data('content_type');
var base_field = $('form').data('base_field');

// NEW date
// var date = new Date();


// returns the year and month for use in the filepath on GitHub
// Returns: 2019/09
function file_yearmo() {
  var dateInput = $("#block-date input").val().match(/^[^\s]+/);
  var dateObj = new Date(dateInput);
  var year = dateObj.getUTCFullYear();
  var month = ("0" + (dateObj.getUTCMonth() + 1)).slice(-2); //months from 1-12
  var yearmo = year + "/" + month + "/";

  return yearmo;
}
// returns the year and month for use in the filepath in the front matter
// Returns: 2019/09/01
function file_yearmoday() {
  if ($("#block-date input").length > 0) {
    var dateInput = $("#block-date input").val().match(/^[^\s]+/);
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

  // For each field in the editor...
  $('*[data-block]').each(function(){
		var id = $(this).data('block'); // gets the id
		var data_type = $(this).data('block-data_type'); // gets the data_type
		var comment = $(this).data('block-comment') !== "" ? '\n# ' + $(this).data('block-comment') + '\n' : ""; // gets the comment

    // Process the text
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

	});
  post_matter += "\n\n# Make it better ♥\n";
  post_matter += "---";

  $("#post-matter").html(post_matter);
  $("#newfile").attr('href', get_github_url(post_matter));
}


function process_text(id, el){
  // console.log(id);
  // console.log(el);
  if (id == base_field) {
    return el.val();
  } else if (id == 'authors') {
    return make_yaml_list($('#block-authors select').val());
  } else if (id == 'topics'){
    return make_yaml_list($('#block-topics select').val());
  } else if (id == 'source') {
    if ($('#block-'+id).hasClass('display-none') == true) {
      return 'skip';
    } else {
      return el.val();
    }
  } else if (id == 'source_url') {
    if ($('#block-'+id).hasClass('display-none') == true) {
      return 'skip';
    } else {
      return el.val();
    }
  } else if (id == 'branch') {
    return 'skip';
  } else if (id == 'date') {
    var time = $('#block-time input').val();
    return el.val() + ' ' + time;
  } else if (id == 'end_date') {
    var time = $('#block-end_time input').val();
    return el.val() + ' ' + time;
  } else if (id == 'time') {
    return 'skip';
  } else if (id == 'end_time') {
    return 'skip';
  } else if (id == 'slug') {
    var slug = slugify();
    $(el).val(slug);
    return slug;
  } else if (id == 'uid') {
    var uid = slugify();
    $(el).val(uid);
    return uid;
  } else if (id == 'filename') {
    var slug = slugify();
    var filename = slug + '.md';
    $('#filename').text(filename);
    return 'skip';
  } else if (id == 'filename-dated') {
    var slug = slugify();
    var date = $('#block-date input').val();
    var filename = date + '-' + slug + '.md';
    $('#filename').text(filename);
    return 'skip';
  } else if (id == 'venue') {
    return 'skip';
  } else if (id == 'venue_name' || id == 'room' || id == 'address' || id == 'city' || id == 'state' || id == 'country' || id == 'zip' || id == 'map') {
    return get_venue_info(id, el);
  } else {
    return el.val();
  }
}

function make_yaml_list(items) {
  var output = "\n";
  $.each( items, function( i, e ) {
    if (i === items.length - 1) {
      output += "  - " + $.trim(e);
    } else {
      output += "  - " + $.trim(e) + "\n";
    }
  });
  return output;
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
  var base_url = "https://github.com/GSA/digitalgov.gov/new/"+get_edit_branch()+"/content/"+content_type+"/";
  var commit_msg = "New "+ content_type +": " + ($('#block-'+base_field +' input').val()).trim();
  var commit_desc = "";
  if ($("#block-deck textarea").length) {
    var commit_desc = ($("#block-deck textarea").val()).trim();
  }

  if (content_type == 'posts' || content_type == 'events') {
    base_url += file_yearmo() + 'draft?filename=' + get_filename() + '&value=' + encodeURIComponent(post_matter) + '&message=' + encodeURIComponent(commit_msg) + '&description=' + encodeURIComponent(commit_desc) + '&target_branch=' + get_edit_branch();
  } else if (content_type == 'authors' || content_type == 'topics') {
    base_url += slugify() + '/draft?filename=_index.md' + '&value=' + encodeURIComponent(post_matter) + '&message=' + encodeURIComponent(commit_msg) + '&description=' + encodeURIComponent(commit_desc) + '&target_branch=' + get_edit_branch();
    console.log(base_url);
  } else {
    base_url += 'draft?filename=' + get_filename() + '&value=' + encodeURIComponent(post_matter) + '&message=' + encodeURIComponent(commit_msg) + '&description=' + encodeURIComponent(commit_desc) + '&target_branch=' + get_edit_branch();
  }
  return base_url;
}


function get_venue_info(id, el){
  // If Venue is not checked
  if ($('#block-venue input').is(':checked') == false) {
    // hide the venue fields
    $('#block-'+id).addClass('display-none');
    return 'skip';
  } else {
    // show the venue fields
    $('#block-'+id).removeClass('display-none');
    return el.val();
  }
}


function slugify() {
  var base = $('#block-'+base_field +' input').val();
  var small_words = /\band |\bthe |\bare |\bis |\bof |\bto /gi;
  var slug = base.replace(new RegExp(small_words, "gi"), '');
  var output = slug.split(" ").splice(0,6).join(" ");
  output = output.replace(/[^a-zA-Z0-9\s]/g, "");
  output = output.toLowerCase();
  output = output.replace(/\s\s+/g, " ");
  output = output.trim();
  output = output.replace(/\s/g, "-");
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
  $("#block-source, #block-source_url").addClass('display-none');
  update_matter();
}

$('#card_display input').click(function() {
  console.log('yes');
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

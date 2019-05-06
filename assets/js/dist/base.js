jQuery(document).ready(function ($) {

  var content_type = $('form').data('content_type');

  // NEW date
  var date = new Date();

  // Get date — set to +1 date in the future
  var yearmoday = `${date.getFullYear()}-${('0' + (date.getMonth()+1)).slice(-2)}-${('0' + (date.getDate()+1)).slice(-2)}`;

  // Get current time — not being used at the moment
  var time = `${date.getHours()}:${(date.getMinutes()<10?'0':'') + '00'}`;
  var time_end = `${date.getHours()+1}:${(date.getMinutes()<10?'0':'') + '00'}`;
  // Set time to 9am ET — our daily pub time
  // var time = '09:00';

  // returns the year and month for use in the filepath on GitHub
  // Returns: 2017/09
  function file_yearmo() {
    var dateInput = $("#block-date input").val().match(/^[^\s]+/);
    var dateObj = new Date(dateInput);
    var year = dateObj.getUTCFullYear();
    var month = ("0" + (dateObj.getUTCMonth() + 1)).slice(-2); //months from 1-12
    var yearmo = year + "/" + month + "/";

    return yearmo;
  }

  // Insert the time into the time fields
  $("#block-date input, #block-date-end input").val(yearmoday);
  $("#block-time input").val(time);
  $("#block-time-end input").val(time_end);

  $('#block-event_organizer input').val('Digital.gov');


  update_matter();

  $("input").keyup(update_matter);
  $("textarea").keyup(update_matter);
  $("select").on("select2:select select2:unselect", function(e) {
    update_matter();
  });

  function update_matter(){
    var post_matter = "";
    var page_url_comment = get_page_url_comment();
    var branch = "demo";
    post_matter += "---";
    post_matter += page_url_comment;
    post_matter += "\n# Learn how to edit our pages at https://workflow.digital.gov\n";
    $('*[data-block]').each(function(){
  		var id = $(this).data('block'); // gets the id
  		var data_type = $(this).data('block-data_type'); // gets the data_type
  		var comment = $(this).data('block-comment') !== "" ? '\n# ' + $(this).data('block-comment') + '\n' : ""; // gets the comment
      console.log(id);
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
    post_matter += "\n\n# ♥♥♥ Make it better ♥♥♥\n";
    post_matter += "---";

    $("#post-matter").html(post_matter);
    $("#newfile").attr('href', get_github_url(post_matter));
  }


  function process_text(id, el){
    if (id == 'authors') {
      return cs2ds(el.select2('data'));
    } else if (id == 'topics'){
      return cs2ds(el.select2('data'));
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
    } else if (id == 'date-end') {
      var time = $('#block-time-end input').val();
      return el.val() + ' ' + time;
    } else if (id == 'time') {
      return 'skip';
    } else if (id == 'time-end') {
      return 'skip';
    } else if (id == 'title') {
      return el.val();
    } else if (id == 'slug') {
      var title = $('#block-title input').val();
      var slug = title.replace(new RegExp(small_words, "gi"), '');
      var slug = slugify(slug);
      $(el).val(slug);
      return slug;
    } else if (id == 'filename') {
      var title = $('#block-title input').val();
      var slug = title.replace(new RegExp(small_words, "gi"), '');
      var slug = slugify(slug);
      var filename = slug + '.md';
      $('#filename').text(filename);
      return 'skip';
    } else if (id == 'filename-dated') {
      var title = $('#block-title input').val();
      var slug = title.replace(new RegExp(small_words, "gi"), '');
      var slug = slugify(slug);
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

  function cs2ds(tax) {
    var output = "\n";
    $.each( tax, function( i, e ) {
      if (i === tax.length - 1) {
        output += "  - " + $.trim(e.id);
      } else {
        output += "  - " + $.trim(e.id) + "\n";
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

  function get_page_url_comment(){
    var slug = $('#block-slug input').val();
    var comment = "\n# View this page at https://digital.gov/" + file_yearmo() + slug;
    return comment;
  }


  function get_github_url(post_matter) {
    var base_url = "https://github.com/GSA/digitalgov.gov/new/"+get_edit_branch()+"/content/"+content_type+"/"
    var commit_msg = "New "+ content_type +": " + ($("#block-title input").val()).trim();
    var commit_desc = ($("#block-deck textarea").val()).trim();

    if (content_type == 'posts' || content_type == 'events') {
      base_url += file_yearmo() + 'draft?filename=' + get_filename() + '&value=' + encodeURIComponent(post_matter) + '&message=' + encodeURIComponent(commit_msg) + '&description=' + encodeURIComponent(commit_desc) + '&target_branch=' + get_edit_branch();
    } else {
      base_url += 'draft?filename=' + get_filename() + '&value=' + encodeURIComponent(post_matter) + '&message=' + encodeURIComponent(commit_msg) + '&description=' + encodeURIComponent(commit_desc) + '&target_branch=' + get_edit_branch();
    }
    return base_url;
  }

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


  var small_words = /\band |\bthe |\bare |\bis |\bof |\bto /gi;

  function slugify(input) {
    var output = input.split(" ").splice(0,6).join(" ");
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
      console.log(entityMap[s]);
      return entityMap[s];
    });
  }


});

jQuery(document).ready(function ($) {

});

jQuery(document).ready(function ($) {


});

jQuery(document).ready(function ($) {

  // NEW date
  var date = new Date();

  // Get date — set to +1 date in the future
  var yearmoday = `${date.getFullYear()}-${('0' + (date.getMonth()+1)).slice(-2)}-${('0' + (date.getDate()+1)).slice(-2)}`;

  // Get current time — not being used at the moment
  var time = `${date.getHours()}:${(date.getMinutes()<10?'0':'') + date.getMinutes()}`;
  // Set time to 9am ET — our daily pub time
  var time = '09:00';

  // returns the year and month for use in the filepath on GitHub
  // Returns: 2017/09
  function file_yearmo(date) {
    var dateObj = new Date(date);
    var year = dateObj.getUTCFullYear();
    var month = ("0" + (dateObj.getUTCMonth() + 1)).slice(-2); //months from 1-12
    var yearmo = year + "/" + month + "/";
    return yearmo;
  }

  $("#block-date input").val(yearmoday);


  update_matter();
  $("input").keyup(update_matter);
  $("textarea").keyup(update_matter);
  $("select").on("select2:select select2:unselect", function(e) {
    update_matter();
  });

  function update_matter(){
    var post_matter = "";
    var branch = "demo";
    post_matter += "---";
    $('*[data-block]').each(function(){
      var node = $(this).prop('nodeName');
  		var id = $(this).data('block'); // gets the id
  		var data_type = $(this).data('block-data_type'); // gets the data_type
  		var comment = $(this).data('block-comment') !== "" ? '\n# ' + $(this).data('block-comment') + '\n' : ""; // gets the comment
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
    post_matter += "\n\n---";
    
    $("#post-matter").html(post_matter);
    $("#newfile").attr('href', get_github_url(post_matter));
  }


  function process_text(id, el){
    if (id == 'authors') {
      return cs2ds(el.select2('data'));
    } else if (id == 'topics'){
      return cs2ds(el.select2('data'));
    } else if (id == 'branch') {
      return 'skip';
    } else if (id == 'date') {
      return el.val() + ' ' + time;
    } else if (id == 'title') {
      return el.val();
    } else if (id == 'slug') {
      var title = $('#block-title input').val();
      var slug = title.replace(new RegExp(small_words, "gi"), '');
      var slug = slugify(slug);
      $(el).val(slug);
      return slug;
    } else if (id == 'filename') {
      var slug = $('#block-slug input').val();
      var filename = slug + '.md';
      $('#filename').text(filename);
      return 'skip';
    } else if (id == 'filename-dated') {
      var slug = $('#block-slug input').val();
      var date = $('#block-date input').val();
      var filename = date + '-' + slug + '.md';
      $('#filename').text(filename);
      return 'skip';
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

  function get_github_url(post_matter) {
    var branch = 'demo';
    var filename = $('#filename').text();
    var dateInput = $("#block-date input").val().match(/^[^\s]+/);
    var content_type = $('[data-content_type]').data('content_type');
    var github_url = "https://github.com/GSA/digitalgov.gov/new/"+branch+"/content/"+content_type+"/";
    var commit_msg = "New "+ content_type +": " + ($("#block-title input").val()).trim();
    var commit_desc = ($("#block-deck textarea").val()).trim();


    if (content_type == 'blog_post' || content_type == 'events') {
      github_url += file_yearmo(dateInput[0]) + 'draft?filename=' + filename + '&value=' + encodeURIComponent(post_matter) + '&message=' + encodeURIComponent(commit_msg) + '&description=' + encodeURIComponent(commit_desc) + '&target_branch=' + branch;
    } else {
      github_url += 'draft?filename=' + filename + '&value=' + encodeURIComponent(post_matter) + '&message=' + encodeURIComponent(commit_msg) + '&description=' + encodeURIComponent(commit_desc) + '&target_branch=' + branch;
    }
    return github_url;
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

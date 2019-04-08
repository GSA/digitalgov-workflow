jQuery(document).ready(function ($) {
  var entityPattern = /[&<>"'`)(=+:*@.?$%\/]/g;
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
    var entityMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
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
    return input.replace(entityPattern, function (s) {
      return entityMap[s];
    });
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
  function update() {
    $content_type = $("#newfile").attr('data-content_type');
    var small_words = /\band |\bthe |\bare |\bis |\bof |\bto /gi;
    var filename = "";
    var post_matter = "";
    var url = "";
    var title = ($('#headline-input').hasClass('display-none')) ? "" : `\ntitle: '${encodeEntities($("#headline-input input").val()).trim()}'\n`;
    var sources_select = ($('#sources_select').hasClass('display-none')) ? "" : `\n# What source published this?\nsource: '${$("#sources_select select").select2('data')[0].id}'\n`;
    var sourceoftruth = ($('#sourceoftruth').hasClass('display-none')) ? "" : `\n# What is the URL for this product or service?\n# Note: We'll add a ?dg to the end of the URL in the code for tracking purposes\nsourceoftruth: '${$("#sourceoftruth input").val()}'\n`;
    var commit_msg = "new "+ $content_type +": " + `${encodeEntities($("#headline-input input").val()).trim()}`;
    var commit_desc = `${encodeEntities($("#deck-input textarea").val()).trim()}`;
    var branch = "demo";


    var slug = $("#headline-input input").val();
    slug = slug.replace(new RegExp(small_words, "gi"), '');
    slug = slugify(slug);

    var dateInput = $("#date-input input").val().match(/^[^\s]+/);
    if ($content_type == 'news' || $content_type == 'events') {
      filename += dateInput[0];
      filename += "-";
    }
    filename += slug
    filename += ".md";

    post_matter += "---\n";
    post_matter += `slug: ${slug}\n`;
    post_matter += `date: ${dateInput[0]} ${$("#time-input input").val()}:00 -0500\n`;
    post_matter += title;
    post_matter += `deck: '${encodeEntities($("#deck-input textarea").val()).trim()}'\n`;
    post_matter += `summary: '${encodeEntities($("#summary-input textarea").val()).trim()}'\n`;
    post_matter += `authors: ${cs2ds($("#people_select select").select2('data'))}\n`;
    post_matter += `\n# Topics that best describe this product or service\ntopics: ${cs2ds($("#topic_select select").select2('data'))}\n`;
    post_matter += sources_select;
    post_matter += sourceoftruth;
    post_matter += "\n---";


    url += "https://github.com/GSA/digitalgov.gov/new/"+branch+"/content/"+$content_type+"/";
    if ($content_type == 'news' || $content_type == 'events') {
      url += file_yearmo(dateInput[0]) + 'draft?filename=' + filename + '&value=' + encodeURIComponent(post_matter) + '&message=' + encodeURIComponent(commit_msg) + '&description=' + encodeURIComponent(commit_desc) + '&target_branch=' + branch;
    } else {
      url += 'draft?filename=' + filename + '&value=' + encodeURIComponent(post_matter) + '&message=' + encodeURIComponent(commit_msg) + '&description=' + encodeURIComponent(commit_desc) + '&target_branch=' + branch;
    }

    $("#filename").html(filename);
    $("#post-matter").html(post_matter);
    $("#newfile").attr('href', url);
  }

  // Date entry
  var date = new Date();
  $("#date-input input").val(`${date.getFullYear()}-${('0' + (date.getMonth()+1)).slice(-2)}-${('0' + (date.getDate()+1)).slice(-2)}`);
  $("#time-input input").val(`${date.getHours()}:${(date.getMinutes()<10?'0':'') + date.getMinutes()}`);
  update();

  $("input").keyup(update);
  $("textarea").keyup(update);
  $('#topic_select select').on("select2:select select2:unselect", function(e) {
    update();
  });
  $('#people_select select').on("select2:select select2:unselect", function(e) {
    update();
  });
  $('#sources_select select').on("select2:select select2:unselect", function(e) {
    update();
  });



  $(".btn-copy").click(function(e) {
	  e.preventDefault();
	});


  $('#card_display input').click(function() {
    if($(this).is(':checked')){
      var val = $(this).val();
      if (val == 'card_display_dg') {
        $("#sources_select, #sourceoftruth").addClass('display-none');
      } else {
        $("#sources_select, #sourceoftruth").removeClass('display-none');
      }
      if (val == 'card_display_elsewhere'){
        $("#post #headline-input, #post #summary-input").addClass('display-none');
      }
      else {
        $("#post #headline-input, #post #summary-input").removeClass('display-none');
      }
      update();
    }
  });

  $('#event_type input').click(function() {
    console.log(this);
    if($(this).is(':checked') && $(this).val() == "event-in-person"){
      $(".venue").removeClass('display-none');
    } else {
      $(".venue").addClass('display-none');
    }
    if($(this).is(':checked') && $(this).val() == "event-online"){
      $(".online").removeClass('display-none');
    } else {
      $(".online").addClass('display-none');
    }
    update();
  });


  function get_sources_select(){
    return post_matter += `\nsource: ${cs2ds($("#sources_select select").select2('data'))}\n`;
  }
  function get_sourceoftruth(){
    return post_matter += `sourceoftruth: '${$("#sourceoftruth-input input").val()}'\n`;
  }


  // returns the year and month for use in the filepath on GitHub
  // Returns: 2017/09
  function file_yearmo(date) {
    var dateObj = new Date(date);
    var year = dateObj.getUTCFullYear();
    var month = ("0" + (dateObj.getUTCMonth() + 1)).slice(-2); //months from 1-12
    var yearmo = year + "/" + month;
    return yearmo;
  }

});

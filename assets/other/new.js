jQuery(document).ready(function ($) {
  var entityPattern = /[&<>"'`)(=+:*@.?$%\/]/g;
  function slugify(input) {
    var output = input;
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
      ':': '&#58;',
      '.': '&#46;',
      '(': '&#40;',
      ')': '&#41;',
      '+': '&#43;',
      '@': '&#64;',
      '-': '&#8208;',
      '–': '&#8211;',
      '—': '&#8212;',
      '?': '&#63;'
    };
    return input.replace(entityPattern, function (s) {
      return entityMap[s];
    });
  }
  function cs2ds(input) {
    var list = input.split(",");
    var output = "\n";
    $.each(list, function (key, value) {
      slug = value.replace(entityPattern, " ").trim();
      slug = slug.replace(/[^a-z0-9]/gi, "-").toLowerCase();
      if (key === list.length - 1) {
        output += "  - " + $.trim(slug);
      } else {
        output += "  - " + $.trim(slug) + "\n";
      }
    });
    return output;
  }
  function update() {
    var small_words = /\band |\bthe |\bare |\bis |\bof |\bto /gi;

    var filename = "";
    var post_matter = "";
    var url = "";
    var commit_msg = "hi";
    var commit_desc = "hi";
    var branch = "master";

    var slug = $("#headline-input").val();
    slug = slug.replace(new RegExp(small_words, "gi"), '');
    slug = slugify(slug);

    var dateInput = $("#date-input").val().match(/^[^\s]+/);
    filename += dateInput[0];
    filename += "-";
    filename += slug
    filename += ".md";

    post_matter += "---\n";
    post_matter += `slug: ${slug}\n`;
    post_matter += `date: ${dateInput[0]} ${$("#time-input").val()}:00 -0500\n`;
    post_matter += `title: '${encodeEntities($("#headline-input").val()).trim()}'\n`;
    post_matter += `deck: '${encodeEntities($("#deck-input").val()).trim()}'\n`;
    post_matter += `summary: '${encodeEntities($("#summary-input").val()).trim()}'\n`;
    post_matter += `authors: ${cs2ds($("#authors-input").val())}\n`;
    post_matter += `topics: ${cs2ds($("#tags-input").val())}\n`
    post_matter += "---";

    url += "https://github.com/GSA/digitalgov.gov/new/master/content/posts/";
    url += file_yearmo(dateInput[0]) + '/draft?filename=' + filename + '&value=' + encodeURIComponent(post_matter) + '&message=' + encodeURIComponent(commit_msg) + '&description=' + encodeURIComponent(commit_desc) + '&target_branch=' + branch;

    $("#filename").html(filename);
    $("#post-matter").html(post_matter);
    $("#newfile").attr('href', url);
  }

  var date = new Date();
  $("#date-input").val(`${date.getFullYear()}-${date.getMonth() < 10 ? " " + date.getMonth() : date.getMonth()}-${date.getDate() < 10 ? " " + date.getDate() : date.getDate()}`);
  $("#time-input").val(`${date.getHours()}:${(date.getMinutes()<10?'0':'') + date.getMinutes()}`);
  update();

  $("input").keyup(update);
  $("textarea").keyup(update);



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

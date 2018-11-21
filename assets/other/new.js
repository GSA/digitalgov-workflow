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
    post_matter += `summary: '${encodeEntities($("#summary-input").val()).trim()}'\n`;
    post_matter += `authors: ${cs2ds($("#authors-input").val())}\n`;
    post_matter += `categories: ${cs2ds($("#categories-input").val())}\n`;
    post_matter += `tag: ${cs2ds($("#tags-input").val())}\n`
    post_matter += "featured_image:\n";
    post_matter += `  uid: ${$("#image-uid-input").val()}\n`;
    post_matter += `  alt: '${$("#image-alt-input").val()}'\n`;
    post_matter += "---";

    url += "https://github.com/GSA/digitalgov.gov/new/master/content/posts/"
    var dateObject = new Date(dateInput[0]);
    url += dateObject.getUTCFullYear()
    url += "/"
    url += ("0" + (dateObject.getUTCMonth() + 1)).slice(-2);
    url += "/draft?filename=";
    url += filename;
    url += "&value=";
    url += encodeURIComponent(post_matter);
    url += "&message=";
    var title = encodeEntities($("#headline-input").val()).trim();
    url += "Add new post: " + title;
    url += "&description=";
    url += "**" + title + "** %0A";
    url += encodeEntities($("#summary-input").val()).trim() + "%0A";
    url += "---%0A";
    url += "slug: `" + slug + "`%0A";
    url += "filename: `" + filename + "`%0A";
    url += "---";
    url += "&target_branch=";
    url += "new-post-" + slug;

    $("#filename").html(filename);
    $("#post-matter").html(post_matter);
    $("#newfile").attr("href", url);
  }

  var date = new Date();
  $("#date-input").val(`${date.getFullYear()}-${date.getMonth() < 10 ? " " + date.getMonth() : date.getMonth()}-${date.getDate() < 10 ? " " + date.getDate() : date.getDate()}`);
  $("#time-input").val(`${date.getHours()}:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}`);
  update();

  $("input").keyup(update);
  $("textarea").keyup(update);
});
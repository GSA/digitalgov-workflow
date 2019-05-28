
function get_card(data, content, type){
	if (type == "list" && content == "events") {
		return display_page_card(data, content);
	} else if (type == "list" && content == "posts") {
		return display_page_card(data, content);
	} else if (type == "single" && content == "event") {
		return display_event_data(data.item[0]);
	} else if (type == "single" && content == "page") {
		return display_page_data(data.item[0], content);
	} else if (content == "authors") {
		return display_author_card(data, content);
	} else {
		return display_page_card(data, content);
	}
}

function display_page_data(e){
	var title = e.title;
  var summary = e.summary;
  var topics = format_topics(e.topics);
  var authors = e.authors;
  var date_modified = e.date_modified;
  var date = e.date;
  var editpathURL = e.editpathURL;
  var filename = e.filename;
  var filepath = e.filepath;
  var filepathURL = e.filepathURL;
  var branch = e.branch;
  var source = e.source;
  var source_url = e.source_url;
	if (source_url) {
		if (source) {
			var source_url = "<p class='margin-y-05 text-normal font-sans-3xs'><em><strong> via " +source+ "</strong> &#8594;  " +source_url+"</em></p>";
		} else {
			var source_url = "<p class='margin-y-05 text-normal font-sans-3xs'><em>&#8594; " +source_url+"</em></p>";
		}
	}
  var url = e.url;
  var sourceoftruth = encodeURI(source_of_truth);
  var card = [
		'<header class="bg-white padding-2 radius-sm">',
			'<h3 class="margin-0 margin-bottom-1">',
				'<a class="text-no-underline text-ink visited:text-ink" href="'+sourceoftruth+ url+'" title="'+title+'">'+title+'</a>',
			'</h3>',
			'<p class="margin-0 font-sans-2xs">'+summary+'</p>',
			'<p class="font-sans-3xs">',
				topics,
			'</p>',
			source_url,
		'</header>'
  ].join("\n");
	$( ".btn-edit" ).attr( 'href', editpathURL + "?message=Updated%20topics" );
	return card;
}

function display_page_card(e, content){
  var page_data = display_page_data(e);
  var editpathURL = e.editpathURL;
  var url = e.url;
  var sourceoftruth = encodeURI(source_of_truth);
  var card = [
    '<article class="margin-bottom-2">',
      '<div class="grid-row grid-gap-2">',
        '<div class="grid-col-12 tablet:grid-col-11">',
					page_data,
        '</div>',
        '<div class="grid-col-12 tablet:grid-col-1">',
          '<a class="margin-bottom-1 bg-primary hover:bg-primary-dark text-center text-no-underline padding-y-05 padding-x-05 display-block text-white font-sans-2xs visited:text-white hover:text-white radius-sm" href="'+editpathURL+'">edit file</a>',
					'<a class="margin-bottom-1 text-center text-no-underline padding-y-05 padding-x-05 display-block text-primary hover:text-primary-dark bg-white font-sans-2xs radius-sm border-primary border-width-1px border-solid" href="/edit/'+content+'/?page='+sourceoftruth+url+'">edit page</a>',
        '</div>',
      '</div>',
    '</article>'
  ].join("\n");
	$( ".btn-edit" ).attr( 'href', editpathURL + "?message=Updated%20topics" );
	return card;
}

function display_event_data(e){
	var title = e.title;
  var summary = e.summary;
  var topics = format_topics(e.topics);
  var authors = e.authors;
  var date_modified = e.date_modified;
  var date = e.date;
  var start_date = e.start_date;
  var start_time = e.start_date;
  var end_time = e.end_time;
  var editpathURL = e.editpathURL;
  var filename = e.filename;
  var filepath = e.filepath;
  var filepathURL = e.filepathURL;
  var branch = e.branch;
  var url = e.url;
  var sourceoftruth = encodeURI(source_of_truth);
  var card = [
		'<header class="bg-white padding-2 radius-sm">',
			'<h3 class="margin-0 margin-bottom-1">',
				'<a class="text-no-underline text-ink visited:text-ink" href="'+sourceoftruth+ url+'" title="'+title+'">'+title+'</a>',
			'</h3>',
			'<h5 class="margin-0 margin-bottom-105 text-light font-sans-md">'+start_date+' / '+start_time+' - '+end_time+'</h5>',
			'<p class="margin-0 font-sans-2xs">'+summary+'</p>',
			'<p class="font-sans-3xs">',
				topics,
			'</p>',
		'</header>'
  ].join("\n");
	$( ".btn-edit" ).attr( 'href', editpathURL + "?message=Updated%20topics" );
	return card;
}

function display_event_card(e){
	var page_data = display_event_data(e);
  var editpathURL = e.editpathURL;
  var url = e.url;
  var sourceoftruth = encodeURI(source_of_truth);
  var card = [
    '<article class="margin-bottom-105">',
      '<div class="grid-row grid-gap-2">',
        '<div class="grid-col-12 tablet:grid-col-11">',
					page_data,
        '</div>',
        '<div class="grid-col-12 tablet:grid-col-1">',
          '<a class="margin-bottom-1 bg-primary hover:bg-primary-dark text-center text-no-underline padding-y-05 padding-x-05 display-block text-white font-sans-2xs visited:text-white hover:text-white radius-sm" href="'+editpathURL+'">edit file</a>',
          '<a class="margin-bottom-1 text-center text-no-underline padding-y-05 padding-x-05 display-block text-primary hover:text-primary-dark bg-white font-sans-2xs radius-sm border-primary border-width-1px border-solid" href="/edit-topics/?page='+sourceoftruth+url+'">edit topics</a>',
        '</div>',
      '</div>',
    '</article>'
  ].join("\n");
	$( ".btn-edit" ).attr( 'href', editpathURL + "?message=Updated%20topics" );
	return card;
}



function display_author_card(e){
	console.log(e);
	if (e.github) {
		var author_data = author_updated(e);
	} else {
		var author_data = author_needs_update(e);
	}
	var edit_tools = author_edit_tools(e);
	var card = [
		'<article class="margin-bottom-105">',
			'<div class="grid-row grid-gap-2">',
				'<div class="grid-col-11">',
					author_data,
				'</div>',
				'<div class="grid-col-1">',
					edit_tools,
				'</div>',
			'</div>',
		'</article>'
	].join("\n");
	return card;
}

function author_edit_tools(e, content){
	console.log(e);
	console.log(e.uid);
	var uid = e.uid;
	console.log(e);
	var sourceoftruth = encodeURI(source_of_truth);
	var editpathURL = e.editpathURL;
	var tools = [
		'<a class="margin-bottom-1 bg-primary hover:bg-primary-dark text-center text-no-underline padding-y-05 padding-x-05 display-block text-white font-sans-2xs visited:text-white hover:text-white radius-sm" href="'+editpathURL+'">edit file</a>',
		'<a class="margin-bottom-1 text-center text-no-underline padding-y-05 padding-x-05 display-block text-primary hover:text-primary-dark bg-white font-sans-2xs radius-sm border-primary border-width-1px border-solid" href="/edit/'+content+'/?page='+sourceoftruth+url+'">edit page</a>',
	].join("\n");
	return tools;
}

function author_updated(e){
	var uid = e.uid;
	var agency = e.agency;
	var agency_full_name = e.agency_full_name;
	var email = e.email;
	var bio = jQuery.trim(e.bio).substring(0, 100).trim(this) + "...";
	var display_name = e.display_name;
	var email = e.email;
	var first_name = e.first_name;
	var last_name = e.last_name;
	var github = e.github;
	var location = (e.location) ? e.location+' | ' : "";
	var quote = e.quote;
	var twitter = e.twitter;
	var linkedin = e.linkedin;
	var facebook = e.facebook;
	var youtube = e.youtube;
	var sourceoftruth = encodeURI(source_of_truth);
	var card = [
		'<header class="bg-white padding-2 radius-sm">',
			'<div class="grid-row grid-gap-2">',
				'<div class="grid-col-2">',
					'<img class="circle-9 border-05 border-base-lighter" src="https://github.com/'+github+'.png?size=100" srcset="https://www.github.com/'+github+'.png?size=200" alt="Photo: '+display_name+'">',
				'</div>',
				'<div class="grid-col-10">',
					'<h3 class="margin-0 margin-bottom-05">',
						'<a class="text-no-underline text-ink visited:text-ink" href="'+sourceoftruth+'/authors/'+uid+'" title="'+display_name+'">'+display_name+'</a>',
					'</h3>',
					'<p class="margin-0 font-sans-2xs">'+location+' '+agency+'</p>',
					'<p class="margin-0 font-sans-2xs"><a class="text-no-underline" href="mailto:'+email+'">'+email+'</a></p>',
					'<p class="margin-0 font-sans-2xs">'+bio+'</p>',
				'</div>',
			'</div>',
		'</header>'
	].join("\n");
	return card;
}

function author_needs_update(e){
	var uid = e.uid;
	var agency = e.agency;
	var agency_full_name = e.agency_full_name;
	var email = e.email;
	var bio = jQuery.trim(e.bio).substring(0, 100).trim(this) + "...";
	var display_name = e.display_name;
	var email = e.email;
	var first_name = e.first_name;
	var last_name = e.last_name;
	var github = e.github;
	var location = (e.location) ? e.location+' | ' : "";
	var quote = e.quote;
	var twitter = e.twitter;
	var linkedin = e.linkedin;
	var facebook = e.facebook;
	var youtube = e.youtube;
	var sourceoftruth = encodeURI(source_of_truth);
	var card = [
		'<header class="bg-white padding-2 radius-sm">',
			'<h3 class="margin-0 margin-bottom-05">',
				'<a class="text-no-underline text-ink visited:text-ink" href="'+sourceoftruth+'/authors/'+uid+'" title="'+display_name+'">'+display_name+'</a>',
			'</h3>',
			'<p class="margin-0 font-sans-2xs">'+location+' '+agency+'</p>',
			'<p class="margin-0 font-sans-2xs"><a class="text-no-underline" href="mailto:'+email+'">'+email+'</a></p>',
			'<p class="margin-0 font-sans-2xs">'+bio+'</p>',
		'</header>'
	].join("\n");
	return card;
}


function format_topics(data){
	var topics = "";
	$.each( data, function( i, e ) {
		var topic = [
			'<span class="bg-gray-5 margin-bottom-05 padding-x-1 display-inline-block line-height-sans-1 padding-y-05 radius-md bg-secondary-lighter">'+e+'</span> '
		].join("\n");
		topics += topic;
	});
	return topics;
}


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
					'<a class="margin-bottom-1 text-center text-no-underline padding-y-05 padding-x-05 display-block bg-primary-vivid hover:bg-primary-dark text-white visited:text-white hover:text-white font-sans-sm text-semibold radius-md border-primary-vivid border-width-1px border-solid" href="/edit/'+content+'/?page='+sourceoftruth+url+'">edit</a>',
		      '<a class="margin-bottom-1 text-primary-darkest hover:text-primary-darker bg-white text-center text-no-underline padding-y-05 padding-x-05 display-block font-sans-md radius-md" href="'+editpathURL+'"><i class="fab fa-github"></i></a>',
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


// Not being used at the moment. Events are rendered with display_page_card()
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



function display_author_card(e, content){
	if (e.github) {
		var author_data = author_updated(e);
	} else {
		// var author_data = author_needs_update(e);
		var author_data = author_updated(e);
	}
	var edit_tools = author_edit_tools(e, content);
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
	var uid = e.uid;
	var sourceoftruth = encodeURI(source_of_truth);
	var editpathURL = e.editpathURL;
	var url = e.url;
	var tools = [
		'<a class="margin-bottom-1 text-center text-no-underline padding-y-05 padding-x-05 display-block bg-primary-vivid hover:bg-primary-dark text-white visited:text-white hover:text-white font-sans-sm text-semibold radius-md border-primary-vivid border-width-1px border-solid" href="/edit/'+content+'/?page='+sourceoftruth+url+'">edit</a>',
		'<a class="margin-bottom-1 text-primary-darkest hover:text-primary-darker bg-white text-center text-no-underline padding-y-05 padding-x-05 display-block font-sans-md radius-md" href="'+editpathURL+'"><i class="fab fa-github"></i></a>',
	].join("\n");
	return tools;
}

function author_updated(e){
	var uid = e.uid;
	var display_name = e.display_name;
	var first_name = e.first_name;
	var last_name = e.last_name;
	var pronoun = (e.pronoun) ? e.pronoun : '';
	if (e.agency) {
		var agency = ' | '+e.agency;
	} else {
		var agency = "";
	}
	var agency_full_name = e.agency_full_name;
	if (e.email){
		var email = '<p class="margin-0 font-sans-2xs"><a class="text-no-underline" href="mailto:'+e.email+'">'+e.email+'</a></p>';
	} else {
		var email = "";
	}
	if (e.bio) {
		var bio = jQuery.trim(e.bio).substring(0, 100).trim(this) + "...";
	} else {
		var bio = "";
	}
	if (e.location) {
		var loc = '<p class="margin-0 font-sans-xs">'+e.location+' '+agency+'</p>';
	} else {
		var loc = "";
	}
	if (e.github) {
		var profile_img = 'https://github.com/'+e.github+'.png?size=100" srcset="https://www.github.com/'+e.github+'.png?size=200';
	} else {
		var profile_img = 'https://demo.digital.gov/img/digit-light.png';
	}
	var quote = e.quote;
	var twitter = e.twitter;
	var linkedin = e.linkedin;
	var facebook = e.facebook;
	var youtube = e.youtube;
	var sourceoftruth = encodeURI(source_of_truth);
	var card = [
		'<article class="bg-white padding-2 radius-sm display-flex">',
			'<div>',
				'<img class="circle-8 margin-right-2 border-2px border-base-light" src="'+profile_img+'" alt="Photo: '+display_name+'">',
			'</div>',
			'<div>',
				'<h3 class="margin-0 margin-bottom-05 font-sans-md">',
					'<a class="text-no-underline text-ink visited:text-ink" href="'+sourceoftruth+'/authors/'+uid+'" title="'+display_name+'">'+display_name+' '+pronoun+'</a>',
				'</h3>',
				loc,
				email,
				'<p class="margin-0 font-sans-xs">'+bio+'</p>',
			'</div>',

		'</article>'
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

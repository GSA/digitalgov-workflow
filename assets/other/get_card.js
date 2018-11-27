
function get_card(data, type){
	if (data.content == "author" || type == "author") {
		return display_author_card(data);
	} else {
		return display_page_card(data);
	}
}

function display_page_card(data){
	$.each( data.item, function( key, file ) {
		$( "article.card .title" ).html( file['title'] );
		$( "article.card .summary" ).html( file['summary'] );
		$( "article.card .date_published" ).html( file['date_published'] );
		$( "article.card .authors" ).html( file['authors'] );
		$( "article.card .edit-btn" ).attr( 'href', file['editpathURL'] );
		$( ".btn-edit" ).attr( 'href', file['editpathURL'] + "?message=Updated%20topics" );
	});
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
			'<div class="grid-row grid-gap-1">',
				'<div class="grid-col-10">',
					author_data,
				'</div>',
				'<div class="grid-col-2">',
					edit_tools,
				'</div>',
			'</div>',
		'</article>'
	].join("\n");
	return card;
}

function author_edit_tools(e){
	var uid = e.uid;
	var source_url = encodeURI(source_of_truth);
	var tools = [
		'<a class="margin-bottom-1 bg-primary hover:bg-primary-dark text-center text-no-underline padding-y-05 padding-x-05 display-block text-white font-sans-2xs visited:text-white hover:text-white radius-sm" href="https://github.com/GSA/digitalgov.gov/edit/demo/data/people/authors/'+uid+'.yml">edit profile</a>'
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
	var source_url = encodeURI(source_of_truth);
	var card = [
		'<header class="bg-white padding-2 radius-sm">',
			'<div class="grid-row grid-gap-2">',
				'<div class="grid-col-2">',
					'<img class="circle-9 border-05 border-base-lighter" src="https://github.com/'+github+'.png?size=100" srcset="https://www.github.com/'+github+'.png?size=200" alt="Photo: '+display_name+'">',
				'</div>',
				'<div class="grid-col-10">',
					'<h3 class="margin-0 margin-bottom-05">',
						'<a class="text-no-underline text-ink visited:text-ink" href="'+source_url+'/authors/'+uid+'" title="'+display_name+'">'+display_name+'</a>',
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
	console.log('old');
	console.log(e);
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
	var source_url = encodeURI(source_of_truth);
	var card = [
		'<header class="bg-white padding-2 radius-sm">',
			'<h3 class="margin-0 margin-bottom-05">',
				'<a class="text-no-underline text-ink visited:text-ink" href="'+source_url+'/authors/'+uid+'" title="'+display_name+'">'+display_name+'</a>',
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

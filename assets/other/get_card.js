
function get_card(data){
	console.log(data);
	if (data.content == "author") {
		display_author_updated(data);
	} else {
		display_page_card(data);
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

function display_author_updated(e){
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
	var location = e.location;
	var quote = e.quote;
	var twitter = e.twitter;
	var linkedin = e.linkedin;
	var facebook = e.facebook;
	var youtube = e.youtube;
	var topics = format_topics(e.topics);
	var source_url = encodeURI(source_of_truth);
	var article = [
		'<article class="margin-bottom-105">',
			'<div class="grid-row grid-gap-1">',
				'<div class="grid-col-11">',
					'<header class="bg-white padding-2 radius-sm">',
						'<div class="grid-row grid-gap-2">',
							'<div class="grid-col-2">',
								'<img class="circle-9 border-05 border-base-lighter" src="https://github.com/'+github+'.png?size=100" srcset="https://www.github.com/'+github+'.png?size=200" alt="Photo: '+display_name+'">',
							'</div>',
							'<div class="grid-col-10">',
								'<h3 class="margin-0 margin-bottom-05">',
									'<a class="text-no-underline text-ink visited:text-ink" href="'+source_url+'/authors/'+uid+'" title="'+display_name+'">'+display_name+'</a>',
								'</h3>',
								'<p class="margin-0 font-sans-2xs">'+location+' | '+agency+'</p>',
								'<p class="margin-0 font-sans-2xs"><a class="text-no-underline" href="mailto:'+email+'">'+email+'</a></p>',
								'<p class="margin-0 font-sans-2xs">'+bio+'</p>',
								'<p class="font-sans-3xs">',
									topics,
								'</p>',
							'</div>',
						'</div>',
					'</header>',
				'</div>',
			'</div>',
		'</article>'
	].join("\n");
	$('.card').html(article);
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

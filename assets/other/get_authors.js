jQuery(document).ready(function($) {

	// Look for the '.article-list' element on the page
  var el = $('.card-list')
  // Get the data-api ID
	var api_id = $(el).data('api');

  // Look through content_types JSON and find the object that has the ID that has the same api_id
  // NOTE: The content_types object is set in the <head> of each page
  jQuery.grep(content_types, function(obj) {
    if(obj.id === api_id){
      api_path = obj.api;
    }
  });
	console.log(api_path);
  // Now that we have the api_path,...
  if (api_path) {
    // Let's get the API + data
    var get_pages = (function() {
      $.ajax({
    	  url: api_path,
    	 	dataType: 'json',
    	}).done(function(data) {
        // Wait until all of the API data is retrieved
				console.log(data);
				display_card(data);
      });
    })();
  }

	function display_card(data){
    $.each( data.items, function( i, obj ) {
			$.each( obj, function( i, e ) {
				if (e.github) {
					author_updated(e);
				} else {
					// author_needs_update(e);
				}
			});
    });
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
					'<div class="grid-col-12 tablet:grid-col-10">',
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
					'<div class="grid-col-12 tablet:grid-col-2">',
						'<a class="margin-bottom-1 bg-primary hover:bg-primary-dark text-center text-no-underline padding-y-05 padding-x-05 display-block text-white font-sans-2xs visited:text-white hover:text-white radius-sm" href="#">edit profile</a>',
					'</div>',
				'</div>',
			'</article>'
		].join("\n");
		$(el).append(article);
	}

	function author_needs_update(){
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
					'<div class="grid-col-12 tablet:grid-col-10">',
						'<header class="bg-white padding-2 radius-sm">',
							'<h3 class="margin-0 margin-bottom-1">',
								'<a class="text-no-underline text-ink visited:text-ink" href="'+source_url+'/authors/'+uid+'" title="'+display_name+'">'+display_name+'</a>',
							'</h3>',
							'<p class="margin-0 font-sans-3xs"><a href="mailto:'+email+'">'+email+'</a></p>',
							'<p class="margin-0 font-sans-2xs">'+bio+'</p>',
							'<p class="font-sans-3xs">',
								topics,
							'</p>',
						'</header>',
					'</div>',
					'<div class="grid-col-12 tablet:grid-col-2">',
						'<a class="margin-bottom-1 bg-primary hover:bg-primary-dark text-center text-no-underline padding-y-05 padding-x-05 display-block text-white font-sans-2xs visited:text-white hover:text-white radius-sm" href="#">edit profile</a>',
					'</div>',
				'</div>',
			'</article>'
		].join("\n");
		$(el).append(article);
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

});

// https://api.github.com/repos/GSA/digitalgov.gov/commits

function get_commits(){
  var commits_api_path = "https://api.github.com/repos/GSA/digitalgov.gov/commits";
  console.log(commits_api_path);
  if (commits_api_path !== undefined) {
		$.ajax({
		  url: commits_api_path,
		 	dataType: 'json',
		}).done(function(data) {
			if (typeof data !== 'undefined') {

        $.each( data, function( i, e ) {
          list_commits(data);
        });



			}
		});
	}
}
get_commits();

function list_commits(data){
  var el = $('#commits');
  $.each( data, function( i, e ) {
    if (e[0] == null) {
  		var commit_date = e.commit.author.date;
  		var commit_author_name = e.commit.author.name;
  		var commit_author_username = e.author.login;
  	} else {
  		var commit_date = e[0].commit.committer.date;
  		var commit_author = e[0].author.login;
  	}
  	var commit_html_url = e.html_url;
  	var commit_author_url = 'https://github.com/' + commit_author_username;
  	var commit_history_url = 'https://github.com/GSA/digitalgov.gov/commits/demo/content/' + filepath;
    var commit = [
			"<div class='border-top-1px padding-y-1 display-flex flex-align-center'>",
      "<img class='circle-4 margin-right-1' src='https://www.github.com/"+commit_author_username+".png?size=50' alt='"+commit_author_name+"'/>",
			"Updated by ",
			"<a href="+commit_author_url+" title="+commit_author_name+">",
				"<span class='commit-author'>"+commit_author_name+"</span>",
			"</a> on ",
			"<a href="+commit_history_url+">",
				"<span class='commit-date'>"+getFormattedDate(commit_date)+"</span>",
			"</a>",
			"</div>",
			""
		].join("\n");
    $(el).append(commit)
  });
}

function getFormattedDate(d) {
		var date = new Date(d);
		date.setUTCHours(date.getUTCHours() - 4);
		var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	  var year = date.getUTCFullYear();
	  var month = (date.getUTCMonth()).toString();
	  month = monthNames[month];
	  var day = date.getUTCDate().toString();
	  day = day.length > 1 ? day : '0' + day;
		var globalhours = date.getUTCHours().toString();
		if (globalhours > 12 ) {
			var hours = globalhours - 12;
		} else {
			var hours = globalhours;
		}
		var minutes = date.getUTCMinutes().toString();
		minutes = minutes.length > 1 ? minutes : '0' + minutes;
		var seconds = date.getUTCSeconds().toString();
		if (globalhours > 12 ) {
			var ampm = 'pm';
		} else {
			var ampm = 'am';
		}
		var date_string = month + ' ' + day + ', ' + year + ' at ' + hours + ':' + minutes + ' ' + ampm + ' ET';
	  return date_string;
	}

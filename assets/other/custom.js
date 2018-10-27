jQuery(document).ready(function($) {

  function get_issues(path, tag){
  	if (path !== undefined) {
      console.log(path + '?labels='+tag+'&per_page=100');
  		$.ajax({
  		  url: path + '?labels='+tag+'&per_page=100',
  		 	dataType: 'json',
  		}).done(function(data) {
  			if (typeof data !== 'undefined' && data.length > 0) {
          show_issues(data)
  			}
  		});
  	}
  }

  function show_issues(data) {
  	$(data).each(function(i, issue) {
  		// console.log(issue);
      var comments    = issue['comments'];
      var created_at  = issue['created_at'];
      var labels      = get_issue_labels(issue['labels']);
      var number      = issue['number'];
      var state       = issue['state'];
      var title       = issue['title'];
      var url         = issue['url'];
      var updated_at  = issue['updated_at'];
      var user        = issue['user'];
      var issue_card = [
        "<div class='card'>",
          "<div class='entry'>",
            "<div class='entry-content'>",
    		      "<h4>#"+number+": <a href="+url+" title="+title+">"+title+"</a></h4>",
    		    "</div>",
    		  "</div>",
          "<div class='entry-taxonomy'>",
            "<p class='labels'>"+labels+"</p>",
          "</div>",
    		"</div>"
    	].join("\n");
      $('.issues').append(issue_card);
  	});
  }

  function get_issue_labels(all_labels){
    var labels = "";
    $(all_labels).each(function(i, label) {
      // console.log(label);
      labels += "<span class='label' style='background-color:#" + label['color'] + "'>" + label['name'] + "</span> ";
    });
    return labels;
  }

  $('.issues').each(function() {
    var tag = $(this).attr('data-tag');
    console.log(tag);
    get_issues(workflow_issues_api, tag);
  });


});

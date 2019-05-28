jQuery(document).ready(function($) {

	// Settings for the Select2 integration
	// https://select2.org/
	// This is what we are using to make it possible to pull topics from the TOPICS API and make them searchable and editable in the interface
	// It is not easy...

	$("#block-topics select").select2({
	  tags: true,
	  width: 'element',
	  closeOnSelect: false,
	  tokenSeparators: [',', ' '],
	  createTag: function (params) {
	    // Don't offset to create a tag if there is no @ symbol
	    if (params.term.indexOf('@') === -1) {
	      // Return null to disable tag creation
	      return null;
	    }
	    return {
	      id: params.term,
	      text: params.term
	    }
	  }
	});
	$("#block-authors select").select2({
	  tags: true,
	  width: 'element',
	  closeOnSelect: false,
	  tokenSeparators: [',', ' '],
	  createTag: function (params) {
	    // Don't offset to create a tag if there is no @ symbol
	    if (params.term.indexOf('@') === -1) {
	      // Return null to disable tag creation
	      return null;
	    }
	    return {
	      id: params.term,
	      text: params.term
	    }
	  }
	});
	$("#block-source select").select2({
		minimumResultsForSearch: Infinity
	});

	// Why are we storing topics in local storage again?
	$("#block-topics select").append(localStorage.dg_topics).trigger('change');
	$("#block-authors select").append(localStorage.dg_authors).trigger('change');
	$("#block-source select").append(localStorage.dg_sources).trigger('change');


});

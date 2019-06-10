// This function takes a URL parameter and uses it to fetch the JSON API data for that file
// Example URL — 
// http://localhost:4000/edit/?page=https%3A%2F%2Fdigital.gov%2F2018%2F07%2F17%2Fexperiments-in-tweaking-agile-for-ux%2F

// ===========================

function get_page_data() {
  // Get the URL parameter
  // For more info, see: https://davidwalsh.name/query-string-javascript
  var urlParams = new URLSearchParams(window.location.search);
  // This should be the URL of the digital.gov page that you are requesting data about
  // var path = urlParams.get('page');
  var api_path = 'https://raw.githubusercontent.com/GSA/digitalgov.gov/demo/content/posts/2019/05/2019-05-20-humancentered-design-for-it-centralization.md';
  // API path
  // See all the digital.gov APIs https://github.com/GSA/digitalgov.gov/wiki/APIs
  // var api_path = path + 'index.json';
  console.log('Digital.gov page api_path:');
  console.log(api_path);

  return $.ajax({
    url: api_path,
    type: 'GET',
    dataType: 'text',
  });
}

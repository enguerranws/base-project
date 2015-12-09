
// Get JS libs from Browserify
var $ = require('jquery');

// Require my modules
// var myModule = require('modules/my-module')


// Setting the app
var app = window.app = {
    myProp: false,
    init: function() {
      if($){
        console.info('JS is ready with jQuery : ', $);
      }
    	else {
        console.info('JS is ready ');
      }
    }
};

// DOM ready listener & calls
$(document).ready(function () {
	// DOM is ready
	app.init();
});


// Get JS libs from Browserify
var $ = require('jQuery');

// Require my modules
// var myModule = require('modules/my-module')

// Setting the app
var app = window.app = {
    myProp: false,
    init: function() {
    	console.info('JS is ready :)');
    }
};

// DOM ready listener & calls
$(document).ready(function () {
	// DOM is ready
	app.init();
});

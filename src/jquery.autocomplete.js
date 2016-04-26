/*	Project: autocomplete
 *  Description: A clone of an autocomplete searching implementation
 *  Author: Dan Yu
 *  License: MIT
 */

(function($, window, document) {
	"use strict";
	var pluginName = "autocomplete";

	/* Constructor: Autocomplete
	 * -------------------------
	 * Creates reference to DOM element, and stores information
	 * necessary for creating the autocomplete searchable list.
	 */
	function Autocomplete(element, options) {
		this.element = element;
		this.settings = $.extend({}, options);
		this._name = pluginName;
		this.init();
	}

	// Avoid Plugin.prototype conflicts
	$.extend(Autocomplete.prototype, {

		/* Prototype Function: init
		 * ------------------------
		 * Init function for Autocomplete. Ensures that the necessary
		 * DOM elements are created, with event listeners created too.
		 */
		init: function() {
			var thisReference = this
			var $autocomplete = $('<div>', {id:'autocomplete'});

			var $searchTitle = $('<label>', {text: 'Search Box:', id:'search-title'});
			$autocomplete.append($searchTitle);

			var $searchBox = $('<input>', {id: 'search-box'});
			$searchBox.bind('input', function() {
				thisReference.autocomplete($searchBox.val());
			});
			$autocomplete.append($searchBox);

			var $search = $('<span />').attr('class', 'glyphicon glyphicon-arrow-right')
			$search.bind('click', function(event) {
				thisReference.animateMeteors();
			});
			$autocomplete.append($search);

			var $searchResults = $('<ul>', {id: 'search-results'});
			$autocomplete.append($searchResults);

			$(this.element).append($autocomplete);
		},

		/* Prototype Function: autocomplete
		 * --------------------------------
		 * Filter case insensitively an array of strings based on a given search query,
		 * and update the UI to reflect the filtered array, allow search bar filling-in.
		 *
		 * Arguments:
		 * searchQuery - text entered into the search box
		 */
		autocomplete: function(searchQuery) {
			var filteredSearch = _.filter(this.settings.searchArray, function (searchItem) {
				return searchQuery.length != 0 && searchItem.toLowerCase().indexOf(searchQuery.toLowerCase()) != -1
			});

			$('#search-results').empty();
			_.each(filteredSearch, function(filteredItem, index) {
				var $searchResult = $('<li>', {class: 'search-result-'+index, text: filteredItem});
				$('#search-results').append($searchResult);
			})

			$('#search-results').bind('click', function(event) {
				$('#search-box').val(event.target.innerText);
				$('#search-results').empty();
			});
		},

		/* Prototype Function: autocomplete
		 * --------------------------------
		 * Random added feature, adding in a meteor shower whenever right arrow is clicked.
		 */
		animateMeteors: function() {
			var thisReference = this
			var meteors = []

			_.each(_.range(15), function(meteor) {
				var $meteor = $('<img />', {src: '../src/public/meteor_icon.png'});
				$meteor.css('position', 'absolute');
				$meteor.css('top', '-'+String(Math.random()*1000+100)+'px');
				$meteor.css('left', String(Math.random()<0.5?'-':'')+String(Math.random()*2000)+'px');
				meteors.push($meteor);
			});

			_.each(meteors, function(meteor) {
				$(thisReference.element).append(meteor);
				$(meteor).animate({left: '+=3000', top: '+=3000'}, 4000);
			});
		}
	});

	// Ensure that the plugin is only loaded once by the browser.
	// This was inspired by http://stefangabos.ro/jquery/jquery-plugin-boilerplate-revisited/
	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, "plugin_" + pluginName)) {
				$.data(this, "plugin_" + pluginName, new Autocomplete(this, options));
			}
		});
	};
})(jQuery, window, document);
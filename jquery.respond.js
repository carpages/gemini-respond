/**
 * @fileoverview

A jQuery plugin that allows you to listen to when the user has changed the
screen size.

### Notes
- Here's a note

### Features
- Bind events to when the screen is resized
- Only triggers the event when the resize is complete
- You have access to the current screen size according to Gemini standards
(``small``, ``medium``, ``large``, ``xlarge``)

 *
 * @namespace jquery.respond
 * @copyright Carpages.ca 2014
 * @author Matt Rose <matt@mattrose.ca>
 *
 * @requires jquery-loader
 *
 * @example
  $.respond.bind('resize', function(e, screen, windowWidth){

    console.log('Screen: ' + screen);
    console.log('Window Width: ' + windowWidth + 'px');

  });
 */

define(['jquery-loader', 'underscore'], function($, _){

  // Private settings
  var _settings = {
    delay: 500, //Delay before events are triggered
    minChange: 20 //Minimum difference in width for event to trigger
  };

  // Object to bind and trigger listeners to
  var LISTENER = $({});

  // Public object
  var plugin = {};

  // Object that specifies breakboints
  // Should sync with SASS breakpoints
  // {project}/sass/settings.scss
  // {framewrok}/variables/defaults.scss
  plugin.breakpoints = {
    'small': 0,
    'medium': 600,
    'large': 1024,
    'xlarge': 1280
  };

  /**
   * Get a list of sorted breakpoints by screen size
   *
   * @method
   * @name jquery.respond#sortedBreakpoints
   * @return {array} Array of sorted breakpoints by screen size
  **/
  plugin.sortedBreakpoints = function(){
    return _.sortBy(
      _.map(plugin.breakpoints, function(size, screen){
        return {
          size: size,
          screen: screen
        };
      }),
      function(bp){return bp.screen;}
    );
  };


  /**
   * Get the screen size based on Gemini naming conventions
   *
   * @method
   * @name jquery.respond#getScreen
   * @return {string} Screen size
  **/
  plugin.getScreen = function(){
    var returnScreen,
        width = $window.width();

    _.each(plugin.sortedBreakpoints(), function(bp){
      if(bp.size < width){
        returnScreen = bp.screen;
      }
    });

    return returnScreen;
  };

  // Cache of the last registered width
  var _width = $window.width();

  // Add a listener to run on resize after a set delay
  $window.resize(_.debounce(function(){

    var windowWidth = $window.width();

    //Check if the window was resized enough to trigger a change
    if(Math.abs(_width - windowWidth) > _settings.minChange){
      _width = windowWidth;
      _resize(windowWidth);
    }

  }, _settings.delay));

  // Function to run when the screen is resized
  var _resize = function(windowWidth){

    //Triggers the resize event
    plugin.trigger('resize', [plugin.getScreen(), _width]);

  };

  /**
   * Bind an event
   *
   * @method
   * @name jquery.respond#bind
   * @param {string} event The event name
   * @param {function} callback The callback fuction for the event
  **/
  plugin.bind = function(){
    LISTENER.bind.apply(LISTENER, arguments);
  };
  plugin.trigger = function(){
    LISTENER.trigger.apply(LISTENER, arguments);
  };

  $.respond = plugin;

});

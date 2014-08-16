/**
 * @fileoverview

A Gemini plugin that allows you to listen to when the user has changed the
screen size.

### Notes
- Here's a note

### Features
- Bind events to when the screen is resized
- Only triggers the event when the resize is complete
- You have access to the current screen size according to Gemini standards
(``small``, ``medium``, ``large``, ``xlarge``)

 *
 * @namespace gemini.respond
 * @copyright Carpages.ca 2014
 * @author Matt Rose <matt@mattrose.ca>
 *
 * @requires gemini
 *
 * @example
  G.respond.bind('resize', function(e, screen, windowWidth){

    console.log('Screen: ' + screen);
    console.log('Window Width: ' + windowWidth + 'px');

  });
 */

define(['gemini'], function($){

  var _ = $._;

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
   * @name gemini.respond#sortedBreakpoints
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
      function(bp){return bp.size;}
    );
  };


  /**
   * Get the screen size based on Gemini naming conventions
   *
   * @method
   * @name gemini.respond#getScreen
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

  /**
   * Check for a certain screen size or higher
   *
   * @method
   * @name gemini.respond#isScreen
   * @param {string} screen Screen size
   * @return {boolean} Whether the screen is that size or larger
  **/
  plugin.isScreen = function(screen){
    return $window.width() >= plugin.breakpoints[screen];
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
   * @name gemini.respond#bind
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

/*
 * Manages the responsive breakpoint listeners
 */

define(['jquery-loader', 'underscore'], function($, _){

  var $window = window.$window;

  var settings = {
    delay: 500, //Delay before events are triggered
    minChange: 20 //Minimum difference in width for event to trigger
  };

  // Object to bind and trigger listeners to
  var listener = $({});

  // This should sync with sass breakpoints
  // {project}/sass/settings.scss
  // {framewrok}/variables/defaults.scss
  var breakpoints = {
    'small': 0,
    'medium': 600,
    'large': 1024,
    'xlarge': 1280
  };

  // Returns the screen size based on width
  var getScreen = function(width){
    var returnScreen;

    _.each(breakpoints, function(point, scrn){
      if(point < width){
        returnScreen = scrn;
      }
    });

    return returnScreen;
  };

  //The object
  $.respond = {
    bind: function(){
      listener.bind.apply(listener, arguments);
    },
    trigger: function(){
      listener.trigger.apply(listener, arguments);
    },
    width: $window.width()
  };
  $.respond.screen = getScreen($.respond.width);

  // The event
  $window.resize(_.debounce(function(){
      //Runs after delay

      //Check if the window was resized a lot
      if(Math.abs($.respond.width - $window.width()) > settings.minChange){
        resize($window.width());
      }

    }, settings.delay));

  // Runs on resize
  var resize = function(windowWidth){

    // Reset static vals
    $.respond.width = windowWidth;
    $.respond.screen = getScreen(windowWidth);

    //Triggers the breakpoint
    $.respond.trigger('resize', [$.respond.screen]);

  };

});

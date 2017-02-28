(function($) {

  $.fn.flip = function(options) {

      var defaults = {
        "direction": "right",
        "perspective": "900px",
        "duration": 1200,
        "block": false
     };

      options = $.extend(defaults, options);

      options.duration = (options.duration / 1000);

      return this.each(function() {

         var el = $(this);

         var h = el.height();
         var w = el.width();

         var cardFace = el.find('.cardFace');
         var card = el.find('.card');
         var front = el.find('.front');
         var back = el.find('.back');

         Browser = navigator.userAgent;
         if (Browser.indexOf("Trident") == -1)
         {
            TweenMax.set(el, {perspective:options.perspective, position:"relative"});
            TweenMax.set(cardFace, {position:"absolute", overflow:"hidden", height:h + "px",width: w + "px", perspective: options.perspective});
            TweenMax.set(card, {transformStyle:"preserve-3d"});
            TweenMax.set(front, {backfaceVisibility: "hidden"});

            el.unbind('hover');

            switch(options.direction)
            {
                case 'right':
                    TweenMax.set(back, {backfaceVisibility: "hidden", rotationY:-180});

                    if (!options.block) {
                        $(el).hover(
                          function() {
                            TweenMax.to(card, options.duration, {rotationY:180, ease:Back.easeOut});
                          },
                          function() {
                            TweenMax.to(card, options.duration, {rotationY:0, ease:Back.easeOut});
                          }
                        );
                    }

                    break;


                case 'left':
                    TweenMax.set(back, {backfaceVisibility: "hidden", rotationY:-180});

                    if (!options.block) {
                        $(el).hover(
                          function() {
                            TweenMax.to(card, options.duration, {rotationY:-180, ease:Back.easeOut});
                          },
                          function() {
                            TweenMax.to(card, options.duration, {rotationY:0, ease:Back.easeOut});
                          }
                        );
                    }

                    break;
            }
         }
         else
         {
            TweenMax.set(cardFace, {position:"absolute", overflow:"hidden", height:h + "px",width: w + "px"});
            TweenLite.set(front, {zIndex:100, opacity: 1});
            TweenMax.set(back, {zIndex:99, opacity: 0});

            if (!options.block) {
                $(el).hover(
                   function() {
                      TweenLite.to(back, options.duration, {opacity:1, ease:Back.easeOut});
                      TweenLite.to(front, options.duration, {opacity:0, ease:Back.easeOut});
                   },
                   function() {
                      TweenLite.to(back, options.duration, {opacity:0, ease:Back.easeOut});
                      TweenLite.to(front, options.duration, {opacity:1, ease:Back.easeOut});
                   }
                );
            }
         }
      });
  };

})(jQuery);

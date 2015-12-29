---
layout: post
title: jQuery Match Height Plugin
---

Let's say I have several Boostrap columns side by side that contain images of varying height. I want these images to appear `vertical-align:middle` with each other. Of course, this can only really be achieved if our columns have `display:inline-block`, but if you know anything about Bootstrap, you know our columns are floated. Inline-block display introduces several issues with whitespace in your HTML - if you remove the float and make them inline-block, the last one will wrap unless you do something goofy like this with your markup:

```
<div class="container">
	<div class="row">
		<div class="col-sm-4"><img src="foo"></div><div
			class="col-sm-4"><img src="bar"></div><div
			class="col-sm-4"><img src="fizz">
		</div>
	</div>
</div>
```

Or set `font-size:0` on the row and reassign a font-size (if need be) on the columns. But we're not here to talk about why Bootstrap floats thing instead of displaying them inline-block.

I can fudge `vertical-align:middle` on any element with the following:

```
position:relative;
top:50%;
transform:translateY(-50%);
```

`top` moves the element down 50% of the height of its parent element, while the transform moves it back 50% of its own height. So I could just slap this on my images, but this won't pan out. `top` dies a hard death because my parent columns don't have assigned heights. So now what?

Let's give them heights - matching heights, in fact -

```
var height = 0;
$('.row .col-sm-4').each(function() { //you'll want to be more specific with your selectors
	if($(this).height() > height) height = $(this).height();
});
$('.row .col-sm-4').height(height);
```

Easy. But you'll probably do this a lot, so I've conveniently wrapped it into a chainable jQuery function. It's also got an options array that takes `mode:'minimum'` or `mode:'maximum'` if you wanted to match the smallest height, and it'll also take a callback function.

```
(function ( $ ) { //inline jQuery plugin to match height of elements
    $.fn.match_height = function(userOptions, callback) {
        var defaults = {
            mode:'maximum'
        };
        var options = $.extend({}, defaults, userOptions);
				var height = 0;
        if(options.mode == 'maximum') {
            height = 0;
        } else {
            height = this.first().outerHeight(false);
        }
        this.each(function() {
            $(this).css('height', 'auto');
            if(options.mode == 'maximum') {
                if($(this).outerHeight(false) > height) {
                    height = $(this).outerHeight(false);
                }
            } else if(options.mode == 'minimum') {
                if($(this).outerHeight(false) < height) {
                    height = $(this).outerHeight(false);
                }
            }
        });
        this.each(function() {
            $(this).outerHeight(height);
        });
        if(typeof callback == 'function') {
            callback.call(this);
        }
        return this;
    };
}( jQuery ));
```

Perfect. Here we go -

```
$(window).load(function() {
	$('.example .fill-murray-column').match_height().css('background', 'orange');
});
```

Be sure to do it in `$(window).load()` or things like images won't get calculated in the height. In action:

<div class="container example">
	<div class="row">
		<div class="col-sm-4 fill-murray-column">
			<img src="http://fillmurray.com/300/300">
		</div>
		<div class="col-sm-4 fill-murray-column">
			<img src="http://fillmurray.com/300/350">
		</div>
		<div class="col-sm-4 fill-murray-column">
			<img src="http://fillmurray.com/300/400">
		</div>
	</div>
</div>

In this specific example, is Javascript better than a pure CSS solution with a funky font-size hack? Maybe not. But there are other situations where it _is_ ideal, so keep it in your back pocket.

<script>
(function ( $ ) { //inline jQuery plugin to match height of elements
    $.fn.match_height = function(userOptions, callback) {
        var defaults = {
            mode:'maximum'
        };
        var options = $.extend({}, defaults, userOptions);
				var height = 0;
        if(options.mode == 'maximum') {
            height = 0;
        } else {
            height = this.first().outerHeight(false);
        }
        this.each(function() {
            $(this).css('height', 'auto');
            if(options.mode == 'maximum') {
                if($(this).outerHeight(false) > height) {
                    height = $(this).outerHeight(false);
                }
            } else if(options.mode == 'minimum') {
                if($(this).outerHeight(false) < height) {
                    height = $(this).outerHeight(false);
                }
            }
        });
        this.each(function() {
            $(this).outerHeight(height);
        });
        if(typeof callback == 'function') {
            callback.call(this);
        }
        return this;
    };
}( jQuery ));
jQuery(document).ready(function($) {
	$(window).load(function() {
		$('.example .fill-murray-column').match_height().css('background', 'orange');
	});
});
</script>
<style>
	.example {
		margin:20px 0;
	}
	.example .fill-murray-column img {
		position:relative;
		top:50%;
		transform:translateY(-50%);
		-webkit-transform:translateY(-50%);
		max-width:100%;
	}
</style>

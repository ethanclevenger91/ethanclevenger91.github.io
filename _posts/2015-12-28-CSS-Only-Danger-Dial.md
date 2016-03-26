---
layout: post
title: CSS-Only Danger Dial
technologies:
  - title: HTML
    link: https://www.codecademy.com/learn/web
  - title: SCSS
    link: http://sass-lang.com/guide
---

We're going to create a dial that could be used for a variety of things - danger level of animals, spiciness of peppers, whatever. Doesn't matter. We're going to do it because it's cool, and we're going to do it only with HTML, CSS and just one image for the background. Let's go.

### The Codepen

<p data-height="268" data-theme-id="11396" data-slug-hash="GooKMK" data-default-tab="result" data-user="ethanclevenger91" class='codepen'>See the Pen <a href='http://codepen.io/ethanclevenger91/pen/GooKMK/'>Dial Animation</a> by Ethan (<a href='http://codepen.io/ethanclevenger91'>@ethanclevenger91</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

If you aren't familiar with SCSS, you're either going to want to refresh (read: _make your life easier_) or view the compiled CSS in the CodePen.

### How?

First off, our HTML:

```
<div class="scale">
  <img src="http://millerthekiller.com/wp-content/themes/murderbymiller/images/scale.png">
  <div class="dial">
  <span class="dial-content">
    </span>
  </div>
</div>
```

Pretty straightforward here, though could probably be semantically cleaner. `scale` is our wrapper element. We've got an image for the scale (not required I suppose), followed by our dial and the numerical content of the dial, empty for now.

> But Ethan, why don't we put the content in a pseudo-element?

We will - I need `dial`'s pseudo-elements for other things, though.

Next let's take a look at the SCSS. I'm only going to address parts that are crucial to this working.  Let's start with the dial:

```
$dial:#58585a;
$background:#eaeaea;
.dial {
  text-align:center;
  background:$dial;
  width:56px;
  height:56px;
  border-radius:50%;
  transform:rotate(-90deg);
  border:15px solid $background;
  z-index:2;
  &:after {
    position:absolute;
    z-index:3;
    left:50%;
    bottom:90%;
    transform:translateX(-50%);
    transform-origin:50% 100%;
    content:'';
    width: 0;
    height: 0;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-bottom: 35px solid $dial;
  }
  &:before {
    z-index:1;
    position:absolute;
    left:50%;
    bottom:100%;
    transform:translateX(-50%);
    transform-origin:50% 100%;
    content:'';
    width: 0;
    height: 0;
    border-left: 22px solid transparent;
    border-right: 22px solid transparent;
    border-bottom: 54px solid $background;
    z-index:1;
  }
}
```

The `dial` element by itself is just a circle. There are pseudo-elements on the dial that end up looking like a couple of stacked [triangles][2], so we can see where the dial is pointing. By default, the point on our dial will be headed straight up. For this particular case, we want the default position to be even with the x-axis at the bottom of the [second quadrant][1] (assuming the dial to be sitting at the origin). This is accomplished by applying a `transform:rotate(-90deg)`. You could also accomplish this by making your triangles be left-facing instead of top-facing.

`$dial:#58585a;
$background:#eaeaea;
.dial {
  ...
  .dial-content:after {
    z-index:3;
    color:white;
    font-weight:bold;
    font-size:24px;
    content:'0';
    position:relative;
    transform: rotate(90deg);
    width:1em;
    display:inline-block;
  }
}`

Dial content sits dead center of our dial, accomplished with a `text-align:center` on `.dial` that you'll see later. You'll notice that it receives the same transformation as its parent, so we need to adjust it back to center using `transform:rotate(90deg);`. For now, we'll let it say "0", but that'll eventually be changed when the animation gets going. Let's look at that next.

```
$levels:10;
$levelSize:100 / $levels;
$degrees:180;
@keyframes dial {
  @for $i from 0 through $levels {
    #{($i * $levelSize)}% {
      transform:rotate(#{-90 + ($i * ($degrees / $levels))}deg);
    }
  }
}
```

We're setting up 10 different levels on our scale. You could swap that variable for anything and it'll work out just fine.

For each level, we'll first scale it to a percentage of 100 for the actual moment of the keyframe, ranging from 0 to 100%. This particular dial is going to spin 180 degrees, so using the same math, we can figure out how many degrees it should be rotated at a given moment, and then add -90 for our original transformation.  If you increase the total degrees variable, your dial will spin further, but will maintain its home on the x-axis. The image we're going to use won't really make sense anymore, but you could swap it out.

Next, we'll create keyframes for our dial content:

```
@keyframes dial-content {
  @for $i from 0 through $levels {
    #{$i * $levelSize}% {
      transform:translateY(-50%) rotate(#{90 - ($i * ($degrees / $levels))}deg);
      content:"#{$i}";
    }
  }
}
```

Using the same kind of math, we can determine the various keyframe moments and the transformation that must be applied to the dial's content, but now you'll notice we're decrementing from 90 rather than incrementing from -90 since the base transform is 90. The content is also updated at this point to reflect the level.

Put it all together, and you get the following:

```
$dial:#58585a;
$background:#eaeaea;
.dial {
  text-align:center;
  position:absolute;
  left:0;
  right:0;
  bottom:15px;
  margin:auto;
  background:$dial;
  width:56px;
  height:56px;
  border-radius:50%;
  transform:rotate(-90deg);
  animation-name:dial;
  border:15px solid $background;
  z-index:2;
  &:after {
    position:absolute;
    z-index:3;
    left:50%;
    bottom:90%;
    transform:translateX(-50%);
    transform-origin:50% 100%;
    content:'';
    width: 0;
    height: 0;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-bottom: 35px solid $dial;
  }
  &:before {
    z-index:1;
    position:absolute;
    left:50%;
    bottom:100%;
    transform:translateX(-50%);
    transform-origin:50% 100%;
    content:'';
    width: 0;
    height: 0;
    border-left: 22px solid transparent;
    border-right: 22px solid transparent;
    border-bottom: 54px solid $background;
    z-index:1;
  }
  .dial-content:after {
    z-index:3;
    animation-name:dial-content;
    color:white;
    font-weight:bold;
    font-size:24px;
    content:'0';
    position:relative;
    top:50%;
    transform:translateY(-50%) rotate(90deg);
    width:1em;
    display:inline-block;
  }
  &, .dial-content:after {
    animation-duration: 2s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    animation-direction: alternate;
  }
}
```

This is great for an animating dial, but what if you want a fixed position? This can easily be accomplished, also using Sass loops, by defining a collection of classes.

```
@for $i from 0 through $levels {
  .scale-#{$i} {
    transform:rotate(#{-90 + ($i * ($degrees / $levels))}deg);
    .dial-content:after {
      transform:translateY(-50%) rotate(#{($degrees / 2) - ($i * ($degrees / $levels))}deg);
      content:"#{$i}";
    }
  }
}
```

You'll see the same math we did before, but now within the context of a single class.

Depending on how many steps your scale will have, this example reduces the requests to the server from 10 images to just one. If you're feeling really ambitious, you could even base64 encode your background image for use in the CSS and forego server requests altogether - not a terrible idea. Have thoughts of your own? Drop them in the comments below.

  [1]: https://en.wikipedia.org/wiki/Quadrant_(plane_geometry)
  [2]: https://css-tricks.com/snippets/css/css-triangle/

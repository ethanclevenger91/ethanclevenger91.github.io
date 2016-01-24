---
layout: post
title: CSS-Only Danger Dial
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

Pretty straightforward here, though could probably be semantically cleaner. `scale` is our wrapper element. We've got an image for the scale (not requried I suppose), followed by our dial and the numerical content of the dial, empty for now.

> But Ethan, why don't we put the content in a pseudo-element?

We will - I need `dial`'s pseudo-elements for other things, though.

Next let's take a look at the SCSS. I'm only going to address parts that are crucial to this working.  Let's start with resting position:

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

That's a lot, but we'll get there. First, the dial. This is just a circle. By default, the point on our dial will be headed straight up, so we give it a transform to swing it back to neutral, even with the x-axis at the bottom of the [second quadrant][1] (assuming the dial to be sitting at the origin).

The pseudo-elements on the dial are a couple of stacked [triangles][2], so we can see where its pointing.

Dial content sits dead center of our dial, and we'll go ahead and apply a reverse transformation to it so that its content (`0` for now) will be right-side up.

Finally, we'll assign everything but the actual animation name identically between the dial and its content.

Now let's look at our keyframes:

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

For each level, we'll first scale it to a percentage of 100 for the keyframe point. Then we'll determine how many degrees of our total degrees that amounts to and add that to -90 (the base transformation to put our dial on the x-axis). If you increase the total degrees, your dial will spin further, but will maintain its home on the x-axis. You could alter this behavior if you wanted to, though you'll want a new background.

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

In a perfect world, we wouldn't have to have two separate sets of keyframes, but we can't nest selectors in regular CSS, so that won't really pan out for us. So we'll do this instead. We've done the same math for our keyframe points, but because our base transform is 90 degrees, you'll notice a slight variation there. Then we set our content to the level.

But what if you want a fixed position? Let's set up some classes real quick. Here, fortunately, we _can_ use nested selectors, and your SCSS compiler of choice will work it out. Same idea, but assigned to classes like `scale-1`.

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

And that's about it. Nothing too fancy here, but it's nice to not have a request to the server for every state, just the one for the background image. Depending on your background (or if you need it), you can probably do _that_ with CSS as well, or a data URI `src`. _Sans_ Javascript is also nice.

  [1]: https://en.wikipedia.org/wiki/Quadrant_(plane_geometry)
  [2]: https://css-tricks.com/snippets/css/css-triangle/

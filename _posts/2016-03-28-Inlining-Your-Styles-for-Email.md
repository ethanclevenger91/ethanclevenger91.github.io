---
layout: post
title: Inlining Your Styles for Email
technologies:
  - title: PHP
    link: https://www.codecademy.com/learn/php
---

If you've ever written markup for emails, you know it's nothing like writing markup for the browser. Mail clients are full of little quirks regarding what they will and won't support. One particularly sticky issue is various email clients that don't support `<style>` tags. I've got a solution.

> Well of course you have a solution, Ethan! Inline styles!

Hardy har. I mean something a bit more automated.

If you're doing large email marketing campaigns, this may not be the article for you. You may be better off looking at the large variety of email services out there designed for large, transactional email campaigns. They come with email builders designed to play nice with a variety of clients.

But sometimes that's overkill. Sometimes you're pushing out internal emails, as I recently did building an employee time tracker for a client. If that's your case, there are a variety of things to consider, but this article will specifically address Gmail and others requiring that [your CSS be inline](http://stackoverflow.com/a/7224643/2233690).

Writing inline CSS doesn't just suck - it's unmaintainable. So how about a way to inject your styles at runtime? Perfect. I've even done the leg work of finding you [a library that will do it](https://github.com/tijsverkoyen/CssToInlineStyles).

The README on there is outdated and there's an open ticket to get it fixed, so keep reading for a functional example. This library supports both inline and external stylesheets. I had originally coded mine out inline. Putting that together looks something like this:

```
use TijsVerkoyen\CssToInlineStyles\CssToInlineStyles;

...

$message = '<html>
  <head>
    <style>
      body {
        color:blue;
      }
    </style>
  </head>
  <body>
    <p>Hey there!</p>
  </body>
</html>';
$cssToInlineStyles = new CssToInlineStyles($message);
$cssToInlineStyles->setUseInlineStylesBlock();
$message = $cssToInlineStyles->convert();
```

Super simple, but if you're worth your salt, you're probably using an external stylesheet to standardize elements across several kinds of emails. You can grab that with `file_get_contents()` and pass it into your constructor as follows:

```
use TijsVerkoyen\CssToInlineStyles\CssToInlineStyles;

...

$message = '<div>Some HTML Content</div>';
$css = file_get_contents(__DIR__ . '/css/style.css');

$cssToInlineStyles = new CssToInlineStyles($message, $css);

$message = $cssToInlineStyles->convert();
```

Finally, if you're using WordPress, it'd be awfully nice to not have to do this every time you invoke `wp_mail()`, so instead, why not set up a filter?

```
// Even WordPress can do autoloaders, but you may be in a theme.
// Adjust as necessary

require_once(plugin_dir_path( __FILE__ ).'vendor/autoload.php');

use TijsVerkoyen\CssToInlineStyles\CssToInlineStyles;

class MyEmailManager() {

  function __construct() {
    add_filter( 'wp_mail', [$this, 'inject_styles'] );

    // Fine for example's sake, but you should be more specific
    // See https://core.trac.wordpress.org/ticket/21095
    add_filter( 'wp_mail_content_type', function( $content_type ) {
    	return 'text/html';
    });
  }

  function inject_styles($args) {
    $message = $args['message'];
    $css = file_get_contents(plugins_dir_path( __FILE__ ). 'css/style.css');

    $cssToInlineStyles = new CssToInlineStyles($message, $css);

    $message = $cssToInlineStyles->convert();
    $args['to'] = $message;

    return $args;
  }

}
```

And that'll do it. Have your own tricks for HTML emails or thoughts on improving this one? Share your thoughts in the comments below.

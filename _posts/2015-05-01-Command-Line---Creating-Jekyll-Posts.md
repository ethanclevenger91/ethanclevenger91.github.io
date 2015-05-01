---
layout: post
title: Command Line - Creating Jekyll Posts
---

GitHub works fine for a CMS, but I'd much rather do my work in my favorite IDE, and if I'm working locally, I may as well make it simple. Here are a couple snippets you might find valuable.

### Get to your directory quickly

Open up your `.bashrc` file and create an alias to get to your posts directory quickly:

```alias blog='cd q:/wamp/ethanclevenger91.github.io/_posts'```

### Create posts

I hate to create a new file for each post manually since it does follow a certain formula, so you can also set up a bash function for this (also in `.bashrc`)

```bash
function njp() {
	mydate=`date +%Y-%m-%d`
	post=${1// /-}
	filename="$mydate-$post.md"
	touch "$filename"
	echo "---
	layout: post
	title: $1
	---" > $filename
	}
```

Let's break that down line-by-line:
1. Define a function. I chose `njp` for "new jekyll post"
2. Get the current date
3. Replace spaces in the post title with hyphens
4. Append that business together to make the file title
5. Create the file
6. Echo some boilerplate into the file, including the post title.

Save this, open a bash prompt and enjoy automation:

```bash
$ blog
User@COM /q/wamp/ethanclevenger91.github.io/_posts (master)
$ njp "Command Line - Creating Jekyll Posts"
```

And the file is created.
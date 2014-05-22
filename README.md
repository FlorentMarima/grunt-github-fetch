# grunt-github-fetch

> Fetch assets from github repositories releases using Github cool API

## Getting Started
This plugin requires Grunt `~0.4.4`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-github-fetch --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-github-fetch');
```

## The "github_fetch" task

### Why
Let's say divided one big monolithic piece of code into cool services in different repositories (**private or not**). You might need to be able to maintain the "link" between the services or part of services concording to the right tags and version. Github provides a nice API to deal with assets (files you uploaded when you released), but humanly, it's kind of annoying to do some `curl` or whatever etc... Here is one possible way to do it. 

### Overview
In your project's Gruntfile, add a section named `github_fetch` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  github_fetch: {
    repo_1: {
        options: {
        // Task-specific options go here.
        }
    },
    repo_2: {
        options: {
        // Task-specific options go here.
        }
    }
  },
});
```

### Options

Consider a classic github repository URL :
//github.com/:owner/:repository

#### options.repository
Type: `String`
**REQUIRED**

The targeted repository name
#### options.owner
Type: `String`
**REQUIRED**

The owner of the targeted repository

#### options.tag
Type: `String`
**REQUIRED**

The tag of the targeted release (*example* ``tag : "v1.0"``)

#### options.filename
Type: `String`
**REQUIRED**

The name of the file you want to retrieve from the target

#### options.tokenFile
Type: `String`
**OPTIONAL** (but *RECOMMENDED*)

Path to a json file that contains your Github Application token
It should contain { "token" : "XXXX" }
See below for more explanation about Github token.

#### options.output
Type: `String`
**OPTIONAL** 

Path. When specified, the retrieve asset is stored as output



### About Github Application Token

#### Where?
https://github.com/settings/applications -> Personal Access Token

#### Why?
Github API requests are limited to 60 per hour for user without access token. It could be bothersome. This limit is 5000 when using a token. Moreover, **if you intend to fetch assets from a private repository, this becomes** **REQUIRED**

#### Tips
Gitignore your tokenFile but let the other contributors know that one is required by adding a _tokenFile_.json.dist file containing: 
```
{
    "token" : "XXXXXXXXXXXXX"
}
```
They will then need to transform it into a valid _tokenFile_.json file


#### Some Behavior precision
If `output` option is not specified, the asset is downloaded as it is in your root directory (where your Gruntfile.js probably is)

** Classic example **
```js
grunt.initConfig({
  github_fetch: {
    repo_1: { // this is important
        options: {
            tokenFile : 'token.json'
            repository : 'cool-app',
            owner: 'John',
            tag: 'v1.0',
            filename: 'script.js',
            output: 'external/script.js'
            // Fetching script.js from the tagged v1.0 release on John's cool-app repository using the github token stored in token.json
        }
    },
  },
});
```


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

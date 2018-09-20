# Project Title

ICO Splash page for True App

## Getting Started

This repo contains both the source code, and the production ready compiled files.
When you are ready to deploy to a server, simply use the files inside the /site folder.
If you are developing CSS and/or changing localization text files and developing JavaScript, you'll need to clone the entire repo and follow the "Prerequisites" and "Installing" instructions below.

### Prerequisites for development

Using terminal, navigate to the repo root on your local machine. then run the following commands:
* npm install -g gulp (this installs gulp and gulp command line tools globally)
* gem install sass (this installs the sass gem for compiling scss files. you might need to use sudo if you get write permissions errors)

### Installing the dependencies

Using terminal, navigate to the repo root on your local machine. then run the following command:
* npm install

### Running the application for development

Using terminal, navigate to the repo root on your local machine. then run the following commands:
* gulp (this builds the files)
* gulp watch (this watches the files and automatically compiles them when you make changes)

### Description and location of files

When making changes to Javascript and css files, you'll need to edit the ones in the "src" dir, NOT the ones in the "site" dir.

* /src/sass/ (this dir contains the scss source files. Edit these files and they will compile to styles.css inside /site/static/css/styles.css)
* /src/js/app/ (this dir contains the JavaScript source files. Edit these files and they will compile to app.js inside /site/static/js/app.js)
* /src/js/vendors/ (this dir contains 3rd party libraries like jQuery and other jQuery plugin files. Just drop files in here and they will concat and compile to /site/static/js/vendors.js)
* /src/js/app/[language].js (localization files. These contain the strings that need to be translated. There will be one file for each language. This files compile to /site/static/js/app.js)

## Deployment

When deploying, just grab the files insite the "/site" directory and push to your hosting provider.

## Built With

* [SASS](https://sass-lang.com/) - The best css dev tool evar.
* [jQuery](https://jquery.com/) - JavaScript library
* [Minimalect](https://groenroos.github.io/minimalect/) - Select box replacement plugin
* [Gulp](https://gulpjs.com/) - Task automation.

## Contributing

If you need access to edit files, please contact pulsegrenade@gmail.com to be added as a contributor. 




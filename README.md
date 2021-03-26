# ProfCheck

An extension to find the instructor(s) for a course on a school's course explorer, and displays their rating as well as their Rate My Professors link in a tooltip on hover over.

This extension is fast and up-to-date, as it queries the Rate My Professors database instead of web scraping.

Supported schools:

- University of British Columbia (Vancouver & Okanagan)
- University of Toronto (St. George, Mississauga, & Scarborough)

Built with [Tippy.js](https://atomiks.github.io/tippyjs/)

## Installation

### Chrome Web Store

https://chrome.google.com/webstore/detail/profcheck/iejcdmcgelpioejdpeoifnaemneihagc

### Manual

This project now uses Typescript and webpack. Clone this repository and install the required dependencies:

```shell
$ npm install
```

Then compile with webpack:

```shell
$ npm run build
```

The compiled extension will be in the _dist_ folder.

Enable _Developer Mode_ on Chrome Extensions page and click _Load Unpacked_ and select the _dist_ folder.

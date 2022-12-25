# ProfCheck

An extension that displays Rate My Professors' information in tooltips for teachers on UBC's course explorer.

This extension is fast and up-to-date, as it queries the Rate My Professors' API.

Supported schools:

- University of British Columbia (Vancouver & Okanagan)

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

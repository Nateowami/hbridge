httptooth.js
============

Transfer files and text between devices with HTTP.

This project was born out of frustration with trying to email Chinese characters between devices that didn't support Bluetooth. Such a small task should have a simple way to do it.

Usage
=====

#### Installation

Start with `git clone https://github.com/Nateowami/httptooth.js.git`. Then `cd httptooth.js` and run `npm install` (may need `sudo`). 

#### Running

To run it, type `node .`. By default it will run on port 3000. If you want to specify a different port, use the `PORT` environment variable (e.g. `PORT=8080 node .`). Now navigate to `localhost:3000` (or whatever port you launched it on) and you'll be given further usage instructions. Note that to access httptooth.js from a device that isn't running it, you'll need to specify the IP address of your computer, rather than `localhost`.

#### Uploading

Start by clicking the upload tab. On the next page you'll be able to upload multiple files (in browsers that support multiple file selections) or paste text in the text box. You can upload text and files at the same time. Click "Upload Data" at the bottom of the page, and you'll be shown all uploaded data, as well as a confirmation of what was uploaded.

#### Downloading

To download, navigate to the download tab. Copy text from this page or click a file name to download it.

#### Deleting

Navigate to `public/uploads` in the directory where httptooth.js is running, and delete the files from there. To delete text, just delete `uploaded_text.json` from the `public` directory.

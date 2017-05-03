H Bridge
============

Transfer files and text between devices on the local network.

This project was born out of frustration with trying to email files and Chinese characters between devices that didn't support Bluetooth. Such a simple task should have a simple solution.

Usage
=====

#### Installation

``` shell
git clone https://github.com/Nateowami/hbridge.git
cd hbridge
npm install
```

#### Running

``` shell
node . # Or from outside the directory, node path/to/hbridge
PORT=8000 node . # Run on a different port. Default is 3000.
```

Open your browser to `localhost:3000` (or wherever the server is running). You'll also be given a URL that can be used withing the local network (e.g. `192.168.1.101:3000`). If you have trouble accessing the server from other devices on the network, check your firewall.

#### Uploading

Go to the upload tab. On the next page you'll be able to upload multiple files (in browsers that support multiple file selections) or paste text in the text box. You can upload text and files at the same time. Click "Upload Data" at the bottom of the page, and you'll be shown all uploaded data, as well as a confirmation of what was uploaded.

#### Downloading

To download, navigate to the download tab. Copy text from this page or click a file name to download it.

#### Deleting

Navigate to `public/uploads` in the directory where H Bridge is running, and delete the files from there. To delete text, just delete `uploaded_text.json` from the `public` directory.

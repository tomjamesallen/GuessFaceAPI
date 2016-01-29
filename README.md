# Guessface API

This repository provides a gulp build task that will create a flat-file API for the Guessface front-end. 

Being flat-files means that it can be easily and cheaply deployed to any basic file server, such as Amazon S3 or GitHub pages. The build task takes the raw input data and images, and will create the image size variants, and a single JSON data file representing the data for each round and it's corresponding questions.


## Development / building locally

Download the repo and run `npm install`. The build script also requires the imagemagick CLI tools to be installed. There are a number of ways to install, including [Homebrew][Homebrew] `brew install imagemagick`.

The gulp config includes a basic server for development, which can be started by running `gulp` and will serve the contents of the `dist/api/` directory.

To build the API place the input question data and images in `/src/questions/` directory (details of format below), and run `gulp build-api`.


## Guessface questions directory

The question data and raw images should be dropped into `/src/questions/`. It requires a top level `index.json` file, that outlines the data for each round and the questions belonging to each round, and then question directories, that contain the images (a, b and mix), and the meta data for each question. The API builder accepts both PNGs and JPGs.

    - src/
      - questions/
        - index.json
        - question-name/
          - a.jpg
          - b.jpg
          - mix.jpg
          - index.json

Please see [https://github.com/tomjamesallen/guessface-questions][guessface-questions] for an example.

## Configuration.

Any of the properties found at the top of `/tasks/build-api.js` can be overridden in `/build-api-config.json`. There are a couple of examples in the file, just remove the `__` prefix and suffix from the key to enable. `apiPathPrefix` will determine the prefix given to the image paths in the output JSON. `imThreadConcurrency` determines the number of imagemagick threads that will be run concurrently. imagemagick can be a little processor hungry, so if you run into errors, the first thing to try is reducing the thread concurrency count.

[Homebrew]: http://brew.sh
[guessface-questions]: https://github.com/tomjamesallen/guessface-questions

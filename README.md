# chicago Data Visualizer
Uses City of Chicago data to create 3D live visualization used Deck.gl


## Get Started
After cloning the repo, run the following commands in your terminal (_For API token, register [here](https://www.mapbox.com/signup/)_):

1. `npm install`

2. `export MapboxAccessToken=[API KEY]`

3. `npm start`


## Primary Libraries/Packages Used
* [React](https://reactjs.org)
* [Uber Deck.gl](http://deck.gl/)
* [styled-components](https://www.styled-components.com/)
* [react-dat-gui](https://github.com/claus/react-dat-gui)


## Folder Structure
* :file_folder: **components**
  * _React components_
* :file_folder: **data**
  * _City of Chicago data_
* :file_folder: **generateData**
  * _Data transformation python scripts_
* :file_folder: **utils**
  * _helpers and enums_
* :file_folder: **webgl**
  * _layers and shaders for use with webgl/deck.gl_

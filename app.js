/* global document, window */
import React, { Component } from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';
import { StaticMap } from 'react-map-gl';
import DeckGL, { PolygonLayer, HexagonLayer } from 'deck.gl';
import { setParameters } from 'luma.gl';
import Confetti from 'react-confetti';

import TripsLayer from './webgl/trips-layer';
import ControlPanel from './components/ControlPanel';
import Stats from './components/Stats.js';
import { LIGHT_SETTINGS } from './webgl/lights.js';
import animationData from './data/busAnimData.json';
import {interpolateRgb} from "d3-interpolate";
import { format, formatDistance, formatRelative, subDays } from 'date-fns'

const stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );
// console.log(animationData);

const loopLength = 101000;
const fps = 60;

// Set your mapbox token here
const MAPBOX_TOKEN = 'pk.eyJ1IjoibWZhbGtvd3NraSIsImEiOiJjamplc241c3U0cWdyM3FvZ2lhbnRpMWNqIn0.IoccaoYEVuGJZjvsADuwAg' // eslint-disable-line

// parsing Raw building data
// TODO: do this somewhere else...
const buildingsRaw = require('./data/chicago_buildings.json');
let buildingsConverted = buildingsRaw;
for (let i = 0; i < buildingsRaw.length; i++) {
  const polygon = buildingsRaw[i].polygon.coordinates[0][0];
  buildingsConverted[i].polygon = polygon;
}

const pedCountRaw = require('./data/chicago_ped_count.json');
let pedCountConverted = pedCountRaw;
for (let i = 0; i < pedCountRaw.pedcount.length; i++) {
  const polygon = [
    [+pedCountRaw.pedcount[i].lat + 0.0002, +pedCountRaw.pedcount[i].lon + 0.0002],
    [+pedCountRaw.pedcount[i].lat + 0.0002, +pedCountRaw.pedcount[i].lon - 0.0002],
    [+pedCountRaw.pedcount[i].lat - 0.0002, +pedCountRaw.pedcount[i].lon - 0.0002],
    [+pedCountRaw.pedcount[i].lat - 0.0002, +pedCountRaw.pedcount[i].lon + 0.0002],
    [+pedCountRaw.pedcount[i].lat + 0.0002, +pedCountRaw.pedcount[i].lon + 0.0002]
  ];
  pedCountConverted.pedcount[i].polygon = polygon;
  pedCountConverted.pedcount[i].count = pedCountRaw.pedcount[i].count/75;
}

const DATA_URL = {
  BUILDINGS: buildingsConverted, // eslint-disable-line
    // 'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/trips/buildings.json',
  TRIPS: animationData,
    // 'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/trips/trips.json', // eslint-disable-line
  PEDESTRIANS: pedCountConverted,
};
// console.log(animationData)

const INITIAL_VIEW_STATE = {
  longitude: -87.615,
  latitude: 41.8781,
  zoom: 13.25,
  maxZoom: 17,
  minZoom: 11.5,
  pitch: 40,
  bearing: -1,
};

const redGreenInterplate = interpolateRgb('red', 'teal')

function getTheColor(d) {
  let color = [253, 128, 253];
  if (d.speed < 10) {
    color = [255, 0, 255];
  } else if (d.speed > 35) {
    color = [63, 255, 63];
  } else if (d.speed >= 20 && d.speed <= 35) {
    color = [23, 184, 190];
  }
  return color;
}

// convert rgb string to array
function rgbStringToArray(rgbString) {
  let spliter = rgbString.split('(');
  spliter = spliter[1].split(')');
  spliter = spliter[0].split(',');
  return spliter.map(x=> parseInt(x))
}

export default class App extends Component {
  state = {
    controls: {
      showTrips: true,
      showBuildingColors: false,
      showBuildings: false,
      showPedestrians: false,
      mapType: 'dark',
      confetti: false,
      buildingsSlice: buildingsConverted,
      yearSlice: 2018,
    },
    time: 0,
  }

  componentDidMount() {
    this._animate();
  }

  componentWillUnmount() {
    if (this._animationFrame) {
      window.cancelAnimationFrame(this._animationFrame);
    }
  }

  update = controls => {
    if(this.state.controls.yearSlice === controls.yearSlice){
      this.setState({ controls });
    } else {
      let newBuildings = [];
      for (let i = 0; i < buildingsConverted.length; i++) {
        const building = buildingsConverted[i];
        if (building.year_built <= controls.yearSlice){
          newBuildings.push(building);
        }
      }
      controls.buildingsSlice = newBuildings;
      this.setState({ controls });
    }
  }

  _animate() {
    stats.begin();

    const timestamp = Date.now() / 1000;
    const loopTime = loopLength / 10 / fps;

    this.setState({
      time: ((timestamp % loopTime) / loopTime) * loopLength
    });

    this._animationFrame = window.requestAnimationFrame(this._animate.bind(this));

    stats.end();
  }

  _renderLayers() {
    const { controls } = this.state;
    const {
      buildings = DATA_URL.BUILDINGS,
      trips = DATA_URL.TRIPS,
      trailLength = 150,
      time = this.state.time,
      pedestrians= DATA_URL.PEDESTRIANS,
    } = this.props;

    const layers = [];
    if (controls.showBuildings) {
      layers.push(
        new PolygonLayer({
          id: 'buildings',
          data: controls.buildingsSlice,
          extruded: true,
          wireframe: false,
          stroked: false,
          fp64: false,
          opacity: 1.0, // buildings will clip if (opacity < 1.0)
          getPolygon: f => f.polygon,
          getElevation: f => f.height,
          getFillColor: f => {
            if (controls.showBuildingColors) {
              const yearScaled = f.year_built === "0" ? 30 : (f.year_built - 1870) / 1.5;
              return [20 + yearScaled / 3, 20 + yearScaled / 3, 20 + yearScaled];
            }
            return [74, 80, 87];
          },
          lightSettings: LIGHT_SETTINGS
        })
      )
    }

    if (controls.showTrips) {
      layers.push(
        new TripsLayer({
          id: 'trips',
          data: trips,
          getPath: d => d.segments,
          getColor: getTheColor,
          // getColor: d => (d.speed < 20 ? [253, 128, 93] : [23, 184, 190]),
          // getColor: d => (rgbStringToArray(redGreenInterplate(parseInt(d.speed/40)))),
          opacity: 1.0,
          trailLength,
          currentTime: time,
          fp64: false,
        })
      )
    }
    if (controls.showPedestrians){
      layers.push(
       new PolygonLayer({
          id: 'pedestrians',
          data: pedestrians.pedcount,
          extruded: true,
          wireframe: false,
          fp64: false,
          opacity: .5,
          getPolygon: f => f.polygon,
          getElevation: f => f.count,
          getFillColor: f => [f.count, 150, 25],
          lightSettings: LIGHT_SETTINGS
        })
      )
    }
    return layers;
  }

  _onWebGLInitialized(gl) {
    setParameters(gl, {
      depthTest: true,
      [gl.DEPTH_FUNC]: gl.LEQUAL,
      // [gl.POLYGON_OFFSET_FILL]: true,
      // polygonOffset: [3, 3],
      // [gl.CULL_FACE]: true,
      // [gl.FRONT_FACE]: gl.CW,
    });
  }

  getMapStyle = () => {
    const { controls } = this.state;
    switch (controls.mapType) {
      case 'street':
        return "mapbox://styles/mapbox/streets-v10";
      case 'dark':
        return "mapbox://styles/mapbox/dark-v9";
      case 'light':
        return "mapbox://styles/mapbox/light-v9";
      case 'outdoors':
        return "mapbox://styles/mapbox/outdoors-v10";
      case 'satellite':
        return "mapbox://styles/mapbox/satellite-v9";
      case 'satellite-streets':
        return "mapbox://styles/mapbox/satellite-streets-v10";
    }
  }

  handleRightClick = e => {
    e.preventDefault();
  }

  render() {
    const { viewState, controller = true, baseMap = true} = this.props;
    const { controls } = this.state;

    return (
      <div onContextMenu={this.handleRightClick}>
        <ControlPanel
          viewState={viewState}
          controls={controls}
          update={this.update}
          frameTime={this.state.time}
          date={this.currentDate}
        />
        {controls.confetti &&
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <Confetti run={controls.confetti} width='2000px' height='2000px' numberOfPieces={1000} gravity={0.08} />}
          </div>
        }
        <DeckGL
          layers={this._renderLayers()}
          initialViewState={INITIAL_VIEW_STATE}
          viewState={viewState}
          controller={controller}
          onWebGLInitialized={this._onWebGLInitialized.bind(this)}
          onContextMenu={this.handleRightClick}
        >
          {baseMap && (
            <StaticMap
              reuseMaps
              mapStyle={this.getMapStyle()}
              preventStyleDiffing={true}
              mapboxApiAccessToken={MAPBOX_TOKEN}
            />
          )}
        </DeckGL>
      </div>
    );
  }
}

// NOTE: EXPORTS FOR DECK.GL WEBSITE DEMO LAUNCHER - CAN BE REMOVED IN APPS
export {App, INITIAL_VIEW_STATE};

if (!window.demoLauncherActive) {
  render(<App />, document.body.appendChild(document.createElement('div')));
}

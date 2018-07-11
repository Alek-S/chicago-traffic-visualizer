/* global document, window */
import React, { Component } from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';
import { StaticMap } from 'react-map-gl';
import DeckGL, { PolygonLayer } from 'deck.gl';
import Confetti from 'react-confetti';

import TripsLayer from './trips-layer';
import ControlPanel from './components/ControlPanel';
import Stats from './Stats.js';
import { LIGHT_SETTINGS } from './Lights.js';

const stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

// Set your mapbox token here
const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

// Source data CSV

// parsing Raw building data
// TODO: do this somewhere else...
const buildingsRaw = require('./chicago_buildings.json');
let buildingsConverted = buildingsRaw;
for (let i = 0; i < buildingsRaw.length; i++) {
  const polygon = buildingsRaw[i].polygon.coordinates[0][0];
  buildingsConverted[i].polygon = polygon;
}

const DATA_URL = {
  BUILDINGS:
    buildingsConverted, // eslint-disable-line
  TRIPS:
    'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/trips/trips.json' // eslint-disable-line
};

const INITIAL_VIEW_STATE = {
  longitude: -87.615,
  latitude: 41.8781,
  zoom: 13.25,
  maxZoom: 17,
  minZoom: 11.5,
  pitch: 40,
  bearing: -1,
};

export default class App extends Component {
  state = {
    controls: {
      showBuildings: true,
      mapType: 'dark',
      confetti: false,
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

  update = controls => this.setState({ controls })

  _animate() {
    stats.begin();

    const timestamp = Date.now();
    const loopLength = 1800;
    const loopTime = 60000;

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
      trailLength = 180,
      time = this.state.time
    } = this.props;

    const layers = [];
    if (controls.showBuildings) {
      layers.push(
        new PolygonLayer({
          id: 'buildings',
          data: buildings,
          extruded: true,
          wireframe: false,
          fp64: true,
          opacity: 0.5,
          getPolygon: f => f.polygon,
          getElevation: f => f.height,
          getFillColor: [74, 80, 87],
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
          getColor: d => (d.vendor === 0 ? [253, 128, 93] : [23, 184, 190]),
          opacity: 0.3,
          strokeWidth: 2,
          trailLength,
          currentTime: time
        })
      )
    }

    return layers;
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

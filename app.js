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
import Key from './components/Key';
import Stats from './components/Stats.js';
import { LIGHT_SETTINGS } from './webgl/lights.js';
import animationData from './data/busAnimData.json';
import {interpolateRgb} from "d3-interpolate";
import {scalePow} from 'd3-scale';
import Modal from 'react-modal';

import { format, formatDistance, formatRelative, subDays } from 'date-fns'

const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);
// console.log(animationData);

const loopLength = 101000;
const fps = 60;

// Set your mapbox token here
const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

// parsing Raw building data
// TODO: do this somewhere else...
const buildingsRaw = require('./data/chicago_buildings.min.json');
let buildingsConverted = buildingsRaw;
for (let i = 0; i < buildingsRaw.length; i++) {
  const polygon = buildingsRaw[i].polygon.coordinates[0][0];
  buildingsConverted[i].polygon = polygon;
  if(buildingsRaw[i].year_built < 1000){
    buildingsConverted[i].year_built = 1965;
  }
  buildingsConverted[i].height = buildingsRaw[i].stories * 3.3;
}

const neighborhoodsRaw = require('./data/chicago_neighborhood_data.json');
let neighborhoodsConverted = neighborhoodsRaw;
for (let i = 0; i < neighborhoodsRaw.length; i++) {
  const polygon = neighborhoodsRaw[i].polygon.coordinates[0][0];
  neighborhoodsConverted[i].polygon = polygon;
}

const neighborhoodsEnergyRaw = require('./data/energyData.json');
for (let i = 0; i < neighborhoodsConverted.length; i++) {
  let community = neighborhoodsConverted[i].community;
  if (community === 'LAKE VIEW') {
    community = 'LAKEVIEW';
  }
  if (community === 'OHARE') {
    community = "O'HARE";
  }
  
  const kwh = neighborhoodsEnergyRaw[community]['kwhMean'];
  const population = neighborhoodsEnergyRaw[community]['totalPopulation'];
  const therm = neighborhoodsEnergyRaw[community]['thermMean'];

  neighborhoodsConverted[i].kwh = kwh;
  neighborhoodsConverted[i].population = population;
  neighborhoodsConverted[i].therm = therm;
}

const pedCountRaw = require('./data/chicago_ped_count.min.json');
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
  pedCountConverted.pedcount[i].adjCount = pedCountRaw.pedcount[i].count / 75;
}

const potholesRaw = require('./data/potholes.min.json');
let potholesConverted = potholesRaw;
for (let i = 0; i < potholesConverted.potholeCount.length; i++) {
  const potholePolygon = [
    [+potholesRaw.potholeCount[i].lat + 0.0002, +potholesRaw.potholeCount[i].lon + 0.0002],
    [+potholesRaw.potholeCount[i].lat + 0.0002, +potholesRaw.potholeCount[i].lon - 0.0002],
    [+potholesRaw.potholeCount[i].lat - 0.0002, +potholesRaw.potholeCount[i].lon - 0.0002],
    [+potholesRaw.potholeCount[i].lat - 0.0002, +potholesRaw.potholeCount[i].lon + 0.0002],
    [+potholesRaw.potholeCount[i].lat + 0.0002, +potholesRaw.potholeCount[i].lon + 0.0002]
  ];
  potholesConverted.potholeCount[i].polygon = potholePolygon;
  potholesConverted.potholeCount[i].count = potholesRaw.potholeCount[i].count / 75;
}

const DATA_URL = {
  BUILDINGS: buildingsConverted, // eslint-disable-line
    // 'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/trips/buildings.json',
  TRIPS: animationData,
    // 'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/trips/trips.json', // eslint-disable-line
  PEDESTRIANS: pedCountConverted,
  POTHOLES: potholesConverted,
  NEIGHBORHOODS: neighborhoodsConverted,

};
// console.log(animationData)

const elevationScale = {min: .01, max: 1};

const INITIAL_VIEW_STATE = {
  longitude: -87.615,
  latitude: 41.8581,
  zoom: 11,
  maxZoom: 17,
  minZoom: 10.5,
  pitch: 60,
  bearing: -20,
};

const blackTealInterplate = interpolateRgb('black', 'teal')
const blackFuchsiaInterplate = interpolateRgb('black', '#FF00FF')
const blackCharInterplate = interpolateRgb('black', '#DFFF00')

const thermScale = scalePow().domain([0, 155153]).exponent(0.5)
const kwhScale = scalePow().domain([0, 6183509]).exponent(0.5)

function getTheColor(d) {
  let color = [253, 128, 253];
  if (d.speed < 10) {
    color = [255, 0, 255];
  } else if (d.speed > 35) {
    color = [63, 255, 63];
  } else if (d.speed >= 18 && d.speed <= 35) {
    color = [23, 184, 190];
  }
  return color;
}

// convert rgb string to array
function rgbStringToArray(rgbString) {
  let spliter = rgbString.split('(');
  spliter = spliter[1].split(')');
  spliter = spliter[0].split(',');
  spliter = spliter.map(x=> parseInt(x))
  spliter.push(100);
  return spliter;
}

var introModal = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    backgroundColor       : 'rgba(0, 0, 0, 0.7)',
    color                 : '#fff',
    fontFamily            : "'Quicksand', sans-serif",
  }
};

export default class App extends Component {
  state = {
    controls: {
      showTrips: true,
      showBuildingColors: true,
      showBuildings: false,
      showPedestrians: false,
      mapType: 'dark',
      confetti: false,
      showPotholes: false,
      showNeighborhoods: true,
      neighborhoodPopulation: false,
      neighborhoodTherm: false,
      neighborhoodKwh: false,
      showMap: false,
      buildingsSlice: buildingsConverted,
      playbackSpeed: 5,
      playbackPosition: 0,
      yearSlice: 2018,
      neighborhoods: DATA_URL.NEIGHBORHOODS,
      selections: ['Buses', 'Buildings', 'Pedestrians', 'Potholes'],
    },
    time: 0,
    welcomeModal: true,
    hoveredObject: null,
    elevationScale: .01,
    elevationPedScale: .01,
    tooltip: null,
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
    if (this.state.controls.yearSlice === controls.yearSlice) {
      if(this.state.controls.showBuildings === controls.showBuildings || !controls.showBuildings){
        this.setState({ controls });
      } else if( controls.showBuildings ){
        this._animateBuildings();
        this.setState({ controls });
      } 
      if (this.state.controls.showPedestrians === controls.showPedestrians || !controls.showPedestrians){
        
      }else {
        this._animatePedestrians();
        this.setState({ controls });
      }

      
    } else {
      let newBuildings = [];
      for (let i = 0; i < buildingsConverted.length; i++) {
        const building = buildingsConverted[i];
        if (building.year_built <= controls.yearSlice) {
          newBuildings.push(building);
        }
      }
      controls.buildingsSlice = newBuildings;
      this.setState({
        controls,
        time: controls.playbackPosition
      });
    }
  }

  _animate() {
    stats.begin();
    const { controls, time } = this.state;

    let setTime = time;
    setTime += parseInt(controls.playbackSpeed) * 2;
    if (setTime > loopLength) {
      setTime = 0;
    }

    this.setState({
      time: setTime,
      controls: {
        ...controls,
        playbackPosition: setTime,
      }
    });

    this._animationFrame = window.requestAnimationFrame(this._animate.bind(this));

    stats.end();
  }

  _animateBuildings() {
    this.setState({elevationScale: .000});
    this._stopBuildingAnimate();
    this._startBuildingAnimate();
  }

  _startBuildingAnimate() {
    this.intervalTimer = window.setInterval(this._animateBuildingHeight.bind(this), 50);
  }

  _stopBuildingAnimate() {
    window.clearTimeout(this.startAnimationTimer);
    window.clearTimeout(this.intervalTimer);
  }

  _animateBuildingHeight() {
    const state = this.state;
    if (state.elevationScale >= elevationScale.max) {
      this.setState({elevationScale: 1});
      this._stopBuildingAnimate();
    } else {
      this.setState({elevationScale: this.state.elevationScale + .03});
    }
  }
  _animatePedestrians() {
    this.setState({elevationPedScale: .000});
    this._stopPedAnimate();
    this._startPedAnimate();
  }

  _startPedAnimate() {
    this.intervalTimerPed = window.setInterval(this._animatePedHeight.bind(this), 50);
  }

  _stopPedAnimate() {
    window.clearTimeout(this.startPedAnimationTimer);
    window.clearTimeout(this.intervalTimerPed);
  }

  _animatePedHeight() {
    const state = this.state;
    if (state.elevationPedScale >= elevationScale.max) {
      this.setState({elevationPedScale: 1});
      this._stopPedAnimate();
    } else {
      this.setState({elevationPedScale: this.state.elevationPedScale + .03});
    }
  }

  _renderLayers() {
    const { controls } = this.state;
    const {
      trips = DATA_URL.TRIPS,
      trailLength = 150,
      time = this.state.time,
      pedestrians = DATA_URL.PEDESTRIANS,
      potholes = DATA_URL.POTHOLES,
      // taxi_data = DATA_URL.TAXI,
    } = this.props;

    const layers = [];
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
          elevationScale: this.state.elevationScale,
          getFillColor: f => {
            if (controls.showBuildingColors) {
              const yearScaled = f.year_built === "0" ? 30 : (f.year_built - 1870) / 1.5;
              return [20 + yearScaled / 3, 20 + yearScaled / 3, 20 + yearScaled];
            }
            return [74, 80, 87];
          },
          lightSettings: LIGHT_SETTINGS,
          autoHighlight: true,
          highlightColor: [238, 238, 0, 200],
          pickable: true,
          onHover: this._onHover,
          visible: controls.showBuildings,
          onClick: this._onClick.bind(this),
        })
      )

    if (controls.showTrips) {
      layers.push(
        new TripsLayer({
          id: 'trips',
          data: trips,
          getPath: d => d.segments,
          getColor: getTheColor,
          opacity: 1.0,
          trailLength,
          currentTime: time,
          fp64: false,
        })
      )
    }

      layers.push(
        new PolygonLayer({
          id: 'potholes',
          data: potholes.potholeCount,
          extruded: true,
          wireframe: false,
          fp64: false,
          opacity: .5,
          getPolygon: f => f.polygon,
          getElevation: f => f.count,
          getFillColor: f => [255, 0, 0, 100],
          lightSettings: LIGHT_SETTINGS,
          visible: controls.showPotholes
        })
      )
    
      layers.push(
        new PolygonLayer({
          id: 'pedestrians',
          data: pedestrians.pedcount,
          extruded: true,
          wireframe: false,
          fp64: false,
          opacity: .5,
          getPolygon: f => f.polygon,
          getElevation: f => f.adjCount,
          elevationScale: this.state.elevationPedScale,
          getFillColor: f => [f.adjCount, 150, 25],
          lightSettings: LIGHT_SETTINGS,
          autoHighlight: true,
          highlightColor: [238, 238, 0, 200],
          pickable: true,
          onHover: this._onHover,
          visible: controls.showPedestrians,
        })
      )
    
      layers.push(
        new PolygonLayer({
          id: 'neighborhoods',
          data: controls.neighborhoods,
          extruded: false,
          wireframe: true,
          fp64: false,
          opacity: 1,
          getPolygon: f => f.polygon,
          getFillColor: f => {
            if (controls.neighborhoodPopulation) {
              const popScaled = f.population/360 ;
              return rgbStringToArray(blackTealInterplate(popScaled))
            }
            if (controls.neighborhoodTherm) {
              const popScaled = thermScale(f.therm);
              return rgbStringToArray(blackFuchsiaInterplate(popScaled))
            }
            if (controls.neighborhoodKwh) {
              const popScaled = kwhScale(f.kwh) ;
              return rgbStringToArray(blackCharInterplate(popScaled))
            }
            return [100,100,100, 0];
          },
          getLineColor: f => [255, 255, 255],
          getLineWidth: f => 4,
          autoHighlight: true,
          highlightColor: [40, 125, 238, 100],
          pickable: true,
          onHover: this._onHover,
          visible: controls.showNeighborhoods,
        })
      )

      // taxi Data:
      // layers.push(
      //   new ArcLayer({
      //     id: 'taxi-layer',
      //     data: taxi_data,
      //     pickable: false,
      //     getStrokeWidth: 12,
      //     getSourcePosition: d => d.from.coordinates,
      //     getTargetPosition: d => d.to.coordinates,
      //     getSourceColor: d => [Math.sqrt(d.price), 140, 0],
      //     getTargetColor: d => [Math.sqrt(d.price), 140, 0],
      //   })
      // )
    
    return layers;
  }

  _onWebGLInitialized(gl) {
    setParameters(gl, {
      depthTest: true,
      [gl.DEPTH_FUNC]: gl.LEQUAL,
    });
  }

  _onHover = ({object}) => {
    if (object === this.state.hoveredObject){
      return null;
    }
    if (object !== this.state.hoveredObject){
      this.setState({hoveredObject: object});      
      this.setState({tooltip: this._renderTooltip()})
    } if (!object) {
      this.setState({tooltip: null});
    }
  }

  _onClick = ({object}) => {
    this.setState({clickedObject: object});
    if (object.bldg_name1 === "WRIGLEY FIELD") {
      this._runConfetti();
    }
  }

  _runConfetti(){
    let { controls } = this.state;
    controls.confetti = true;
    this.setState({ controls });
    window.setTimeout(this._stopConfetti.bind(this), 18000);
  }

  _stopConfetti(){
    let { controls } = this.state;
    controls.confetti = false;
    this.setState({ controls });
  }

  _renderTooltip() {
    const {hoveredObject} = this.state;

    if (!hoveredObject) {
      return null;
    }

    if (hoveredObject.hasOwnProperty('bldg_name1')) {
      const buildingName = hoveredObject.bldg_name1;
      const buildingName2 = hoveredObject.bldg_name2;
      const yearBuilt = hoveredObject.year_built;
      return (
        <Tooltip style={{ left: 10, bottom: 35 }}>
          <p>{buildingName}</p>
          {buildingName2 && <p>aka {buildingName2}</p>}
          <p>Built in {yearBuilt}</p>
        </Tooltip>
      );
    }

    if (hoveredObject.hasOwnProperty('address')) {
      const address = hoveredObject.address;
      const count = hoveredObject.count;
      const block_face = hoveredObject.block_face
      return (
        <Tooltip style={{ left: 10, bottom: 35 }}>
          <p>{block_face + ' ' + address}</p>
          <p>Pedestrian Count: {parseInt(count)}</p>
        </Tooltip>
      );
    }

    if (hoveredObject.hasOwnProperty('community')) {
      const community = hoveredObject.community;
      return (
        <Tooltip style={{ left: 10, bottom: 35 }}>
          <p>Neighborhood:</p>
          <p>{community}</p>
        </Tooltip>
      );
    }

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

  toggleModalVisible = () => {
    this.setState({
      welcomeModal: false
    })
  }
  handleRightClick = e => {
    e.preventDefault();
  }

  render() {
    const { viewState, controller = true, baseMap = true } = this.props;
    const { controls, welcomeModal } = this.state;
    // console.log(this.state.welcomeModal)
    return (
      <StyledContainer onContextMenu={this.handleRightClick}>
        <Modal
          isOpen={welcomeModal}
          onRequestClose={this.toggleModalVisible}
          style={introModal}
        
          contentLabel="Introduction Help"
        >
          Use the controls on the right to explore various Chicago data from <StyledA target="_blank" href="https://data.cityofchicago.org/">https://data.cityofchicago.org/</StyledA>
        </Modal>
        <ControlPanel
          viewState={viewState}
          controls={controls}
          update={this.update}
          frameTime={this.state.time}
          date={this.currentDate}
        />
        {controls.confetti &&
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <Confetti run={controls.confetti} width='2000px' height='2000px' numberOfPieces={500} gravity={0.08} colors={['#58B9F7', '#ffffff', '#ff0000']} recycle={false}/>}
          </div>
        }
        {this.state.tooltip}
        <DeckGL
          layers={this._renderLayers()}
          initialViewState={INITIAL_VIEW_STATE}
          viewState={viewState}
          controller={controller}
          onWebGLInitialized={this._onWebGLInitialized.bind(this)}
          onContextMenu={this.handleRightClick}
          onHover={this._onHover.bind(this)}
        >
          {baseMap && MAPBOX_TOKEN && (
            <StaticMap
              reuseMaps
              mapStyle={"mapbox://styles/mapbox/dark-v9"}
              preventStyleDiffing={true}
              mapboxApiAccessToken={MAPBOX_TOKEN}
              visible={controls.showMap}
            />
          )}
        </DeckGL>
        <Key
          keyEntries={this.state.selections}
          controls={this.state.controls}
        />
      </StyledContainer>
    );
  }
}

const StyledContainer = styled.div`
  @import url('https://fonts.googleapis.com/css?family=Quicksand:300,400,700');
  h1, h2, h3, h4, h5, h6, p, ul, li, span {
    font-family: 'Quicksand', sans-serif;
  }
  cursor: crosshair;
`;

const Tooltip = styled.div`
  z-index: 9;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 6px;
  padding: 0px 20px;
  color: #fff;
  font-family: 'Quicksand', sans-serif;
  p {
    line-height: 1em;
  }
`;

const StyledA = styled.a`
  color: #15b9c4;
`;

// NOTE: EXPORTS FOR DECK.GL WEBSITE DEMO LAUNCHER - CAN BE REMOVED IN APPS
export { App, INITIAL_VIEW_STATE };

if (!window.demoLauncherActive) {
  document.body.style.backgroundColor = '#2a2a2a';
  render(<App />, document.body.appendChild(document.createElement('div')));
} 


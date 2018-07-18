import React, { Component } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons'
import DatGui, {
  DatBoolean,
  DatButton,
  DatColor,
  DatFolder,
  DatNumber,
  DatPresets,
  DatSelect,
  DatString,
} from 'react-dat-gui';
import {interpolateDate} from "d3-interpolate";

let beginDate = new Date(2018, 3, 28, 20, 30, 52); // 04/29/2018 1:30:52 AM
let endDate = new Date(2018, 4, 3, 7, 1, 30); // 05/03/2018 12:01:30 PM

const interDate = interpolateDate(beginDate, endDate)
function getDate(d) {
  const dateString = interDate(d/101000).toString();
  return dateString.split('GMT')[0]
}

/** @class 
 * @name ControlPanel
 * Header and control panel option in upper right
 *
 * @param {Object} props.controls - control option state from parent
 * @param {Function} props.update - parent function to update state
 * @returns {JSX}
*/
export default class ControlPanel extends Component {
  state = {
    isVisible: true,
    minMaxNumber: 60,
  }
  togglePanel = () => {
    const { isVisible } = this.state;
    this.setState({ isVisible: !isVisible })
  }

  render() {
    const { update, controls, frameTime } = this.props;
    const { isVisible } = this.state;
    // TODO: control animation position 
    return (
      <StyledControlPanel>
        <h1>Chicago Data Visualizer
        <FontAwesomeIcon icon={isVisible ? faCaretUp : faCaretDown} onClick={this.togglePanel} className="caret" />
        </h1>
        {/* <p>frame {Math.floor(frameTime)}</p> */}
        
        {isVisible &&
          // <p>frame {Math.floor(frameTime)}</p>
          // <p>Date {date}</p>
          <DatGui data={controls} onUpdate={update}>
            <DatBoolean path='showTrips' label='Show Bus Traffic: ' />
            {controls.showTrips && <p className='date'>Date {getDate(Math.floor(frameTime)).slice(0,21)}</p>}
            {controls.showTrips && <svg height="15">
            <line x1="0" y1="0" x2={100 * (frameTime / 1010) / 250} y2="0" style={{ stroke: 'rgb(21,185,196)', strokeWidth: 6,}} />
            </svg>}
            {controls.showTrips && <DatNumber path='playbackSpeed' label='Play Speed ' min={0} max={10} step={1} />}
            {/* {controls.showTrips && <DatNumber path='playbackPosition' label='Position: ' min={0} max={101000} step={1}/>} */}
            <DatBoolean path='showBuildings' label='Show Buildings: ' />
            {controls.showBuildings && <DatNumber path='yearSlice' label='Year Built ' min={1890} max={2018} step={5} />}
            {controls.showBuildings && <DatBoolean path='showBuildingColors' label='Show Building Colors: ' />}
            <DatBoolean path='showPedestrians' label='Show Pedestrians: ' />
            <DatBoolean path='showPotholes' label='Show Potholes: ' />
            {/* <DatSelect label="Map Type " path='mapType' options={['street', 'dark', 'light', 'outdoors', 'satellite', 'satellite-street']}/> */}
            <DatBoolean path='showMap' label='Show Map: ' />
            <DatBoolean path='showNeighborhoods' label='Show Neighborhoods: ' />
            {controls.showNeighborhoods && <DatSelect path='neighborhoodOverlay' options={['population', 'thermal', 'kwh']} label='Neighborhood Overlay: ' />}

            {/* <DatBoolean path='confetti' label='Confetti? ' /> */}

          </DatGui>
        }
      </StyledControlPanel>
    )
  }
}

const StyledControlPanel = styled.div`
  background: ${props => props.theme.panel.background};
  box-shadow: ${props => props.theme.panel.boxShadow};
  box-sizing: border-box;
  cursor: default;
  font-weight: ${props => props.theme.font.weight.main};
  padding: 0;
  position: fixed;
  right: 0rem;
  top: 0rem;
  height: fit-content;
  width: ${props => props.theme.panel.width};
  z-index: 99;

  & .react-dat-gui {
    font-size: ${props => props.theme.font.size.main};
    position: relative;
    right: 1rem;
  }

  & .date {
    font-size: ${props => props.theme.font.size.small};
    font-style: italic;
    margin-top: 0;
    margin-left: 2rem;
    margin-bottom: .1rem;
  }

  h1, h2, h3, p, span, ul, li {
    color: ${props => props.theme.font.color.main};
    font-weight: 100;
    letter-spacing: 1px;
  }
  h1 {
    background: ${props => props.theme.panel.headerGradient};
    color: ${props => props.theme.font.color.header};
    font-size: ${props => props.theme.font.size.header};
    margin: 0;
    padding: 1rem 0 1rem 0;
    text-align: center;
  }

  li{
    font-size: ${props => props.theme.font.size.main};
    list-style: none;
    line-height: 2.2;
    margin: 0;
    padding-left: .25rem;
    padding-right: .25rem;
    transition: .5s all;
    width: 100%
  }
  li:before{
    content: '»';
    padding-right: .5rem;
  }
  li:hover{
  color: ${props => props.theme.font.color.header};
    background-color: ${props => props.theme.panel.color.dark};
    box-shadow: 0px 0px 20px 0px rgba(114,124,140,0.2);

    select {
      background-color: ${props => props.theme.panel.color.select};
    }
  }


  div {
    height: fit-content;
    transition: height 1s linear;
  }

  li.number{
    display: flex;
  }
  li.number label{
    display: flex;
    align-items: center;
    width: calc(100% - 1rem);
  }
  .slider {
    display: block;
    position: relative;
    border: 1px solid ${props => props.theme.panel.color.dark};
    border-right-width: 1px;
    background-color: lighten(${props => props.theme.font.color.header}, 8.5%);
    background-image: linear-gradient(90deg, #1AB8C4, #1AB8C4);
    background-size: 0% 100%;
    background-repeat: no-repeat;
    cursor: ew-resize;
    height: ${props => props.theme.slider.height};
    border-radius: 5px 0 0 5px;
  }
  input[type=text], input[type=number] {
    background: ${props => props.theme.panel.color.dark};
    border: none;
    border-radius: 0 5px 5px 0;
    margin: 0;
    height: ${props => props.theme.slider.height};
    outline: none;
    font-size: .7rem;
    color: ${props => props.theme.font.color.header};
    text-align: right;
    transition: .5s all;

    &:hover {
      background: ${props => props.theme.panel.color.select};
    }
    &:focus {
      background: ${props => props.theme.panel.color.select};
      color: ${props => props.theme.font.color.header};
    }
    &::-ms-clear {
      display: none;
    }
  }

  .caret {
    padding-left: 20px;
    &:hover {
      cursor: pointer;
    }
  }
`;

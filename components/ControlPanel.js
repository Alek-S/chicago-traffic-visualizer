import React, { Component } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
import Key from './Key';

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
    selections: ['Buses', 'Buildings', 'Pedestrians', 'Potholes'],
  }
  togglePanel = () => {
    const { isVisible } = this.state;
    this.setState({ isVisible: !isVisible })
  }
  
  render() {
    const { update, controls, frameTime, date } = this.props;
    const { isVisible } = this.state;
    return (
      <React.Fragment>
        <StyledControlPanel>
          <h1>Chicago Traffic Visualizer
          {/* <FontAwesomeIcon icon="coffee" onClick={this.togglePanel} /> */}
          </h1>
          <p>frame {Math.floor(frameTime)}</p>
          <p>Date {date}</p>
          {isVisible &&
            <DatGui data={controls} onUpdate={update}>
              <DatBoolean path='showBuildings' label='Show Buildings? ' />
              {controls.showBuildings && <DatNumber path='yearSlice' label='Built Year ' min={1890} max={2018} step={5} />}
              <DatBoolean path='showBuildingColors' label='Show Building Colors? ' />
              <DatBoolean path='showPedestrians' label='Show Pedestrians? ' />
              <DatBoolean path='showPotholes' label='Show Potholes? ' />
              <DatSelect label="Map Type " path='mapType' options={['street', 'dark', 'light', 'outdoors', 'satellite', 'satellite-street']}/>
              <DatBoolean path='confetti' label='Confetti:' />
            </DatGui>
          }
        </StyledControlPanel>
        <Key keyEntries={this.state.selections}/>
      </ React.Fragment>
    )
  }
}

const StyledControlPanel = styled.div`
  @import url('https://fonts.googleapis.com/css?family=Quicksand:300,400,700');

  background: rgba(39, 44, 53, 0.85);
  /* border-radius: 6px; */
  box-shadow: 0px 0px 50px rgba(0,0,0,0.4);
  box-sizing: border-box;
  font-family: 'Quicksand', sans-serif;
  font-weight: 300;
  padding: 0;
  position: fixed;
  right: 0rem;
  top: 0rem;
  height: fit-content;
  width: 18rem;
  z-index: 99;

  & .react-dat-gui{
    position: relative;
    right: 1rem;
  }

  h1, h2, h3, p, span, ul, li {
    color: #C5C6C7;
    font-weight: 100;
  }
  h1 {
    background: linear-gradient(to bottom, #4c5566 0%, #343b47 100%);
    color: #1AB8C4;
    font-size: 18px;
    margin: 0;
    padding: 1rem 0 1rem 0;
    text-align: center;
  }


  li{
    list-style: none;
    line-height: 2.5;
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
    color: #1AB8C4;
    background-color: #343b47;
    box-shadow: 0px 0px 20px 0px rgba(114,124,140,0.2);

    select {
      background-color: #505a6d;
    }
  }


  div {
    height: fit-content;
    transition: height: 1s linear;
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
    border: 1px solid #1a1a1a;
    border-right-width: 1px;
    background-color: lighten(#1a1a1a, 8.5%);;
    background-image: linear-gradient(90deg, #2FA1D6, #2FA1D6);
    background-size: 0% 100%;
    background-repeat: no-repeat;
    cursor: ew-resize;
    height: 1.5625rem;
  }
  input[type=text], input[type=number] {
    background: #1a1a1a;
    border: none;
    border-radius: 0;
    margin: 0;
    height: 1.5625rem;
    outline: none;
    font-size: .75rem;
    color: #eee;
    text-align: right;
    &:hover {
      background: lighten(#1a1a1a, 5%);
    }
    &:focus {
      background: lighten(#1a1a1a, 10%);
      color: #fff;
    }
    &::-ms-clear {
      display: none;
    }
  }

  select{
    outline: none;
    background-color: #343b47;
    border: none;
    color: #1AB8C4;
    font-family: 'Quicksand', sans-serif;
    font-size: .85rem;
    font-weight: 400;
    transition: .5s all;
  }
`;

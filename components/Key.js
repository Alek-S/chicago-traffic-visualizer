import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import dataKey from '../utils/emums/keyEntries';

/** @class 
 * @name Key
 * Key UI to provide information on what data is being rendered
 * 
 * @param {Array} props.keyEntries - what keys to show
 * @param {Object} props.controls - whats shown and hidden, from parent app.js
 * @returns {JSX}
*/
export default class Key extends Component {

  getEntries = () => {
    const { 
      showTrips,
      showBuildingColors,
      showBuildings,
      showPedestrians,
      showPotholes,
    } = this.props.controls;

    let from = '';
    let to = '';
    let display = '';

    const list = this.props.keyEntries.map( (entry, i) =>{
      display = 'hidden';

      switch(entry){
        case dataKey.buses.name:
          from = dataKey.buses.fromColor;
          to = dataKey.buses.toColor;
          display = showTrips ? '' : 'hidden';
          break;
        case dataKey.buildings.name:
          from = showBuildingColors ? dataKey.buildings.fromColor : '#3B4046';
          to = showBuildingColors ? dataKey.buildings.toColor : '#3B4046';
          display = showBuildings ? '' : 'hidden';
          break;
        case dataKey.pedestrians.name:
          from = dataKey.pedestrians.fromColor;
          to = dataKey.pedestrians.toColor;
          display = showPedestrians ? '' : 'hidden';
          break;
        case dataKey.potholes.name:
          from = dataKey.potholes.fromColor;
          to = dataKey.potholes.toColor;
          display = showPotholes ? '' : 'hidden';
          break;
        default:
          from = '#fff';
          to = '#000';
      }

      return (
        <li key={i.toString()} className={display}>
          {entry}: <Gradient from={from} to={to}></Gradient>
        </li>
      )
    });

    return(list)
  }

  render(){
    return(
      <StyledKey>
        <h1>Data Key</h1>
        <ul>
          {this.getEntries()}
        </ul>
      </StyledKey>
    )
  }
}

Key.propTypes = {
  keyEntries: PropTypes.arrayOf(PropTypes.string),
  controls: PropTypes.object.isRequired
}

Key.defaultProps = {
  keyEntries: [
    dataKey.buses.name, 
    dataKey.buildings.name, 
    dataKey.pedestrians.name, 
    dataKey.potholes.name
  ]
}

const StyledKey = styled.div`
  background: rgba(39, 44, 53, 0.85);
  box-shadow: 0px 0px 50px rgba(0,0,0,0.4);
  box-sizing: border-box;
  color: #C5C6C7;
  font-family: 'Quicksand', sans-serif;
  font-weight: 300;
  position: fixed;
  right: 0rem;
  bottom: 4rem;
  width: 18rem;
  z-index: 99;

  
  h1 {
    background: linear-gradient(to bottom, #4c5566 0%, #343b47 100%);
    color: #1AB8C4;
    font-size: 14px;
    font-weight: 300;
    margin: 0;
    padding: .3rem;
    width: 18rem;
    text-align: center;
  }

  ul {
    padding-left: 0;
    margin-left: 1rem;
  }

  li {
    list-style: none;
    line-height: 2.5;
    font-size: 12px;
    /* padding-left: .25;
    margin-left: 0; */
  }

  & .hidden{
    display: none;
  }
`;

const Gradient = styled.div`
  /* display: inline-block; */
  position: relative;
  height: 10px;
  width: 150px;
  background: linear-gradient(to right, ${props => props.from} 0%, ${props => props.to} 100%);
  border-radius: 10px;
  margin-right: 1rem;
  float: right;
  clear: left;
  top: 10px;
`;

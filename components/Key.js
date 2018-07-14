import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import dataKey from '../utils/enums/keyEntries';

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
    let middle = '';
    let to = '';
    let display = '';

    const list = this.props.keyEntries.map( (entry, i) =>{
      display = 'hidden';

      switch(entry){
        case dataKey.buses.name:
          from = dataKey.buses.fromColor;
          middle = dataKey.buses.middleColor;
          to = dataKey.buses.toColor;
          display = showTrips ? '' : 'hidden';
          break;
        case dataKey.buildings.name:
          from = showBuildingColors ? dataKey.buildings.fromColor : '#3B4046';
          middle = showBuildingColors ? dataKey.buildings.middleColor : '#3B4046';
          to = showBuildingColors ? dataKey.buildings.toColor : '#3B4046';
          display = showBuildings ? '' : 'hidden';
          break;
        case dataKey.pedestrians.name:
          from = dataKey.pedestrians.fromColor;
          middle = dataKey.pedestrians.middleColor;
          to = dataKey.pedestrians.toColor;
          display = showPedestrians ? '' : 'hidden';
          break;
        case dataKey.potholes.name:
          from = dataKey.potholes.fromColor;
          middle = dataKey.potholes.middleColor;
          to = dataKey.potholes.toColor;
          display = showPotholes ? '' : 'hidden';
          break;
        default:
          from = '#fff';
          middle = '#808080';
          to = '#000';
      }

      return (
        <li key={i.toString()} className={display}>
          {entry}: <Gradient from={from} middle={middle} to={to}></Gradient>
          <p>{dataKey[entry.toLowerCase()].description}</p>
        </li>
      )
    });

    return(list)
  }

  render(){
    return(
      <StyledKey>
        <h1>Data Key</h1>
        <h2>Scale</h2>
        <Scale>
          <span>Low</span><span>high</span>
        </Scale>
        <Divider />
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
  bottom: 2.5rem;
  width: 18rem;
  z-index: 99;


  h1 {
    background: linear-gradient(to bottom, #4c5566 0%, #343b47 100%);
    color: #1AB8C4;
    font-size: 15px;
    letter-spacing: 1px;
    font-weight: 300;
    margin: 0;
    padding: .3rem;
    width: 18rem;
    text-align: center;
  }

  h2{
    margin-top: 0;
    margin-bottom: 0;
    margin-left: 1rem;
    position: relative;
    top: 15px;
    font-size: 11px;
    font-weight: 300;
    color: #1AB8C4;
    font-style: italic;
  }

  ul {
    padding-left: 0;
    margin-left: 1rem;
  }

  li {
    list-style: none;
    font-size: 12px;
    font-weight: 700;
    margin-bottom: 1.5rem;

    p{
      margin-top: .1rem;
      margin-left: .5rem;
      margin-right: .5rem;
      font-weight: 300;
      font-style: italic;
    }
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
  background: linear-gradient(to right, ${props => props.from} 0%, ${props => props.middle} 60%, ${props => props.to} 100%);
  border-radius: 2px;
  margin-right: 1rem;
  float: right;
  clear: left;
  top: 5px;
`;

const Scale= styled.div`
  position: relative;
  top: -15px;
  font-size: 9px;
  font-style: italic;
  margin-top: 1rem;
  /* margin-bottom: 1rem; */
  margin-left: 7.5rem;
  background: linear-gradient(to right, #343b47 0%, #4c5566 100%);
  border-radius: 10px;
  height: 13px;
  width: 150px;
  color: #1AB8C4;


  span{
    margin-top: 0;
  }
  span:first-child{
    margin-left: .3rem;
  }
  span:last-child{
    float: right;
    clear: left;
    margin-right: .3rem;
  }
`;

const Divider = styled.div`
  border-bottom: 1px solid #343b47;
  margin-bottom: 1rem;
`
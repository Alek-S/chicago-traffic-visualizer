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
  background: ${props => props.theme.panel.background};
  box-shadow: ${props => props.theme.panel.boxShadow};
  box-sizing: border-box;
  color: ${props => props.theme.font.color.main};
  cursor: default;
  font-family: ${props => props.theme.font.main};
  font-weight: ${props => props.theme.font.weight.main};
  position: fixed;
  right: 0rem;
  bottom: 2.5rem;
  width: ${props => props.theme.panel.width};
  z-index: 9;


  h1 {
    background: ${props => props.theme.panel.headerGradient};
    color: ${props => props.theme.font.color.header};
    font-size: ${props => props.theme.font.size.subheader};
    letter-spacing: 1px;
    font-weight: ${props => props.theme.font.weight.main};
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
    font-weight: ${props => props.theme.font.weight.main};
    color: ${props => props.theme.font.color.header};
    font-style: italic;
  }

  ul {
    padding-left: 0;
    margin-left: 1rem;
  }

  li {
    list-style: none;
    font-size: 12px;
    font-weight: ${props => props.theme.font.weight.strong};
    margin-bottom: 1.5rem;

    p{
      margin-top: .1rem;
      margin-left: .5rem;
      margin-right: .5rem;
      font-weight: ${props => props.theme.font.weight.main};
      font-style: italic;
    }
  }

  & .hidden{
    display: none;
  }
`;

const Gradient = styled.div`
  background: linear-gradient(to right, ${props => props.from} 0%, ${props => props.middle} 60%, ${props => props.to} 100%);
  border-radius: 2px;
  clear: left;
  float: right;
  height: 10px;
  margin-right: 1rem;
  position: relative;
  border-radius: 10px;
  top: 5px;
  width: 150px;
`;

const Scale= styled.div`
  background: linear-gradient(to right, #343b47 0%, #4c5566 100%);
  border-radius: 10px;
  color: ${props => props.theme.font.color.header};
  font-size: 9px;
  font-style: italic;
  height: 13px;
  margin-top: 1rem;
  margin-left: 7.5rem;
  position: relative;
  top: -15px;
  width: 150px;


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
  border-bottom: 1px solid ${props => props.theme.panel.color.dark};
  margin-bottom: 1rem;
`
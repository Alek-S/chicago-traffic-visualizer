import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

/** @class
 * @name Key
 * Key UI to provide information on what data is being rendered
 *
 * @param {Array} props.keyEntries - what keys to show
 * @param {Object} props.controls - whats shown and hidden
 * @returns {JSX}
*/
export default class Key extends Component {
  getEntries = () => {
    let from = '';
    let middle = '';
    let to = '';
    let display = '';

    const list = this.props.keyEntries.map( (entry, i) =>{
      display = 'hidden';

      switch(entry){
        case 'Buses':
          from = '#3FFF3F';
          middle = '#17B8BE';
          to = '#FF00FF';
          display = this.props.controls.showTrips ? '' : 'hidden';
          break;
        case 'Buildings':
          from = this.props.controls.showBuildingColors ? '#82FF95' : '#3B4046';
          middle = this.props.controls.showBuildingColors ? '#84CCCA' : '#3B4046';
          to = this.props.controls.showBuildingColors ? '#8598FF' : '#3B4046';
          display = this.props.controls.showBuildings ? '' : 'hidden';
          break;
        case 'Pedestrians':
          from ='#3BC12F';
          middle = '#7F9B25';
          to = '#C3741B';
          display = this.props.controls.showPedestrians ? '' : 'hidden';
          break;
        case 'Potholes':
          from = '#208BD8';
          middle = '#208BD8';
          to = '#208BD8';
          display = this.props.controls.showPotholes ? '' : 'hidden';
          break;
        default:
          from = '#fff';
          middle = '#808080';
          to = '#000';
      }

      return (
        <li key={i.toString()} className={display}>
          {entry}: <Gradient from={from} middle={middle} to={to}></Gradient>
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
  keyEntries: ['Buses', 'Buildings', 'Pedestrians', 'Potholes']
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
  background: linear-gradient(to right, ${props => props.from} 0%, ${props => props.middle} 50%, ${props => props.to} 100%);
  border-radius: 2px;
  margin-right: 1rem;
  float: right;
  clear: left;
  top: 10px;
`;

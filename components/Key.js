import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

/** @class 
 * @name Key
 * Key UI to provide information on what data is being rendered
 * 
 * @param {Array} props.keyEntries - what keys to show
 * @returns {JSX}
*/
export default class Key extends Component {
  // componentDidMount() {
  //   console.log(this.props.keyEntries)
  // }

  getEntries = () => {
    let from = '#fff';
    let to = '#000';

    const list = this.props.keyEntries.map( (entry, i) =>{
      if (entry === 'Buses'){
        from = '#1AB8C4'
        to = '#ff884d'
        // return (
        //   <li key={i.toString()}>
        //     {entry}: <Gradient from='#1AB8C4' to='#ff884d'></Gradient>
        //   </li>
        // )
      }else{
        from = '#fff';
        to = '#000';
      }

      return (
        <li key={i.toString()}>
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
  keyEntries: PropTypes.arrayOf(PropTypes.string).isRequired
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
  top: 28rem;
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

  li{
    list-style: none;
    line-height: 2;
    font-size: 12px;
  }
`;

const Gradient = styled.div`
  /* display: inline-block; */
  position: relative;
  height: 10px;
  width: 150px;
  background: linear-gradient(to right, ${props => props.from} 0%, ${props => props.to} 100%);
  border-radius: 2px;
  margin-right: 1rem;
  float: right;
  clear: left;
  top: 5px;
`;

import React, { Component } from 'react';
import styled from 'styled-components';

/** @class 
 * @name Header
 * Top header element of page - always viewable
 * 
 * @returns {JSX}
*/
export default class Header extends React.Component {
  render(){
    return(
      <StyledHeader>Chicago Traffic Visualizer Header</StyledHeader>
    )
  }
}

const StyledHeader = styled.div`
  background-color: rgba(57, 58, 61, .85);
  border-radius: .2rem;
  color: #bfbfbf;
  box-shadow: 0px 0px 41px 0px rgba(0,0,0,.3);
  font-family: Helvetica, Arial, sans-serif;
  font-size: 2.2rem;
  font-weight: lighter;
  letter-spacing: 1px;
  position: fixed;
  margin-top: .5rem;
  margin-left: .5rem;
  padding: .5rem;
  z-index: 1000;
`;
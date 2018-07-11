import React, { Component } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DatGui, { DatBoolean, DatSelect, DatNumber, DatString } from 'react-dat-gui';


export default class ControlPanel extends Component {
  state = {
    isVisible: true,
  }
  togglePanel = () => {
    const { isVisible } = this.state;
    this.setState({ isVisible: !isVisible })
  }
  render() {
    const { update, controls } = this.props;
    const { isVisible } = this.state;
    return (
      <StyledControlPanel>
        <h1>Chicago Traffic Visualizer
        {/* <FontAwesomeIcon icon="coffee" onClick={this.togglePanel} /> */}
        </h1>
        {isVisible &&
          <DatGui data={controls} onUpdate={update}>
            <DatBoolean path='showBuildings' label='Show Buildings: '/>
            <DatSelect label="Map Type " path='mapType' options={['street', 'dark', 'light', 'outdoors', 'satellite', 'satellite-street']}/>
            <DatBoolean path='confetti' label='Confetti:' />
          </DatGui>
        }
      </StyledControlPanel>
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
  height: 13rem;
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
    background-color: #343b47;
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
  }
  li:before{
    content: '»';
    padding-right: .5rem;
  }
  li:hover{
    color: #1AB8C4;
    background-color: #343b47;
    box-shadow: 0px 0px 20px 0px rgba(114,124,140,0.2);
  }

  div {
    height: 500px;
    transition: height: 1s linear;
  }
`
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
    const { update, controls, frameTime, date } = this.props;
    const { isVisible } = this.state;
    return (
      <StyledControlPanel>
        <h1>Chicago Traffic Visualizer
        {/* <FontAwesomeIcon icon="coffee" onClick={this.togglePanel} /> */}
        </h1>
        <p>frame {frameTime}</p>
        <p>Date {date}</p>
        {isVisible &&
          <DatGui data={controls} onUpdate={update}>
            <DatBoolean path='showBuildings' label='Show Buildings? ' />
            <DatSelect label="Map Type " path='mapType' options={['street', 'dark', 'light', 'outdoors', 'satellite', 'satellite-street']}/>
            <DatBoolean path='confetti' label='Confetti?' />
          </DatGui>
        }
      </StyledControlPanel>
    )
  }
}

const StyledControlPanel = styled.div`
  box-sizing: border-box;
  font-family: 'menlo';
  z-index: 99;
  background: #555;
  border-radius: 6px;
  box-shadow: 0px 0px 50px rgba(0,0,0,0.6);
  width: 400px;
  position: fixed;
  right: 30px;
  top: 30px;
  padding: 20px;
  h1, h2, h3, p, span, ul, li {
    color: #ccc;
    font-weight: 100;
  }
  h1 {
    font-size: 18px;
  }
  div {
    height: 500px;
    transition: height: 1s linear;
  }
`
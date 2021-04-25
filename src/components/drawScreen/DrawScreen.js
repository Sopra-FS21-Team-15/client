import styled from 'styled-components';
import React from 'react';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import Player from '../../views/Player';
import Lobby from '../../views/Lobby';
import { Spinner } from '../../views/design/Spinner';
import { Button } from '../../views/design/Button';
import { withRouter } from 'react-router-dom';
import Colour from '../../views/Colour';

const Canvas = styled.canvas`
  position: absolute;

  // Place not in the middle of the whole screen but in middle of what is left
  // when you substract the sidebar-width.
  left: calc(50% - 256px / 2);
  transform: translateX(-50%);

  box-shadow: 8px 8px 8px rgba(0, 0, 0, 0.7);
  border-radius: 8px;
`;

const Sidebar = styled.div`
  width: 256px;
  height: 100%;
  background: rgba(50, 50, 50, 0.9);
  box-shadow: rgba(0, 0, 0, 0.9) 0px -4px 4px;

  transition: width 1s;

  position: absolute;
  right: 0px;
  top: 0px;

  padding: 0px 5px;
  text-align: center;
`;

const HR = styled.hr`
  color: rgba(255, 255, 255, 0.1);
  width 90%;
  margin-top: 1em;
  margin-bottom: 1em;
`;

const H1 = styled.h1`
  color: white;
  font-variant: small-caps;
`;

const BrushPreview = styled.div`
  width: 10px;
  height: 10px;
  background: red;
  border-radius: 50%;
  margin: 0 auto;
`;

const ColoursContainer = styled.div`
  // display: inline-block;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fill, 64px);

  // background: rgba(255, 0, 0, 0.3);
`;

const Label = styled.label`
  color: #999999;
  margin-bottom: 10px;
  font-variant: small-caps;
`;

const InputField = styled.input`
  &::placeholder {
    color: black;
  }
  height: 35px;
  padding-left: 15px;
  margin: 12px;
  border: none;
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 1);
  color: black;
`;



class DrawScreen extends React.Component {
  constructor() {
    super();

    this.mainCanvas = React.createRef();
    this.brushPreview = React.createRef();

    this.colours = [
      "#000000",
      "#f44336",
      "#e91e63",
      "#9c27b0",
      "#673ab7",
      "#3f51b5",
      "#2196f3",
      "#03a9f4",
      "#00bcd4",
      "#009688",
      "#4caf50",
      "#8bc34a",
      "#cddc39",
      "#ffeb3b",
      "#ffc107",
      "#ff9800",
      "#ff5722",
      "#795548",
      "#9e9e9e",
      "#607d8b",
      "#ffffff"
      ];

    this.state = {
      canvas_width: 854,
      canvas_height: 480,
      draw_colour: "#ffffff",
      draw_size: 5,
      mouse_down: false, // stores whether the LEFT mouse button is down
      loginId: localStorage.getItem('loginId') //added the login Id
    };
  }

  handleInputChange(key, value) {
    this.setState({ [key]: value });
  }

  resetCanvas() {
    this.mainCanvas.current.width = this.state.canvas_width;
    this.mainCanvas.current.height = this.state.canvas_height;
    let ctx = this.mainCanvas.current.getContext('2d');

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, this.state.canvas_width, this.state.canvas_height);
  }

  fillCanvas() {
    this.mainCanvas.current.width = this.state.canvas_width;
    this.mainCanvas.current.height = this.state.canvas_height;
    let ctx = this.mainCanvas.current.getContext('2d');

    ctx.fillStyle = this.state.draw_colour;
    ctx.fillRect(0, 0, this.state.canvas_width, this.state.canvas_height);
  }

  updateBrushPreview() {
    this.brushPreview.current.style.width = this.state.draw_size + "px";
    this.brushPreview.current.style.height = this.state.draw_size + "px";
    this.brushPreview.current.style.background = this.state.draw_colour;
  }

  changeColour(colour) {
    this.setState({ ['draw_colour']: colour });

    let ctx = this.mainCanvas.current.getContext('2d');
    ctx.strokeStyle = colour;

    this.updateBrushPreview();
  }

  changeSize(size) {
    this.setState({ ['draw_size']: size });

    let ctx = this.mainCanvas.current.getContext('2d');
    ctx.lineWidth = size;

    this.updateBrushPreview();
  }

  // Draws a line at the position x,y
  canvas_onMouseMove(x, y) {
    if(!this.state.mouse_down)
      return;

    let ctx = this.mainCanvas.current.getContext('2d');

    // Calculate mouse position relative to canvas
    let rect = this.mainCanvas.current.getBoundingClientRect();
    x -= rect.left;
    y -= rect.top;

    // Send draw instruction to the backend
    this.sendDrawInstruction(x, y, ctx.lineWidth, ctx.strokeStyle);

    ctx.lineTo(x, y);
    ctx.stroke();
  }

  async sendDrawInstruction(x, y, size, colour) {
    try {
      const requestBody = JSON.stringify({
        user_id: this.state.loginId,
        x: x,
        y: y,
        size: size,
        colour: colour
      /** await the confirmation of the backend **/
      const response = await api.put('/drawing', requestBody);
    } catch (error) {
      alert(`Something went wrong while sending the drawing instruction: \n${handleError(error)}`);
    }

  }

  canvas_onMouseDown(button) {
    console.log("Down");
    if(button == 0) {
      let ctx = this.mainCanvas.current.getContext('2d');
      this.setState({ mouse_down: true });
      ctx.beginPath();
    }
  }

  canvas_onMouseUp(button) {
    console.log("Up");
    if(button == 0)
      this.setState({ mouse_down: false });
  }

  componentDidMount() {
    this.resetCanvas();
    this.updateBrushPreview();
  }

  render() {
    return ([
      // Lobby list
      <Canvas id="mainCanvas" ref={this.mainCanvas} onMouseMove={(e) => this.canvas_onMouseMove(e.clientX, e.clientY)}
        onMouseDown={(e) => {this.canvas_onMouseDown(e.button)}} onMouseUp={(e) => {this.canvas_onMouseUp(e.button)}}></Canvas>,
      <Sidebar>
        <H1 onClick={this.changeColour}>Tools</H1>
        <HR />
        <ColoursContainer>
            {this.colours.map(colour => {
              return (
                <Colour colour={colour} f_onClick={() => {this.changeColour(colour)}} />
              );
            })}
        </ColoursContainer>
        <HR/>
        <Label>Size</Label>
        <InputField value={this.state.draw_size} onChange={e => {this.changeSize(e.target.value);}} id="input_size" type="range" min="1" max="100" />
        <HR/>
        <Button width="40%" onClick={() => {this.fillCanvas()}}>Fill</Button>
        <Button width="40%" onClick={() => {this.resetCanvas()}}>Clear</Button>
        <HR />
        <BrushPreview ref={this.brushPreview}></BrushPreview>
      </Sidebar>
    ]);
  }
}

export default withRouter(DrawScreen);

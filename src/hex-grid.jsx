import React from 'react';
import autobind from './autobind';

function position(el) {
  let element = el;
  let x = 0;
  let y = 0;
  while (element) {
    x += element.offsetX;
    y += element.offsetY;
    element = element.offsetParent;
  }
  return [x, y];
}

const fills9 = [
  'white',
  'white',
  'white',
  'blue',
  'blue',
  'blue',
  'green',
  'brown',
  'brown',
  'blue',
];

const fills5 = [
  'white',
  'white',
  'blue',
  'blue',
  'green',
  'brown',
  'brown',
  'blue',
];

const fills3 = [
  'white',
  'blue',
  'green',
  'brown',
  'brown',
  'blue',
];

class HexGrid extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      selected: [],
    };
    // this.step = this.step.bind(this);
    // this.step();
  }

  handleMouseDown(event) {
    this.mouseX = event.pageX;
    this.mouseY = event.pageY;
    this.select(i, j);
    event.preventDefault();
    return false;
  }

  select(i, j) {
    this._deselect();
    this.setState({selected: [i, j]});
  }

  deselect() {
    this._deselect();
    this.setState({selected: []});
  }

  _deselect() {
    if (this.refs.selected) {
      this.refs.selected.style.left = '';
      this.refs.selected.style.top = '';
      this.refs.selected.style.zIndex = '';
    }
  }

  dragSelectedElement() {
    let angle = Math.atan2(event.pageY - this.mouseY, event.pageX - this.mouseX);
    if (this.refs.selected) {
      this.refs.selected.style.left = (event.pageX - this.mouseX);
      this.refs.selected.style.top = (event.pageY - this.mouseY) + (this.state.selected[0] % 2 ? 25 : 0);
      this.refs.selected.style.zIndex = 1;
    }
    if (angle < -Math.PI / 4 && angle > -Math.PI * 3 / 4) {
      this.refs.selected.style.top = '';
    }
    // this.mouseX = event.pageX;
    // console.log(event, event.pageX, event.pageY);
  }

  // step() {
  //   this._stepId = requestAnimationFrame(this.step);
  //   if (this.refs.selected) {
  //     let [x] = position(this.refs.selected);
  //     x -= this.refs.selected.style.left;
  //     x -= this.mouseX;
  //     this.refs.selected.style.left = this.mouseX;
  //   }
  // }

  componentWillUnmount() {
    cancelAnimationFrame(this._stepId);
  }

  tileClassName(i, j, tile, selected) {
    return `hex-grid-tile${
      tile !== null ? '' : ' hex-grid-tile-blank'
    }${
      selected[0] === i && selected[1] === j ? ' selected' : ''
    }`;
  }

  tileRef(i, j, selected) {
    return selected[0] === i && selected[1] === j ?
      'selected' :
      `${i},${j}`;
  }

  render() {
    const props = this.props;
    const selected = this.state.selected;
    return (<div className="hex-grid"
      onMouseUp={this.deselect}
      onMouseLeave={this.deselect}
      onMouseMove={this.dragSelectedElement}>
      {props.tiles.map((row, j) => (
        <div className="hex-grid-row">
          {row.map((tile, i) => (
            <svg className={this.tileClassName(i, j, tile, selected)} viewBox="0 0 200 175" xmlns="http://www.w3.org/2000/svg">
              <g style={{stroke: 'black', strokeWidth: '10px', fill: tile !== null ? fills3[tile] : 'white'}}>
                <path d="M 5 87.5 l 47.5 -82.272 h 95 l 47.5 82.272 l -47.5 82.272 h -95 l -47.5 -82.272 l 47.5 -82.272" />
              </g>
                <text x="87.5" y="100" fontSize="50" fontFamily="arial">{tile}</text>
            </svg>
          ))}
        </div>
      ))}
    </div>);
  }
}

export default autobind(HexGrid);

// debugger;

import React from 'react';
import update from 'react-addons-update';

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

// <path d="M 5 87.5 l 47.5 -82.272 h 95 l 47.5 82.272 l -47.5 82.272 h -95 l -47.5 -82.272 l 47.5 -82.272" />

class HexTile extends React.Component {
  shouldComponentUpdate(newProps) {
    const props = this.props;
    return (props.tile !== newProps.tile);
  }

  tileClassName(i, j, tile, selected) {
    return `hex-grid-tile tile-${i}-${j} ${
      tile !== null ? '' : ' hex-grid-tile-blank'
    }${
      selected[0] === i && selected[1] === j ? ' selected' : ''
    }${typeof tile === 'object' && tile.ships && tile.ships.length ?
      ' hex-grid-tile-ship' :
      ''}`;
  }

  tileBase(tile) {
    return typeof tile === 'number' ? tile : tile.base;
  }

  render() {
    const {tile, i, iBase, j} = this.props;
    // <text x="87.5" y="100" fontSize="50" fontFamily="arial">{this.tileBase(tile)}</text>
    return (
      <svg
        key={i}
        className={
          this.tileClassName(i, j, tile, [-1, -1])
        }
        style={{
          top: (j % 8 > 0 ? (j % 8) * 43.75 : 0) + (i % 2) * 21.875,
          left: (i % 8 > 0 ? (i % 8) * 37 : 0) + (i % 8 > 0 ? 13 : 0),
          // top: (j % 8 > 0 ? (j % 8) * 66 : 0) + (i % 2) * 21.875,
          // left: (i % 8 > 0 ? (i % 8) * 50 : 0) + (i % 8 > 0 ? 13 : 0),
          // zIndex: (j % 8) * 8 + (i % 8),
        }}
        viewBox="0 0 200 175" xmlns="http://www.w3.org/2000/svg">
        <polygon
          points="5,87.5 52.5,5.228 147.5,5.228 195,87.5 147.5,169.772 52.5,169.772 5,87.5"
          style={{
            strokeWidth: '10px',
            fill: this.tileBase(tile) !== null ? fills3[this.tileBase(tile)] : 'white'
          }} />
      </svg>
    );
  }
}

class HexTileGroup extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      visible: false,
    };
  }

  componentWillReceiveProps(newProps) {
    // if (!this.state.visible && newProps.onVisible) {
    //   newProps.onVisible(this.rect(), this, this.onVisible);
    // }
  }

  shouldComponentUpdate(newProps, newState) {
    const props = this.props;
    return (
      props.group !== newProps.group ||
      this.state.visible !== newState.visible
    );
  }

  tileBase(tile) {
    return typeof tile === 'number' ? tile : tile.base;
  }

  rect() {
    const {i, j} = this.props;
    const top = j > 0 ? 350 * j : 0;
    const left = i > 0 ? 296 * i : 0;
    return {
      top,
      left,
      bottom: top + 350,
      right: left + 309,
    };
  }

  onVisible() {
    console.log('onVisible', this.rect());
    // Promise.resolve()
    // .then(() => {
    // requestAnimationFrame(() => {
    //   requestAnimationFrame(() => {
      this.setState({
        visible: true,
      });
    //   });
    // });
  }

  render() {
    const {group, active, i, j} = this.props;
    let content = group;
    if (!this.state.visible && !active) {
      return (<div className={`hex-grid-tile-group ${active ? 'active' : ''}`} style={{
        top: j > 0 ? 350 * j : 0,
        left: i > 0 ? 296 * i : 0,
        // top: j > 0 ? 550 * j : 0,
        // left: i > 0 ? 400 * i : 0,
        // left: active ? (i > 0 ? 296 * i : 0) : 0,
        // top: active ? (j > 0 ? 350 * j : 0) : 0,
        // transform: active ? 'translateZ(0)' : `translate3d(${i > 0 ? 296 * i : 0}px, ${j > 0 ? 350 * j : 0}px, 0)`,
        // transform: active ? 'translateZ(0)' : `translate3d(${i > 0 ? 310 * i : 0}px, ${j > 0 ? 350 * j : 0}px, 0)`,
      }}></div>);
    }
    // if (!active) {
    //   content = (
    //     <svg
    //       // key={i}
    //       // className={
    //       //   this.tileClassName(i, j, tile, [-1, -1])
    //       // }
    //       // style={{
    //       //   top: (j % 8 > 0 ? (j % 8) * 43.75 : 0) + (i % 2) * 20.875,
    //       //   left: (i % 8 > 0 ? (i % 8) * 37 : 0) + (i % 8 > 0 ? 13 : 0),
    //       // }}
    //       viewBox="0 0 1250 1487.5" xmlns="http://www.w3.org/2000/svg">
    //       {group.map((tile, i) => (
    //         <g
    //         transform={`translate(${
    //           (i % 8) * 150}, ${
    //           (i / 8 | 0) * 175 + (i % 2) * 87.5
    //         })`}
    //         >
    //         <polygon
    //           points="5,87.5 52.5,5.228 147.5,5.228 195,87.5 147.5,169.772 52.5,169.772 5,87.5"
    //           style={{
    //             stroke: 'black',
    //             strokeWidth: '10px',
    //             fill: this.tileBase(tile.props.tile) !== null ? fills3[this.tileBase(tile.props.tile)] : 'white'
    //           }} />
    //         </g>
    //       ))}
    //     </svg>
    //   );
    // }
    return (<div className={`hex-grid-tile-group ${active ? 'active' : ''}`} style={{
      top: j > 0 ? 350 * j : 0,
      left: i > 0 ? 296 * i : 0,
      // top: j > 0 ? 550 * j : 0,
      // left: i > 0 ? 400 * i : 0,
      // left: active ? (i > 0 ? 296 * i : 0) : 0,
      // top: active ? (j > 0 ? 350 * j : 0) : 0,
      // transform: active ? 'translateZ(0)' : `translate3d(${i > 0 ? 296 * i : 0}px, ${j > 0 ? 350 * j : 0}px, 0)`,
      // transform: active ? 'translateZ(0)' : `translate3d(${i > 0 ? 310 * i : 0}px, ${j > 0 ? 350 * j : 0}px, 0)`,
    }}>
      {content.reduce((carry, tile, index) => {
        if (!carry[index / 8 | 0]) {
          carry.push([]);
        }
        carry[index / 8 | 0].push(tile);
        return carry;
      }, [])
      .map(row => <div>{row}</div>)}
    </div>);
  }
}

autobind(HexTileGroup);

class HexRow extends React.Component {
  constructor(...args) {
    super(...args);
    const {row, j} = this.props;
    this.state = {
      groups: row.reduce((carry, tile, i) => {
        if (carry[carry.length - 1].length >= 8) {
          carry.push([]);
        }
        carry[carry.length - 1]
        .push(<HexTile key={i} tile={tile} i={i} iBase={((i / 8) | 0) * 8} j={j}/>);
        return carry;
      }, [[]]),
      row: row.map((tile, i) => (
        <HexTile key={i} tile={tile} i={i} j={j}/>
      )),
    };
  }

  shouldComponentUpdate(newProps, newState) {
    // console.log('shouldComponentUpdate');
    const props = this.props;
    return (
      props.row !== newProps.row ||
      this.state.row !== newState.row
    );
  }

  componentWillReceiveProps(newProps) {
    const {row, j} = this.props;
    if (row === newProps.row) {return;}
    const newRow = newProps.row;
    const change = {groups: {}};
    for (let i = 0; i < row.length; i++) {
      if (row[i] !== newRow[i]) {
        if (!change.groups[(i / 8) | 0]) {
          change.groups[(i / 8) | 0] = {$splice: []};
        }
        change.groups[(i / 8) | 0].$splice.push([
          i - ((i / 8) | 0) * 8, 1,
          <HexTile key={i} tile={newRow[i]} i={i} iBase={((i / 8) | 0) * 8} j={j}/>
        ]);
      }
    }
    // console.log(Object.keys(change.row));
    if (Object.keys(change.groups).length) {
    // const change = {row: {$splice: []}};
    // for (let i = 0; i < row.length; i++) {
    //   if (row[i] !== newRow[i]) {
    //     change.row.$splice.push([i, 1, <HexTile key={i} tile={newRow[i]} i={i} j={j}/>]);
    //   }
    // }
    // // console.log(Object.keys(change.row));
    // if (Object.keys(change.row).length) {
      this.setState(update(this.state, change));
    }
  }

  render() {
    // console.log('render');
    const {row, j} = this.props;
    return (
      <div className="hex-grid-row">
        {this.state.groups.map((tiles, i) => <HexTileGroup group={tiles} index={i} />)}
      </div>
    );
  }
}

class HexGrid extends React.Component {
  constructor(...args) {
    super(...args);
    const {tiles} = this.props;
    const hexTiles = tiles
    .reduce((carry, row, j) => {
      row.forEach((cell, i) => {
        const index = ((j / 8) | 0) * 8 + (i / 8) | 0;
        if (!carry[index]) {
          carry[index] = [];
        }
        carry[index].push(<HexTile key={j * 64 + i} tile={cell} i={i} j={j} />);
      });
      return carry;
    }, []);
    this.state = {
      selected: [],
      // grid: tiles.map((row, j) => (
      //   <HexRow row={row} j={j} key={j} />
      // )),
      rows: tiles,
      tiles: hexTiles,
      groups: hexTiles
      .map((group, index) => (
        <HexTileGroup
          ref={this.props.groupRef}
          key={index}
          group={group}
          i={index % 8} j={(index / 8) | 0} />
      )),
      activeGroup: <span key="active"></span>
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

  tileRef(i, j, selected) {
    return selected[0] === i && selected[1] === j ?
      'selected' :
      `${i},${j}`;
  }

  componentWillReceiveProps(newProps) {
    const rows = this.props.tiles;
    const newRows = newProps.tiles;
    if (rows === newRows) {return;}
    const change = {
      rows: {$set: newRows},
      tiles: {},
      groups: {$splice: []},
    };
    for (let j = 0; j < newRows.length; j++) {
      if (rows[j] !== newRows[j]) {
        const row = rows[j];
        const newRow = newRows[j];
        for (let i = 0; i < newRow.length; i++) {
          if (row[i] !== newRow[i]) {
            const index = ((j / 8) | 0) * 8 + (i / 8) | 0;
            if (!change.tiles[index]) {
              change.tiles[index] = {$splice: []};
            }
            change.tiles[index].$splice.push(
              [
                (j % 8) * 8 + (i % 8), 1,
                <HexTile key={j * 64 + i} tile={newRow[i]} i={i} j={j} />,
              ]
            );
          }
        }
      }
    }
    const tiles = this.state.tiles;
    change.tiles = {$set: update(tiles, change.tiles)};
    const newTiles = change.tiles.$set;
    for (let index = 0; index < newTiles.length; index++) {
      if (tiles[index] !== newTiles[index]) {
        change.groups.$splice.push(
          [index, 1, <HexTileGroup
            ref={this.props.groupRef}
            key={index}
            index={index}
            group={newTiles[index]}
            i={index % 8} j={(index / 8) | 0} />]
        );
      }
    }
    if (change.groups.$splice.length === 1) {
      const activeIndex = change.groups.$splice[0][2].props.index;
      change.activeGroup = {$set: 
        <HexTileGroup
          key="active"
          active={true}
          index={activeIndex}
          group={newTiles[activeIndex]}
          i={activeIndex % 8} j={(activeIndex / 8) | 0} />
      };
      delete change.groups;
    }
    else {
      change.activeGroup = {$set: <span key="active"></span>}
    }
    this.setState(update(this.state, change));
    // if (Object.keys(change.grid).length) {
    // }

    // const {tiles} = this.props;
    // if (tiles === newProps.tiles) {return;}
    // const newGrid = newProps.tiles;
    // const change = {grid: {$splice: []}};
    // for (let j = 0; j < tiles.length; j++) {
    //   if (tiles[j] !== newGrid[j]) {
    //     change.grid.$splice.push([j, 1, <HexRow key={j} row={newGrid[j]} j={j}/>]);
    //   }
    // }
    // // console.log(Object.keys(change.row));
    // if (Object.keys(change.grid).length) {
    //   this.setState(update(this.state, change));
    // }
  }

  render() {
    const {tiles} = this.props;
    const selected = this.state.selected;
    return (<div className="hex-grid"
      onMouseUp={this.deselect}
      onMouseLeave={this.deselect}
      onMouseMove={this.dragSelectedElement}>
      <div className="hex-grid-stable">
        {this.state.groups}
      </div>
      {this.state.activeGroup}
    </div>);
  }
}

export default autobind(HexGrid);

// debugger;

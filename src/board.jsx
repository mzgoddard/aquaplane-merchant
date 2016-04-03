import React, {Component} from 'react';

import HexGrid from './hex-grid';

// <HexGrid tiles={[0, 1, 2, 3, 4].map(() => [0, 1, 2, 3, 4])} />
// <HexGrid tiles={[[null, 1, 2, 3, null], [0, 1, 2, 3, 4], [0, 1, 2, 3, 4], [0, 1, 2, 3, 4], [null, null, 2, null, null]]} />
// <HexGrid tiles={[
//   [null, null, null, 3, 4, 5, null, null, null],
//   [null, 1, 2, 3, 4, 5, 6, 7, null],
//   [0, 1, 2, 3, 4, 5, 6, 7, 8],
//   [0, 1, 2, 3, 4, 5, 6, 7, 8],
//   [0, 1, 2, 3, 4, 5, 6, 7, 8],
//   [0, 1, 2, 3, 4, 5, 6, 7, 8],
//   [0, 1, 2, 3, 4, 5, 6, 7, 8],
//   [null, null, 2, 3, 4, 5, 6, null, null],
//   [null, null, null, null, 4, null, null, null, null]
// ]} />

const _relative = [
  [
    [0, -1],
    [1, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
    [-1, -1],
  ],
  [
    [0, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
  ],
];

function relative(x, y, d) {
  let [dx, dy] = _relative[x % 2][d];
  return [x + dx, y + dy];
}

function inHex(i, j, n) {
  let ceil2 = Math.ceil(n / 2);
  let floor2 = Math.floor(n / 2);
  let jReverse = n - j;
  let jPlus = j + 1;
  let even = i % 2;
  return Boolean(
    ceil2 + j * 2 + even > i &&
    ceil2 - jPlus * 2 - even < i &&
    floor2 + jReverse * 2 - even > i &&
    floor2 - jReverse * 2 + even < i);
}

function inHexOdd(i, j, n) {
  let ceil2 = Math.ceil(n / 2);
  let floor2 = Math.floor(n / 2);
  let jReverse = n - j;
  let jPlus = j + 1;
  let even = i % 2;
  return Boolean(
    floor2 + jPlus * 2 - even > i &&
    floor2 - jPlus * 2 + even < i &&
    ceil2 + (n - j - 1) * 2 + even > i &&
    ceil2 - jReverse * 2 - even < i);
}
// grid5x5.map(v => inHexOdd(v[0]+1, v[1]+1, 3))

const _inHex = {
  3: map(newGrid(3), (j, i) => inHex(i, j, 3)),
  5: map(newGrid(5), (j, i) => inHex(i, j, 5)),
};

const _inHexOdd = {
  3: map(newGrid(3), (j, i) => inHexOdd(i, j, 3)),
  5: map(newGrid(5), (j, i) => inHexOdd(i, j, 5)),
};

function hexHex(n) {
  let grid = [];
  let ceil2 = Math.ceil(n / 2);
  let floor2 = Math.floor(n / 2);
  for (let j = 0; j < n; j++) {
    let jReverse = n - j;
    let jPlus = j + 1;
    let row = [];
    for (let i = 0; i < n; i++) {
      let even = i % 2;
      row.push(
        ceil2 + j * 2 + even > i &&
        ceil2 - jPlus * 2 - even < i &&
        floor2 + jReverse * 2 - even > i &&
        floor2 - jReverse * 2 + even < i ?
        i :
        null);
    }
    grid.push(row);
  }
  return grid;
}

function hexHexOdd(n) {
  let grid = [];
  for (let j = 0; j < n; j++) {
    let row = [];
    for (let i = 0; i < n; i++) {
      row.push(inHexOdd(i, j, n) ?
        i :
        null);
    }
    grid.push(row);
  }
  return grid;
}

function positionGrid(m, n) {
  const grid = [];
  const mHalf = (m / 2) | 0;
  const nHalf = (n / 2) | 0;
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < m; i++) {
      grid.push([i - mHalf, j - nHalf]);
    }
  }
  return grid;
}

const grid3x3 = positionGrid(3, 3);
const grid5x5 = positionGrid(5, 5);
const grid7x7 = positionGrid(7, 7);

console.log(grid3x3);
console.log(grid5x5);

function flat(grid) {
  return grid.reduce((carry, row) => carry.concat(row), []);
}

function adjacentXgrid(grid, x) {
  return grid.reduce((carry, row) => carry + row.reduce((carry, v) => carry + (v === x ? 1 : 0), 0), 0);
}

function adjacentX(grid, x) {
  return grid.reduce((carry, v) => carry + (v === x ? 1 : 0), 0);
}

function adjacentXiter(iter, x) {
  let carry = 0;
  for (let v of iter) {
    carry += v === x ? 1 : 0;
  }
  return carry;
}

function newGrid(size) {
  let grid = [];
  for (let j = 0; j < size; j++) {
    let row = [];
    for (let i = 0; i < size; i++) {
      row.push(1);
    }
    grid.push(row);
  }
  return grid;
}

function subgrid(grid, y, x, size) {
  return map(newGrid(size), (j, i, g) => {
    return grid[y + j][x + i];
  });
}

const _subgrids = {};

function subgriditer(grid, y, x, size) {
  if (!_subgrids[size]) {
    _subgrids[size] = newGrid(size);
  }
  return mapiter(_subgrids[size], (j, i, g) => {
    return grid[y + j][x + i];
  });
}

function subhexgrid3(grid, y, x) {
  return map(subgrid(grid, y - 1, x - 1, 3), (j, i, g) => {
    if (x % 2 === 0 ? inHexOdd(i, j, 3) : inHex(i, j, 3)) {
      return grid[y - 1 + j][x - 1 + i];
    }
    return null;
  });
}

function subhexgrid3fn(grid, y, x, fn) {
  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < 3; i++) {
      if (x % 2 === 0 ? _inHexOdd[3][j][i] : _inHex[3][j][i]) {
        fn(grid[y - 1 + j][x - 1 + i]);
      }
    }
  }
}

function subhexgrid3iter(grid, y, x) {
  if (!_subgrids[3]) {
    _subgrids[3] = newGrid(3);
  }
  return mapiter(_subgrids[3], (j, i) => {
    if (x % 2 === 0 ? inHexOdd(i, j, 3) : inHex(i, j, 3)) {
      return grid[y - 1 + j][x - 1 + i];
    }
    return null;
  });
}

function subhexgrid5(grid, y, x) {
  if (!_subgrids[5]) {
    _subgrids[5] = newGrid(5);
  }
  return map(_subgrids[5], (j, i, g) => {
    if (x % 2 === 0 ? inHex(i, j, 5) : inHexOdd(i, j, 5)) {
      return grid[y - 2 + j][x - 2 + i];
    }
    return null;
  });
}

function subhexgrid5fn(grid, y, x, fn) {
  for (let j = 0; j < 5; j++) {
    for (let i = 0; i < 5; i++) {
      if (x % 2 === 0 ? _inHex[5][j][i] : _inHexOdd[5][j][i]) {
        fn(grid[y - 2 + j][x - 2 + i]);
      }
    }
  }
}

function subhexgrid5iter(grid, y, x) {
  if (!_subgrids[5]) {
    _subgrids[5] = newGrid(5);
  }
  return mapiter(_subgrids[5], (j, i) => {
    if (x % 2 === 0 ? inHex(i, j, 5) : inHexOdd(i, j, 5)) {
      return grid[y - 2 + j][x - 2 + i];
    }
    return null;
  });
}

function map(grid, fn) {
  const newgrid = newGrid(grid.length);
  for (let j = 0; j < grid.length; j++) {
    for (let i = 0; i < grid[j].length; i++) {
      newgrid[j][i] = fn(j, i, grid);
    }
  }
  return newgrid;
}

// function *mapiter(grid, fn) {
//   for (let j = 0; j < grid.length; j++) {
//     for (let i = 0; i < grid[j].length; i++) {
//       yield fn(j, i, grid);
//     }
//   }
// }

// function *remapiter(iter, size, fn) {
//   let index = 0, i = 0, j = 0;
//   for (let cell of iter) {
//     fn(j, i, cell);
//     index++;
//     i = index % size;
//     j = index / size | 0;
//   }
// }

function premap(pre, fn) {
  return function(j, i, g) {
    return pre(j, i, g, fn);
  };
}

// const abs = v => v === -2 ? -2 : Math.abs(v);
const abs = Math.abs;

const noise = (i, j) => (
  abs(Math.floor((
    ((i * j) % 7) -
    i % 11 +
    i % 3 +
    j % 11 -
    j % 3
  ) % 5 / 2))
);

function adjacenthex3(grid, y, x, result) {
  let adjacent0 = 0;
  let adjacent1 = 0;
  let adjacent2 = 0;
  let adjacent3 = 0;
  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < 3; i++) {
      if (x % 2 === 0 ? _inHexOdd[3][j][i] : _inHex[3][j][i]) {
        const v = grid[y - 1 + j][x - 1 + i];
        adjacent0 += v === 0 ? 1 : 0;
        adjacent1 += v === 1 ? 1 : 0;
        adjacent2 += v === 2 ? 1 : 0;
        adjacent3 += v === 3 ? 1 : 0;
      }
    }
  }
  result.adjacent0 = adjacent0;
  result.adjacent1 = adjacent1;
  result.adjacent2 = adjacent2;
  result.adjacent3 = adjacent3;
}

function adjacenthex5(grid, y, x, result) {
  let adjacent0 = 0;
  let adjacent1 = 0;
  let adjacent2 = 0;
  let adjacent3 = 0;
  for (let j = 0; j < 5; j++) {
    for (let i = 0; i < 5; i++) {
      if (x % 2 === 0 ? _inHex[5][j][i] : _inHexOdd[5][j][i]) {
        const v = grid[y - 2 + j][x - 2 + i];
        adjacent0 += v === 0 ? 1 : 0;
        adjacent1 += v === 1 ? 1 : 0;
        adjacent2 += v === 2 ? 1 : 0;
        adjacent3 += v === 3 ? 1 : 0;
      }
    }
  }
  result.adjacent0in5x5 = adjacent0;
  result.adjacent1in5x5 = adjacent1;
  result.adjacent2in5x5 = adjacent2;
  result.adjacent3in5x5 = adjacent3;
}

const _adjacentPreCache = {
  i: 0,
  j: 0,
  g: null,
  here: 0,
  adjacent0: 0,
  adjacent1: 0,
  adjacent2: 0,
  adjacent3: 0,
  adjacent0in5x5: 0,
  adjacent1in5x5: 0,
  adjacent2in5x5: 0,
  adjacent3in5x5: 0,
};

function adjacentPre(j, i, g, fn) {
  if (i < 2 || i >= g.length - 2 || j < 2 || j >= g.length - 2) {
    return g[j][i];
  }
  const here = g[j][i];
  // const subgrid3x3 = subhexgrid3(g, j, i);
  // const subgrid5x5 = subhexgrid5(g, j, i);
  // let adjacent0 = 0;
  // let adjacent1 = 0;
  // let adjacent2 = 0;
  // let adjacent3 = 0;
  // subhexgrid3fn(g, j, i, v => {
  //   adjacent0 += v === 0;
  //   adjacent1 += v === 1;
  //   adjacent2 += v === 2;
  //   adjacent3 += v === 3;
  // });
  // const adjacent0 = adjacentXgrid(subgrid3x3, 0);
  // const adjacent1 = adjacentXgrid(subgrid3x3, 1);
  // const adjacent2 = adjacentXgrid(subgrid3x3, 2);
  // const adjacent3 = adjacentXgrid(subgrid3x3, 3);
  // const adjacent0 = adjacentXiter(subhexgrid3iter(g, j, i), 0);
  // const adjacent1 = adjacentXiter(subhexgrid3iter(g, j, i), 1);
  // const adjacent2 = adjacentXiter(subhexgrid3iter(g, j, i), 2);
  // const adjacent3 = adjacentXiter(subhexgrid3iter(g, j, i), 3);
  // let adjacent0in5x5 = 0;
  // let adjacent1in5x5 = 0;
  // let adjacent2in5x5 = 0;
  // let adjacent3in5x5 = 0;
  // subhexgrid5fn(g, j, i, v => {
  //   adjacent0in5x5 += v === 0;
  //   adjacent1in5x5 += v === 1;
  //   adjacent2in5x5 += v === 2;
  //   adjacent3in5x5 += v === 3;
  // });
  // const adjacent0in5x5 = adjacentXgrid(subgrid5x5, 0);
  // const adjacent1in5x5 = adjacentXgrid(subgrid5x5, 1);
  // const adjacent2in5x5 = adjacentXgrid(subgrid5x5, 2);
  // const adjacent3in5x5 = adjacentXgrid(subgrid5x5, 3);
  const result = _adjacentPreCache;
  result.i = i;
  result.j = j;
  result.g = g;
  result.here = here;
  // result.adjacent0in5x5 = adjacent0in5x5;
  // result.adjacent1in5x5 = adjacent1in5x5;
  // result.adjacent2in5x5 = adjacent2in5x5;
  // result.adjacent3in5x5 = adjacent3in5x5;
  adjacenthex3(g, j, i, result);
  adjacenthex5(g, j, i, result);
  return fn(result);
}

function islandTiles(j, i, g) {
  // const visited = newGrid(g.length);
  const tiles = [[i, j]];
  let found = false;
  // debugger;
  do {
    found = false;
    for (let t = 0; t < tiles.length; t++) {
      const tile = tiles[t];
      for (let d = 0; d < 6; d++) {
        let [x, y] = relative(tile[0], tile[1], d);
        if (x >= 0 && x < g.length && y >= 0 && y < g.length) {
          if (g[y][x] > 1) {
            // debugger;
            if (tiles.reduce((carry, tile) => carry && !(tile[0] === x && tile[1] === y), true)) {
              tiles.push([x, y]);
              found = true;
            }
          }
        }
      }
    }
  } while (found);
  return tiles;
}

function pass(grid, ...fns) {
  return fns.reduce((carry, fn) => fn(carry), grid);
}

function genGrid() {
  let xShift = -32;
  let yShift = -32;
  // Add buffer to the size so adjacent5x5 
  let size = 64 + 8 + 8;

  let noiseGrid = map(newGrid(size), (j, i, grid) => noise(i + xShift - 8, j + yShift - 8));

  let grid = noiseGrid;

  return pass(grid,
    // denoise land
    grid => map(grid, premap(adjacentPre, ({
      here,
      adjacent2,
      adjacent2in5x5,
    }) => {
      return (
        here === 2 && adjacent2in5x5 - adjacent2 === 0 ? 2 :
        here === 2 ? 1 :
        adjacent2 > 0 ? 1 :
        0
      );
    })),
    // broaden land, spread and shrink water
    grid => map(grid, premap(adjacentPre, ({
      here,
      adjacent0,
      adjacent2,
      adjacent0in5x5,
      adjacent2in5x5,
    }) => {
      return (
        here === 2 ? 2 :
        adjacent2 > 0 ? 2 :
        adjacent2in5x5 > 0 ? 1 :
        adjacent0in5x5 > 4 ? 0 :
        adjacent0 > 0 && adjacent0 < 2 && adjacent2in5x5 === 0 ? 0 :
        here === 1 ? 1 :
        0
      );
    })),
    // add port possibilities
    grid => map(grid, premap(adjacentPre, ({
      here,
      adjacent2,
      adjacent1in5x5,
    }) => {
      return (
        adjacent2 > 4 ? here :
        here === 2 ? 3 :
        here
      );
    })),
    // decide  ports
    grid => {
      const islandCache = newGrid(grid.length);
      for (let j = 0; j < grid.length; j++) {
        const row = grid[j];
        for (let i = 0; i < row.length; i++) {
          if (typeof islandCache[j][i] === 'object' || row[i] !== 3) {continue;}
          let tiles = islandTiles(j, i, grid);
          tiles = tiles.filter(([x, y]) => grid[y][x] === 3);
          tiles.sort(([ax, ay], [bx, by]) => ay === by ? ax - bx : ay - by);
          for (let k = 0; k < tiles.length; k++) {
            islandCache[tiles[k][1]][tiles[k][0]] = tiles;
          }
        }
      }
      return map(grid, (j, i, g) => {
        let choice;
        const here = grid[j][i];
        if (here === 3) {
          let tiles = islandCache[j][i];
          // islandTiles(j, i, g);
          // tiles = tiles.filter(([x, y]) => g[y][x] === 3);
          // tiles.sort(([ax, ay], [bx, by]) => ay === by ? ax - bx : ay - by);
          choice = tiles[
            tiles.length * tiles[0][0] * tiles[0][1] * 67 %
            51 % tiles.length
          ];
        }
        return (
          here === 3 && choice[0] === i && choice[1] === j ? 3 :
          here === 3 ? 2 :
          here
        );
      });
    },
    grid => subgrid(grid, 8, 8, 64),
    grid => {
      const ports = flat(grid).reduce((carry, cell, l) => {
        if (cell === 3) {
          carry.push([l % 64, (l / 64) | 0]);
        }
        return carry;
      }, []);
      const [startX, startY] = ports[37 % ports.length];
      return map(grid, (j, i, g) => {
        return {
          base: g[j][i],
          ships: i === startX && j === startY ? [0] : [],
          port: g[j][i] === 3 ? j * 64 + i : null,
        }
      });
    }
  );
}

// <HexGrid tiles={hexHex(5)} />
// <HexGrid tiles={hexHex(7)} />
// <HexGrid tiles={hexHex(9)} />
// <HexGrid tiles={hexHex(13)} />
// <div className={"odd-grid"}><HexGrid tiles={hexHexOdd(3)} /></div>
// <div className={"odd-grid"}><HexGrid tiles={hexHexOdd(5)} /></div>
// <div className={"odd-grid"}><HexGrid tiles={hexHexOdd(7)} /></div>
// <div className={"odd-grid"}><HexGrid tiles={hexHexOdd(9)} /></div>

export default class Board extends Component {
  render(props) {
    console.log(hexHex(9));
    console.log(genGrid());
    return (<div>
      <HexGrid tiles={genGrid()} />
    </div>);
  }
}

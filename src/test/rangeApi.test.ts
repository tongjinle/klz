import assert = require("assert");
import * as rangeApi from "../logic/rangeApi";

const sort = (pa, pb) => 1e5 * pb.x + pb.y - (1e5 * pa.x + pa.y);
describe("range api", () => {
  // (1,1)往南走2格
  // exp: [(1,0),(1,-1)]
  it("lineRange", () => {
    let rst = rangeApi.lineRange({ x: 1, y: 1 }, 2, 2);
    let exp = [{ x: 1, y: 0 }, { x: 1, y: -1 }];
    assert.deepEqual(exp.sort(sort), rst.sort(sort));
  });

  // (1,1)往左下走2格
  // exp: [(0,0),(-1,-1)]
  it("slashRange", () => {
    let rst = rangeApi.slashRange({ x: 1, y: 1 }, 2, 2);
    let exp = [{ x: -1, y: -1 }, { x: 0, y: 0 }];
    assert.deepEqual(exp.sort(sort), rst.sort(sort));
  });

  // (1,1)的外围两格
  // exp: [(1,2),(1,3),(2,1),(3,1),(1,0),(1,-1),(0,1),(-1,1)]
  it("nearRange", () => {
    let exp = [
      { x: 1, y: 0 },
      { x: 1, y: -1 },
      { x: 1, y: 2 },
      { x: 1, y: 3 },
      { x: 0, y: 1 },
      { x: -1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 }
    ];
    let rst = rangeApi.nearRange({ x: 1, y: 1 }, 2);
    assert.deepEqual(exp.sort(sort), rst.sort(sort));
  });

  // (1,1)的两圈
  it("circleRange", () => {
    let exp = [
      { x: -1, y: 3 },
      { x: -1, y: 2 },
      { x: -1, y: 1 },
      { x: -1, y: 0 },
      { x: -1, y: -1 },

      { x: 0, y: 3 },
      { x: 0, y: 2 },
      { x: 0, y: 1 },
      { x: 0, y: 0 },
      { x: 0, y: -1 },

      { x: 1, y: 3 },
      { x: 1, y: 2 },
      { x: 1, y: 0 },
      { x: 1, y: -1 },

      { x: 2, y: 3 },
      { x: 2, y: 2 },
      { x: 2, y: 1 },
      { x: 2, y: 0 },
      { x: 2, y: -1 },

      { x: 3, y: 3 },
      { x: 3, y: 2 },
      { x: 3, y: 1 },
      { x: 3, y: 0 },
      { x: 3, y: -1 }
    ];
    let rst = rangeApi.circleRange({ x: 1, y: 1 }, 2);
    assert.deepEqual(exp.sort(sort), rst.sort(sort));
  });

  // it("manhattan", () => {
  //   let exp = [
  //     { x: -1, y: 1 },

  //     { x: 0, y: 2 },
  //     { x: 0, y: 1 },
  //     { x: 0, y: 0 },

  //     { x: 1, y: 3 },
  //     { x: 1, y: 2 },
  //     { x: 1, y: 0 },
  //     { x: 1, y: -1 },

  //     { x: 2, y: 2 },
  //     { x: 2, y: 1 },
  //     { x: 2, y: 0 },

  //     { x: 3, y: 1 }
  //   ];
  //   expect(_.sortBy(rangeApi.manhattanRange({ x: 1, y: 1 }, 2), sort)).toEqual(
  //     _.sortBy(exp, sort)
  //   );
  // });

  // 去重
  it("unique", () => {
    let source = [
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 1, y: 2 }
    ];

    let rst = rangeApi.unique(source);
    let exp = [{ x: 1, y: 1 }, { x: 1, y: 2 }];

    assert.deepEqual(exp.sort(sort), rst.sort(sort));
  });

  // [(1,1),(1,2),(1,3)]中减去[(1,1),(1,2)]
  // exp: [(1,3)]
  it("sub", () => {
    let source = [{ x: 1, y: 1 }, { x: 1, y: 3 }, { x: 1, y: 2 }];

    let target = [{ x: 1, y: 1 }, { x: 1, y: 2 }];

    let rst = rangeApi.sub(source, target);
    let exp = [{ x: 1, y: 3 }];
    assert.deepEqual(exp.sort(sort), rst.sort(sort));
  });

  it("getBetween", () => {
    let pa = { x: 1, y: 4 };
    let pb = { x: 1, y: 2 };

    let rst = [{ x: 1, y: 3 }];
    let exp = rangeApi.getBetween(pa, pb);
    assert.deepEqual(exp.sort(sort), rst.sort(sort));
  });
});

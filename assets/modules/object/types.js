import { Sprite } from "../sprite.js"

export const objectCollision = {
    none: 0,
    solid: 1
};

export const getObjectTypeByName = function (name) {

    switch (name) {
        case 'Box':
            return 1;
        case 'Broken Box':
            return 2;
        case 'Cake':
            return 3;
        case 'Hearts':
            return 4;
        case 'Hare':
            return 5;
        case 'Goat':
            return 6;
        case 'Cat':
            return 7;
        case 'Pig':
            return 8;
        case 'Dog':
            return 9;
        case 'Registrar':
            return 10;
        case 'Goat2':
            return 11;
        case 'Cat2':
            return 12;
        case 'Pig2':
            return 13;
        case 'Dog2':
            return 14;
        case 'Shovel':
            return 15;
        case 'Axe':
            return 16;
        case 'Hammer':
            return 17;
        case 'Pickaxe':
            return 18;
        case 'WiseSage':
            return 19;
    }

};

export const objectTypes = {
    1: {
        name: "Box",
        sprite: new Sprite([{
            x: 40,
            y: 160,
            w: 40,
            h: 40
        }]),
        offset: [0, 0],
        collision: objectCollision.solid,
        zIndex: 1
    },
    2: {
        name: "Broken Box",
        sprite: new Sprite([{
            x: 40,
            y: 200,
            w: 40,
            h: 40
        }]),
        offset: [0, 0],
        collision: objectCollision.none,
        zIndex: 1
    },
    3: {
        name: "Cake",
        sprite: new Sprite([{
            x: 430,
            y: 40,
            w: 32,
            h: 32
        }]),
        offset: [0, 0],
        collision: objectCollision.solid,
        zIndex: 1
    },
    4: {
        name: "Hearts",
        sprite: new Sprite([{

            x: 326,
            y: 66,
            w: 25,
            h: 25,
            d: 100,
        }, {
            x: 351,
            y: 66,
            w: 25,
            h: 25,
            d: 100
        },
        {
            x: 376,
            y: 66,
            w: 25,
            h: 25,
            d: 100
        }
        ]),
        offset: [10, -10],
        collision: objectCollision.none,
        zIndex: 2
    },
    5: {
        name: "Hare",
        sprite: new Sprite([{
            x: 400,
            y: 100,
            w: 40,
            h: 40,
            d: 'random'
        }, {
            x: 440,
            y: 100,
            w: 40,
            h: 40,
            d: 'random'
        },
        {
            x: 480,
            y: 100,
            w: 40,
            h: 40,
            d: 'random'
        },
        {
            x: 520,
            y: 100,
            w: 40,
            h: 40,
            d: 'random'
        }
        ]),
        offset: [0, 0],
        collision: objectCollision.solid,
        zIndex: 1
    },
    6: {
        name: "Goat",
        sprite: new Sprite([{
            x: 400,
            y: 140,
            w: 40,
            h: 40,
            d: 'random'
        }, {
            x: 440,
            y: 140,
            w: 40,
            h: 40,
            d: 'random'
        },
        {
            x: 480,
            y: 140,
            w: 40,
            h: 40,
            d: 'random'
        },
        {
            x: 520,
            y: 140,
            w: 40,
            h: 40,
            d: 'random'
        }
        ]),
        offset: [0, 0],
        collision: objectCollision.solid,
        zIndex: 1
    },
    7: {
        name: "Cat",
        sprite: new Sprite([{
            x: 400,
            y: 180,
            w: 40,
            h: 40,
            d: 'random'
        }, {
            x: 440,
            y: 180,
            w: 40,
            h: 40,
            d: 'random'
        },
        {
            x: 480,
            y: 180,
            w: 40,
            h: 40,
            d: 'random'
        },
        {
            x: 520,
            y: 180,
            w: 40,
            h: 40,
            d: 'random'
        }
        ]),
        offset: [0, 0],
        collision: objectCollision.solid,
        zIndex: 1
    },
    8: {
        name: "Pig",
        sprite: new Sprite([{
            x: 400,
            y: 220,
            w: 40,
            h: 40,
            d: 'random'
        }, {
            x: 440,
            y: 220,
            w: 40,
            h: 40,
            d: 'random'
        },
        {
            x: 480,
            y: 220,
            w: 40,
            h: 40,
            d: 'random'
        },
        {
            x: 520,
            y: 220,
            w: 40,
            h: 40,
            d: 'random'
        }
        ]),
        offset: [0, 0],
        collision: objectCollision.solid,
        zIndex: 1
    },
    9: {
        name: "Dog",
        sprite: new Sprite([{
            x: 400,
            y: 260,
            w: 40,
            h: 40,
            d: 'random'
        }, {
            x: 440,
            y: 260,
            w: 40,
            h: 40,
            d: 'random'
        },
        {
            x: 480,
            y: 260,
            w: 40,
            h: 40,
            d: 'random'
        },
        {
            x: 520,
            y: 260,
            w: 40,
            h: 40,
            d: 'random'
        }
        ]),
        offset: [0, 0],
        collision: objectCollision.solid,
        zIndex: 1
    },
    10: {
        name: "Registrar",
        sprite: new Sprite([{
            x: 560,
            y: 100,
            w: 40,
            h: 40,
            d: 'random'
        }, {
            x: 600,
            y: 100,
            w: 40,
            h: 40,
            d: 'random'
        },
        {
            x: 640,
            y: 100,
            w: 40,
            h: 40,
            d: 'random'
        }
        ]),
        offset: [0, 0],
        collision: objectCollision.solid,
        zIndex: 1
    },
    11: {
        name: "Goat2",
        sprite: new Sprite([{
            x: 560,
            y: 140,
            w: 40,
            h: 40,
            d: 'random'
        }, {
            x: 600,
            y: 140,
            w: 40,
            h: 40,
            d: 'random'
        },
        {
            x: 640,
            y: 140,
            w: 40,
            h: 40,
            d: 'random'
        },
        {
            x: 680,
            y: 140,
            w: 40,
            h: 40,
            d: 'random'
        }
        ]),
        offset: [0, 0],
        collision: objectCollision.solid,
        zIndex: 1
    },
    12: {
        name: "Cat2",
        sprite: new Sprite([{
            x: 560,
            y: 180,
            w: 40,
            h: 40,
            d: 'random'
        }, {
            x: 600,
            y: 180,
            w: 40,
            h: 40,
            d: 'random'
        },
        {
            x: 640,
            y: 180,
            w: 40,
            h: 40,
            d: 'random'
        },
        {
            x: 680,
            y: 180,
            w: 40,
            h: 40,
            d: 'random'
        }
        ]),
        offset: [0, 0],
        collision: objectCollision.solid,
        zIndex: 1
    },
    13: {
        name: "Pig",
        sprite: new Sprite([{
            x: 560,
            y: 220,
            w: 40,
            h: 40,
            d: 'random'
        }, {
            x: 600,
            y: 220,
            w: 40,
            h: 40,
            d: 'random'
        },
        {
            x: 640,
            y: 220,
            w: 40,
            h: 40,
            d: 'random'
        },
        {
            x: 680,
            y: 220,
            w: 40,
            h: 40,
            d: 'random'
        }
        ]),
        offset: [0, 0],
        collision: objectCollision.solid,
        zIndex: 1
    },
    14: {
        name: "Dog2",
        sprite: new Sprite([{
            x: 560,
            y: 260,
            w: 40,
            h: 40,
            d: 'random'
        }, {
            x: 600,
            y: 260,
            w: 40,
            h: 40,
            d: 'random'
        },
        {
            x: 640,
            y: 260,
            w: 40,
            h: 40,
            d: 'random'
        },
        {
            x: 680,
            y: 260,
            w: 40,
            h: 40,
            d: 'random'
        }
        ]),
        offset: [0, 0],
        collision: objectCollision.solid,
        zIndex: 1
    },
    15: {
        name: "Shovel",
        sprite: new Sprite([{
            x: 301,
            y: 310,
            w: 26,
            h: 26,
            d: 300
        }, {
            x: 330,
            y: 320,
            w: 35,
            h: 12,
            d: 100
        },
        {
            x: 365,
            y: 310,
            w: 26,
            h: 26,
            d: 500
        }
        ]),
        offset: [10, -10],
        collision: objectCollision.none,
        zIndex: 2
    },
    16: {
        name: "Axe",
        sprite: new Sprite([{
            x: 302,
            y: 250,
            w: 23,
            h: 26,
            d: 300
        }, {
            x: 326,
            y: 251,
            w: 26,
            h: 23,
            d: 100
        },
        {
            x: 353,
            y: 253,
            w: 25,
            h: 17,
            d: 500
        }
        ]),
        offset: [10, -10],
        collision: objectCollision.none,
        zIndex: 2
    },
    17: {
        name: "Hammer",
        sprite: new Sprite([{
            x: 300,
            y: 280,
            w: 15,
            h: 27,
            d: 300
        }, {
            x: 320,
            y: 280,
            w: 24,
            h: 24,
            d: 100
        },
        {
            x: 350,
            y: 286,
            w: 27,
            h: 15,
            d: 500
        }
        ]),
        offset: [10, -10],
        collision: objectCollision.none,
        zIndex: 2
    },
    18: {
        name: "Pickaxe",
        sprite: new Sprite([{
            x: 303,
            y: 342,
            w: 25,
            h: 25,
            d: 300
        }, {
            x: 330,
            y: 340,
            w: 22,
            h: 31,
            d: 100
        },
        {
            x: 355,
            y: 345,
            w: 31,
            h: 22,
            d: 500
        }
        ]),
        offset: [10, -10],
        collision: objectCollision.none,
        zIndex: 2
    },
    19: {
        name: "WiseSage",
        sprite: new Sprite([{
            x: 407,
            y: 300,
            w: 28,
            h: 23,
            d: 'random'
        }, {
            x: 447,
            y: 300,
            w: 28,
            h: 23,
            d: 'random'
        }
        ]),
        offset: [0, 0],
        collision: objectCollision.solid,
        zIndex: 1
    },
};


export const floorTypes = {
    solid: 0,
    path: 1,
    water: 2,
    ice: 3,
    conveyorU: 4,
    conveyorD: 5,
    conveyorL: 6,
    conveyorR: 7,
    grass: 8,
    houseFloor: 9,
    pineTree: 10,
    pineTrees: 11,
    ironOre: 12,
    ironOre2: 13,
    tree1: 14,
    tree2: 15,
    tree3: 16,
    tree11: 17,
    tree22: 18,
    tree33: 19,
    grass2: 20,
    grass3: 21,
    grass4: 22,
    sittingBank1: 23,
    sittingBank2: 24,
    sittingBankIndoor1: 25,
    sittingBankIndoor2: 26,
    buildingWall: 27,
    houseStoneTile: 28
};
export const treeTileTypes = [13, 14, 17, 18, 19, 20, 21, 22];
export const tileTypes = {
    0: {
        colour: "#685b48",
        floor: floorTypes.solid,
        sprite: new Sprite([{
            x: 0,
            y: 0,
            w: 40,
            h: 40
        }])
    },
    1: {
        colour: "#5aa457",
        floor: floorTypes.grass,
        sprite: new Sprite([{
            x: 40,
            y: 0,
            w: 40,
            h: 40
        }])
    },
    2: {
        colour: "#e8bd7a",
        floor: floorTypes.path,
        sprite: new Sprite([{
            x: 80,
            y: 0,
            w: 40,
            h: 40
        }])
    },
    3: {
        colour: "#286625",
        floor: floorTypes.solid,
        sprite: new Sprite([{
            x: 120,
            y: 0,
            w: 40,
            h: 40
        }])
    },
    4: {
        colour: "#678fd9",
        floor: floorTypes.water,
        sprite: new Sprite([{
            x: 160,
            y: 0,
            w: 40,
            h: 40,
            d: 600
        }, {
            x: 200,
            y: 0,
            w: 40,
            h: 40,
            d: 600
        },
        {
            x: 160,
            y: 40,
            w: 40,
            h: 40,
            d: 600
        }, {
            x: 200,
            y: 40,
            w: 40,
            h: 40,
            d: 600
        }
        ])
    },
    5: {
        colour: "#eeeeff",
        floor: floorTypes.ice,
        sprite: new Sprite([{
            x: 120,
            y: 120,
            w: 40,
            h: 40
        }])
    },
    6: {
        colour: "#cccccc",
        floor: floorTypes.conveyorL,
        sprite: new Sprite([{
            x: 0,
            y: 40,
            w: 40,
            h: 40,
            d: 200
        }, {
            x: 40,
            y: 40,
            w: 40,
            h: 40,
            d: 200
        },
        {
            x: 80,
            y: 40,
            w: 40,
            h: 40,
            d: 200
        }, {
            x: 120,
            y: 40,
            w: 40,
            h: 40,
            d: 200
        }
        ])
    },
    7: {
        colour: "#cccccc",
        floor: floorTypes.conveyorR,
        sprite: new Sprite([{
            x: 120,
            y: 80,
            w: 40,
            h: 40,
            d: 200
        }, {
            x: 80,
            y: 80,
            w: 40,
            h: 40,
            d: 200
        },
        {
            x: 40,
            y: 80,
            w: 40,
            h: 40,
            d: 200
        }, {
            x: 0,
            y: 80,
            w: 40,
            h: 40,
            d: 200
        }
        ])
    },
    8: {
        colour: "#cccccc",
        floor: floorTypes.conveyorD,
        sprite: new Sprite([{
            x: 160,
            y: 200,
            w: 40,
            h: 40,
            d: 200
        }, {
            x: 160,
            y: 160,
            w: 40,
            h: 40,
            d: 200
        },
        {
            x: 160,
            y: 120,
            w: 40,
            h: 40,
            d: 200
        }, {
            x: 160,
            y: 80,
            w: 40,
            h: 40,
            d: 200
        }
        ])
    },
    9: {
        colour: "#cccccc",
        floor: floorTypes.conveyorU,
        sprite: new Sprite([{
            x: 200,
            y: 80,
            w: 40,
            h: 40,
            d: 200
        }, {
            x: 200,
            y: 120,
            w: 40,
            h: 40,
            d: 200
        },
        {
            x: 200,
            y: 160,
            w: 40,
            h: 40,
            d: 200
        }, {
            x: 200,
            y: 200,
            w: 40,
            h: 40,
            d: 200
        }
        ])
    },

    10: {
        colour: "#ccaa00",
        floor: floorTypes.solid,
        sprite: new Sprite([{
            x: 40,
            y: 120,
            w: 40,
            h: 40
        }])
    },
    11: {
        colour: "#ccaa00",
        floor: floorTypes.solid,
        sprite: new Sprite([{
            x: 80,
            y: 120,
            w: 40,
            h: 40
        }])
    },
    12: {
        colour: "#ffffff",
        floor: floorTypes.houseFloor,
        sprite: new Sprite([{
            x: 300,
            y: 0,
            w: 40,
            h: 40
        }])
    },
    13: {
        colour: "#ffffff",
        floor: floorTypes.pineTree,
        sprite: new Sprite([{
            x: 340,
            y: 0,
            w: 40,
            h: 40
        }])
    },
    14: {
        colour: "#ffffff",
        floor: floorTypes.pineTrees,
        sprite: new Sprite([{
            x: 380,
            y: 0,
            w: 40,
            h: 40
        }])
    },
    15: {
        colour: "#ffffff",
        floor: floorTypes.ironOre,
        sprite: new Sprite([{
            x: 420,
            y: 0,
            w: 40,
            h: 40
        }])
    },
    16: {
        colour: "#ffffff",
        floor: floorTypes.ironOre2,
        sprite: new Sprite([{
            x: 460,
            y: 0,
            w: 40,
            h: 40
        }])
    },
    17: {
        colour: "#ffffff",
        floor: floorTypes.tree1,
        sprite: new Sprite([{
            x: 500,
            y: 0,
            w: 40,
            h: 40
        }])
    },
    18: {
        colour: "#ffffff",
        floor: floorTypes.tree2,
        sprite: new Sprite([{
            x: 540,
            y: 0,
            w: 40,
            h: 40
        }])
    },
    19: {
        colour: "#ffffff",
        floor: floorTypes.tree3,
        sprite: new Sprite([{
            x: 580,
            y: 0,
            w: 40,
            h: 40
        }])
    },
    20: {
        colour: "#ffffff",
        floor: floorTypes.tree11,
        sprite: new Sprite([{
            x: 620,
            y: 0,
            w: 40,
            h: 40
        }])
    },
    21: {
        colour: "#ffffff",
        floor: floorTypes.tree22,
        sprite: new Sprite([{
            x: 660,
            y: 0,
            w: 40,
            h: 40
        }])
    },
    22: {
        colour: "#ffffff",
        floor: floorTypes.tree33,
        sprite: new Sprite([{
            x: 700,
            y: 0,
            w: 40,
            h: 40
        }])
    },
    23: {
        colour: "#5aa457",
        floor: floorTypes.grass2,
        sprite: new Sprite([{
            x: 500,
            y: 40,
            w: 40,
            h: 40
        }])
    },
    24: {
        colour: "#5aa457",
        floor: floorTypes.grass3,
        sprite: new Sprite([{
            x: 540,
            y: 40,
            w: 40,
            h: 40
        }])
    },
    25: {
        colour: "#5aa457",
        floor: floorTypes.grass4,
        sprite: new Sprite([{
            x: 580,
            y: 40,
            w: 40,
            h: 40
        }])
    },
    26: {
        colour: "#000000",
        floor: floorTypes.sittingBank1,
        sprite: new Sprite([{
            x: 740,
            y: 0,
            w: 40,
            h: 40
        }])
    },
    27: {
        colour: "#000000",
        floor: floorTypes.sittingBank2,
        sprite: new Sprite([{
            x: 780,
            y: 0,
            w: 40,
            h: 40
        }])
    },
    28: {
        colour: "#000000",
        floor: floorTypes.sittingBankIndoor1,
        sprite: new Sprite([{
            x: 820,
            y: 0,
            w: 40,
            h: 40
        }])
    },
    29: {
        colour: "#000000",
        floor: floorTypes.sittingBankIndoor2,
        sprite: new Sprite([{
            x: 860,
            y: 0,
            w: 40,
            h: 40
        }])
    },
    30: {
        colour: "#000000",
        floor: floorTypes.buildingWall,
        sprite: new Sprite([{
            x: 160,
            y: 240,
            w: 40,
            h: 40
        }])
    },
    31: {
        colour: "#000000",
        floor: floorTypes.houseStoneTile,
        sprite: new Sprite([{
            x: 160,
            y: 280,
            w: 40,
            h: 40
        }])
    }
};
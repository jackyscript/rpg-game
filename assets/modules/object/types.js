import { Sprite } from "../sprite.js"

export const objectCollision = {
    none: 0,
    solid: 1
};

export const getObjectTypeByName = function(name) {
    if ('Box' === name)
        return 1;
    else if ('Broken Box' === name)
        return 2;
    else if ('Cake' === name)
        return 3;
    else if ('Hearts' === name)
        return 4;
    else if ('Hare' === name)
        return 5;
    else if ('Goat' === name)
        return 6;
    else if ('Cat' === name)
        return 7;
    else if ('Pig' === name)
        return 8;
    else if ('Dog' === name)
        return 9;
    else if ('Registrar' === name)
        return 10;
    else if ('Goat2' === name)
        return 11;
    else if ('Cat2' === name)
        return 12;
    else if ('Pig2' === name)
        return 13;
    else if ('Dog2' === name)
        return 14;
    else if ('Shovel' === name)
        return 15;
    else if ('Axe' === name)
        return 16;
    else if ('Hammer' === name)
        return 17;
    else if ('Pickaxe' === name)
        return 18;
    else if ('WiseSage' === name)
        return 19;
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
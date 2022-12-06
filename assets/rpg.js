import { map as gameMap, toIndex, mapWidth, mapHeight } from "./modules/map.js"
import { Tile, mapTileData } from "./modules/tile/tile.js"
import { Stack, PlacedItemStack, Inventory, itemTypes } from "./modules/inventory.js"
import { tilesetLoaded } from "./modules/tile/tileset.js"
import { roofList } from "./modules/roof.js"
import { Sprite } from "./modules/sprite.js"
import { gameContext } from "./modules/context.js"
import { floorTypes, getObjectTypeByName, objectCollision, objectTypes, tileTypes, treeTileTypes } from "./modules/object/types.js"

(function rpgGame() {
    var greetingTexts = ["Add your greetings here!", "Hello player 1!", "Hello player 2!", "In every programming project there must be one occurence of 'Hello world', don't you think?", "I don't know what I am talking about.", "Some greetings!", "Happy Birthday!", "Merry Christmas!", "Glad to see you, hope you are doing well?", "There you are, where were you heading?", "Happy to meet you."]
    var eatTexts = ["Mjam mjam", "Delicious!", "Tasty!", "This tastes good indeed.", "Yea!", "nom nom nom", "I think I should stop eating.", "One more.", "That tasted a little bit strange."]
    var introductionText = 'Omnipresent Being: Welcome to this little game, I hope you have fun.';
    var introductionGiven = false;
    var typeWriterNotWriting = true;

    function typeWriter(txt) {
        var i = 0;
        var txt = txt;
        var speed = 10; /* The speed/duration of the effect in milliseconds */

        resetTextArea();

        function typeWriterInternal() {
            if (i < txt.length) {
                typeWriterNotWriting = true
                var currentChar = txt.charAt(i);
                if (currentChar.includes('.') || currentChar.includes('!'))
                    speed = 400;
                else
                    speed = 10;
                document.getElementById("gameText").innerHTML += currentChar;
                i++;
                setTimeout(typeWriterInternal, speed);
            } else {
                typeWriterNotWriting = false;
            }
        }
        typeWriterInternal(txt);
    }
    if (!introductionGiven)
        typeWriter(introductionText);

    function resetTextArea() {
        document.getElementById("gameText").innerHTML = "";
    }

    var isViewportSetOnPlayer1 = true;
    
    var gameWidth = document.getElementById('game').getAttribute('width')
    var gameHeight = document.getElementById('game').getAttribute('height')

    var cakesEaten = 0;
    var tileWidth = 40,
        tileHeight = 40;
    var currentSecond = 0,
        frameCount = 0,
        framesLastSecond = 0,
        lastFrameTime = 0;


    var gameTime = 0;
    var gameSpeeds = [{
            name: "",
            speedFactor: 1
        },
        /*{
          name: "Slow",
          speedFactor: 0.3
        },
        {
          name: "Fast",
          speedFactor: 3
        },*/
        {
            name: "Pause",
            speedFactor: 0
        }
    ];
    var currentSpeed = 0;

    var player1UseLeftFootSprite = false;
    var player2UseLeftFootSprite = false;

    var quantifiableItems = [5, 7];


    var npcTypes = [4,5,6,7,8,9];
    function MapObject(nt) {
        this.x = 0;
        this.y = 0;
        this.type = nt;
    }
    MapObject.prototype.placeAt = function(nx, ny) {
        if (mapTileData.map[toIndex(this.x, this.y)].object == this) {
            mapTileData.map[toIndex(this.x, this.y)].object = null;
        }

        this.x = nx;
        this.y = ny;

        mapTileData.map[toIndex(nx, ny)].object = this;
    };

    MapObject.prototype.animate = function(player, duration) {

        this.placeAt(player.tileFrom[0], player.tileFrom[1]);
        var x = player.tileFrom[0];
        var y = player.tileFrom[1];
        var clearObject = function() {
            var dataPosition = mapTileData.map[toIndex(x, y)];
            if (dataPosition && dataPosition.object)
                dataPosition.object = undefined
        }
        setTimeout(clearObject, duration);
    };


    var directions = {
        up: 0,
        right: 1,
        down: 2,
        left: 3,
    };

    var getDirectionKey = function(directionValue) {
        if (directions.up == directionValue) {
            return "up";
        } else if (directions.right == directionValue) {
            return "right";
        } else if (directions.down == directionValue) {
            return "down";
        } else if (directions.left == directionValue) {
            return "left";
        }
    }
    var movementKeys = [87, 65, 83, 68, 37, 38, 39, 40];
    var keysDown = {
        13: false,
        37: false,
        38: false,
        39: false,
        40: false,
        84: false,
        90: false,
        85: false,
        73: false,
        72: false,
        74: false,
        75: false,
        76: false,
        69: false,
        67: false,
        89: false,
        88: false,
        70: false,
        82: false,
        112: false,
        113: false,
        87: false,
        65: false,
        83: false,
        68: false,
        48: false,
        49: false,
        50: false,
        51: false,
        52: false,
        53: false,
        54: false,
        55: false,
        56: false,
        57: false,
        171: false,
        173: false,
        81: false,
        63: false,
        192: false
    };
    var offsetFactor = 8;
    var startTileFactor = 1;
    var endTileFactor = 1;
    var viewport = {
        screen: [0, 0],
        startTile: [0, 0],
        endTile: [0, 0],
        offset: [0, 0],
        update: function(px, py) {
            this.offset[0] = Math.floor((this.screen[0] / offsetFactor) - px);
            this.offset[1] = Math.floor((this.screen[1] / offsetFactor) - py);

            var tile = [Math.floor(px / tileWidth), Math.floor(py / tileHeight)];

            this.startTile[0] = tile[0] - 1 - Math.ceil((this.screen[0] / startTileFactor) / tileWidth);
            this.startTile[1] = tile[1] - 1 - Math.ceil((this.screen[1] / startTileFactor) / tileHeight);

            if (this.startTile[0] < 0) {
                this.startTile[0] = 0;
            }
            if (this.startTile[1] < 0) {
                this.startTile[1] = 0;
            }

            this.endTile[0] = tile[0] + 1 + Math.ceil((this.screen[0] / endTileFactor) / tileWidth);
            this.endTile[1] = tile[1] + 1 + Math.ceil((this.screen[1] / endTileFactor) / tileHeight);

            if (this.endTile[0] >= mapWidth) {
                this.endTile[0] = mapWidth - 1;
            }
            if (this.endTile[1] >= mapHeight) {
                this.endTile[1] = mapHeight - 1;
            }
        }
    };
    var player1 = new Character("player1");
    var player2 = new Character("player2");

    player1.otherPlayer = player2;
    player2.otherPlayer = player1;

    player1.tileFrom = [1, 17];
    player1.tileTo = [1, 17];
    player1.timeMoved = 0;
    player1.dimensions = [30, 30];
    player1.position = [player1.tileFrom[0] * 40, player1.tileFrom[1] * 40];
    player1.direction = directions.right;

    player2.tileFrom = [2, 17];
    player2.tileTo = [2, 17];
    player2.timeMoved = 0;
    player2.dimensions = [30, 30];
    player2.position = [player2.tileFrom[0] * 40, player2.tileFrom[1] * 40];
    player2.direction = directions.left

    var loadSavedPlayer = function(player) {
        var savedPlayer = JSON.parse(localStorage.getItem(player.name));
        if (savedPlayer) {
            player.tileFrom = savedPlayer.tileFrom;
            player.tileTo = savedPlayer.tileTo;
            player.timeMoved = savedPlayer.timeMoved;
            player.dimensions = savedPlayer.dimensions;
            player.position = savedPlayer.position;

            player.direction = savedPlayer.direction;
            if (savedPlayer.inventory) {
                player.inventory.stacks = savedPlayer.inventory.stacks;
                player.inventory.spaces = savedPlayer.inventory.spaces;
                //player.inventory.spaces = 6;
            }
        }
    }
    loadSavedPlayer(player1);
    loadSavedPlayer(player2);

    function Character(name) {
        this.name = name;
        this.isPlayer1 = name == 'player1' ? true : false;
        this.isPlayer2 = !this.isPlayer1;
        this.tileFrom = [1, 1];
        this.tileTo = [1, 1];
        this.timeMoved = 0;
        this.dimensions = [30, 30];
        this.position = [45, 45];
        this.otherPlayer = undefined;

        this.delayMove = {};
        this.delayMove[floorTypes.path] = 300;
        this.delayMove[floorTypes.houseStoneTile] = 350;
        this.delayMove[floorTypes.grass] = 450;
        this.delayMove[floorTypes.grass2] = 450;
        this.delayMove[floorTypes.grass3] = 450;
        this.delayMove[floorTypes.grass4] = 450;
        this.delayMove[floorTypes.sittingBank1] = 450;
        this.delayMove[floorTypes.sittingBank2] = 450;
        this.delayMove[floorTypes.sittingBankIndoor1] = 450;
        this.delayMove[floorTypes.sittingBankIndoor2] = 450;
        this.delayMove[floorTypes.houseFloor] = 250;
        this.delayMove[floorTypes.ice] = 200;
        this.delayMove[floorTypes.conveyorU] = 200;
        this.delayMove[floorTypes.conveyorD] = 200;
        this.delayMove[floorTypes.conveyorL] = 200;
        this.delayMove[floorTypes.conveyorR] = 200;

        this.direction = directions.down;
        this.sprites = {};
        this.sprites[directions.up] = new Sprite([{
            x: 0,
            y: this.isPlayer1 ? 120 : 240,
            w: 30,
            h: 30
        }]);
        this.sprites[directions.right] = new Sprite([{
            x: 0,
            y: this.isPlayer1 ? 150 : 270,
            w: 30,
            h: 30
        }]);
        this.sprites[directions.down] = new Sprite([{
            x: 0,
            y: this.isPlayer1 ? 180 : 300,
            w: 30,
            h: 30
        }]);
        this.sprites[directions.left] = new Sprite([{
            x: 0,
            y: this.isPlayer1 ? 210 : 330,
            w: 30,
            h: 30
        }]);
        this.spritesLeftFoot = {};
        this.spritesLeftFoot[directions.up] = new Sprite([{
            x: this.isPlayer1 ? 240 : 30,
            y: this.isPlayer1 ? 70 : 240,
            w: 30,
            h: 30
        }]);
        this.spritesLeftFoot[directions.right] = new Sprite([{
            x: this.isPlayer1 ? 240 : 30,
            y: this.isPlayer1 ? 100 : 270,
            w: 30,
            h: 30
        }]);
        this.spritesLeftFoot[directions.down] = new Sprite([{
            x: this.isPlayer1 ? 240 : 30,
            y: this.isPlayer1 ? 40 : 300,
            w: 30,
            h: 30
        }]);
        this.spritesLeftFoot[directions.left] = new Sprite([{
            x: this.isPlayer1 ? 240 : 30,
            y: this.isPlayer1 ? 130 : 330,
            w: 30,
            h: 30
        }]);
        this.spritesRightFoot = {};
        this.spritesRightFoot[directions.up] = new Sprite([{
            x: this.isPlayer1 ? 270 : 60,
            y: this.isPlayer1 ? 70 : 240,
            w: 30,
            h: 30
        }]);
        this.spritesRightFoot[directions.right] = new Sprite([{
            x: this.isPlayer1 ? 270 : 60,
            y: this.isPlayer1 ? 100 : 270,
            w: 30,
            h: 30
        }]);
        this.spritesRightFoot[directions.down] = new Sprite([{
            x: this.isPlayer1 ? 270 : 60,
            y: this.isPlayer1 ? 40 : 300,
            w: 30,
            h: 30
        }]);
        this.spritesRightFoot[directions.left] = new Sprite([{
            x: this.isPlayer1 ? 270 : 60,
            y: this.isPlayer1 ? 130 : 330,
            w: 30,
            h: 30
        }]);

        this.inventory = new Inventory(6);
    }

    Character.prototype.placeAt = function(x, y) {
        this.tileFrom = [x, y];
        this.tileTo = [x, y];
        this.position = [((tileWidth * x) + ((tileWidth - this.dimensions[0]) / 2)),
            ((tileHeight * y) + ((tileHeight - this.dimensions[1]) / 2))
        ];
    };

    Character.prototype.isNotMoving = function() {
        if (player1 === this) {
            return !keysDown[87] && !keysDown[83] && !keysDown[65] && !keysDown[68];
        } else {
            return !keysDown[37] && !keysDown[38] && !keysDown[39] && !keysDown[40];
        }
    };

    Character.prototype.showAffection = function() {
        var animatedHeart = new MapObject(getObjectTypeByName('Hearts'));
        animatedHeart.animate(this, 3000)
    };

    Character.prototype.processMovement = function(t) {
        if (this.tileFrom[0] == this.tileTo[0] && this.tileFrom[1] == this.tileTo[1]) {
            return false;
        }

        var moveSpeed = this.delayMove[tileTypes[mapTileData.map[toIndex(this.tileFrom[0], this.tileFrom[1])].type].floor];

        if ((t - this.timeMoved) >= moveSpeed) {
            this.placeAt(this.tileTo[0], this.tileTo[1]);

            if (mapTileData.map[toIndex(this.tileTo[0], this.tileTo[1])].eventEnter != null) {
                mapTileData.map[toIndex(this.tileTo[0], this.tileTo[1])].eventEnter(this);
            }

            var tileFloor = tileTypes[mapTileData.map[toIndex(this.tileFrom[0], this.tileFrom[1])].type].floor;


            if (tileFloor == floorTypes.ice) {
                if (this.canMoveDirection(this.direction)) {
                    this.moveDirection(this.direction, t);
                }
            } else if (tileFloor == floorTypes.conveyorL) {
                this.moveLeft(t);
            } else if (tileFloor == floorTypes.conveyorR) {
                this.moveRight(t);
            } else if (tileFloor == floorTypes.conveyorU) {
                this.moveUp(t);
            } else if (tileFloor == floorTypes.conveyorD) {
                this.moveDown(t);
            }
        } else {
            this.position[0] = (this.tileFrom[0] * tileWidth) + ((tileWidth - this.dimensions[0]) / 2);
            this.position[1] = (this.tileFrom[1] * tileHeight) + ((tileHeight - this.dimensions[1]) / 2);

            var positionXFrom = this.position[0];

            var positionYFrom = this.position[1];
            if (this.tileTo[0] != this.tileFrom[0]) {
                var diff = (tileWidth / moveSpeed) * (t - this.timeMoved);
                this.position[0] += (this.tileTo[0] < this.tileFrom[0] ? 0 - diff : diff);
            }
            if (this.tileTo[1] != this.tileFrom[1]) {
                var diff = (tileHeight / moveSpeed) * (t - this.timeMoved);
                this.position[1] += (this.tileTo[1] < this.tileFrom[1] ? 0 - diff : diff);
            }


            if (isNaN(this.position[0]))
                this.position[0] = positionXFrom
            if (isNaN(this.position[1]))
                this.position[1] = positionYFrom
            this.position[0] = Math.round(this.position[0]);
            this.position[1] = Math.round(this.position[1]);
        }

        return true;
    }
    Character.prototype.canMoveTo = function(x, y) {
        if (x < 0 || x >= mapWidth || y < 0 || y >= mapHeight) {
            return false;
        }
        if (typeof this.delayMove[tileTypes[mapTileData.map[toIndex(x, y)].type].floor] == 'undefined') {
            return false;
        }
        if (mapTileData.map[toIndex(x, y)].object != null) {
            var o = mapTileData.map[toIndex(x, y)].object;
            if (objectTypes[o.type].collision == objectCollision.solid) {
                return false;
            }
        }

        return true;
    };

    Character.prototype.isFacingOtherPlayer = function(player) {
        var nextTile = this.getNextPositionFromDirection(getDirectionKey(this.direction));

        if (nextTile[0] === player.tileFrom[0] && nextTile[1] === player.tileFrom[1]) {
            return true;
        }

        return false;
    };

    Character.prototype.isFacingMapObject = function() {
        var dataPosition = null;
        if (directions.down === this.direction)
            dataPosition = mapTileData.map[toIndex(this.tileFrom[0], this.tileFrom[1] + 1)];
        else if (directions.up === this.direction)
            dataPosition = mapTileData.map[toIndex(this.tileFrom[0], this.tileFrom[1] - 1)];
        else if (directions.left === this.direction)
            dataPosition = mapTileData.map[toIndex(this.tileFrom[0] - 1, this.tileFrom[1])];
        else if (directions.right === this.direction)
            dataPosition = mapTileData.map[toIndex(this.tileFrom[0] + 1, this.tileFrom[1])];
        if (dataPosition) {
            return dataPosition;
        } else {
            return null;
        }
    };

    Character.playerOccupiesTile = function(player, tileX, tileY) {

        if (tileX === player.tileFrom[0] && tileY === player.tileFrom[1]) {
            return true;
        }

        return false;
    };

    Character.prototype.getNextPositionFromDirection = function(direction) {

        var nextPosition = [];
        if ('up' === direction) {
            nextPosition.push(this.tileFrom[0]);
            nextPosition.push(this.tileFrom[1] - 1);
        } else if ('down' === direction) {
            nextPosition.push(this.tileFrom[0]);
            nextPosition.push(this.tileFrom[1] + 1);
        } else if ('left' === direction) {
            nextPosition.push(this.tileFrom[0] - 1);
            nextPosition.push(this.tileFrom[1]);
        } else if ('right' === direction) {
            nextPosition.push(this.tileFrom[0] + 1);
            nextPosition.push(this.tileFrom[1]);
        }
        return nextPosition;

    }

    Character.prototype.collidesWithPlayer = function(player, new_position) {

        var willCollideWithPlayer = false;
        if (player.isPlayer1) {
            if (this.otherPlayer.tileFrom[0] == new_position[0] && this.otherPlayer.tileFrom[1] == new_position[1]) {
                willCollideWithPlayer = true;
            }
        } else {
            if (player.otherPlayer.tileFrom[0] == new_position[0] && player.otherPlayer.tileFrom[1] == new_position[1]) {
                willCollideWithPlayer = true;
            }
        }
        return willCollideWithPlayer;

    }

    Character.prototype.canMove = function(direction) {
        var positionToMoveTo = this.getNextPositionFromDirection(direction);

        return this.canMoveTo(positionToMoveTo[0], positionToMoveTo[1]) && !this.collidesWithPlayer(this, positionToMoveTo);

    };
    Character.prototype.canMoveDirection = function(d) {
        switch (d) {
            case directions.up:
                return this.canMove('up');
            case directions.down:
                return this.canMove('down');
            case directions.left:
                return this.canMove('left');
            default:
                return this.canMove('right');
        }
    };

    Character.prototype.moveLeft = function(t) {
        if (this.canMove('left'))
            this.tileTo[0] -= 1;
        this.timeMoved = t;
        this.direction = directions.left;
    };
    Character.prototype.moveRight = function(t) {
        if (this.canMove('right'))
            this.tileTo[0] += 1;
        this.timeMoved = t;
        this.direction = directions.right;
    };
    Character.prototype.moveUp = function(t) {
        if (this.canMove('up'))
            this.tileTo[1] -= 1;
        this.timeMoved = t;
        this.direction = directions.up;
    };
    Character.prototype.moveDown = function(t) {
        if (this.canMove('down'))
            this.tileTo[1] += 1;
        this.timeMoved = t;
        this.direction = directions.down;
    };
    Character.prototype.moveDirection = function(d, t) {
        switch (d) {
            case directions.up:
                return this.moveUp(t);
            case directions.down:
                return this.moveDown(t);
            case directions.left:
                return this.moveLeft(t);
            default:
                return this.moveRight(t);
        }
    };

    Character.prototype.inspectTerrainAhead = function() {
        var floorType = null;
        var hasRoof = true;
        var tileFromX = null;
        var tileFromY = null;
        if (directions.down === this.direction) {
            floorType = mapTileData.map[toIndex(this.tileFrom[0], this.tileFrom[1] + 1)].type;
            hasRoof = mapTileData.map[toIndex(this.tileFrom[0], this.tileFrom[1] + 1)].roof ? true : false;
            tileFromX = this.tileFrom[0];
            tileFromY = this.tileFrom[1] + 1;
        } else if (directions.up === this.direction) {
            floorType = mapTileData.map[toIndex(this.tileFrom[0], this.tileFrom[1] - 1)].type;
            hasRoof = mapTileData.map[toIndex(this.tileFrom[0], this.tileFrom[1] + 1)].roof ? true : false;
            tileFromX = this.tileFrom[0];
            tileFromY = this.tileFrom[1] - 1;
        } else if (directions.left === this.direction) {
            floorType = mapTileData.map[toIndex(this.tileFrom[0] - 1, this.tileFrom[1])].type;
            hasRoof = mapTileData.map[toIndex(this.tileFrom[0], this.tileFrom[1] + 1)].roof ? true : false;
            tileFromX = this.tileFrom[0] - 1;
            tileFromY = this.tileFrom[1];
        } else if (directions.right === this.direction) {
            floorType = mapTileData.map[toIndex(this.tileFrom[0] + 1, this.tileFrom[1])].type;
            hasRoof = mapTileData.map[toIndex(this.tileFrom[0], this.tileFrom[1] + 1)].roof ? true : false;
            tileFromX = this.tileFrom[0] + 1;
            tileFromY = this.tileFrom[1];
        }
        return {"floorType" : floorType, "hasRoof" : hasRoof, "tileFromX" : tileFromX, "tileFromY" : tileFromY}
    }

    Character.prototype.pickUp = function() {
        if (this.tileTo[0] != this.tileFrom[0] ||
            this.tileTo[1] != this.tileFrom[1]) {
            return false;
        }

        var is = mapTileData.map[toIndex(this.tileFrom[0],
            this.tileFrom[1])].itemStack;

        if (is != null) {
            var remains = this.inventory.addItems(is.type, is.qty);
            Text.receivedItem(is);

            if (remains) {
                is.qty = remains;
            } else {
                mapTileData.map[toIndex(this.tileFrom[0],
                    this.tileFrom[1])].itemStack = null;
            }
        }
        return true;
    };

    Character.exchangeItem = function(item, player1, player2) {

        if (item) {
            if (player1.inventory.containsItem(item)) {
                player1.inventory.removeItem(item);
                player2.inventory.addItems(item, 1)
            }
        }

    };

    Character.prototype.interactWithMapObject = function() {
        var dataPosition = this.isFacingMapObject();
        if (dataPosition && dataPosition.object) {
            if (dataPosition.object.type === getObjectTypeByName('Box')) {
                if (!this.inventory.containsItem(4)) {
                    Text.needHammer()
                    return false;
                } else {
                    var x = dataPosition.object.x;
                    var y = dataPosition.object.y;
                    dataPosition.object = new MapObject(getObjectTypeByName('Broken Box'));
                    dataPosition.object.placeAt(x, y);
                    Text.hammerTime(this);
                    var animatedHammer = new MapObject(getObjectTypeByName('Hammer'))
                    animatedHammer.animate(this, 1000);
                }
                if (!player2.inventory.containsItem(2) && !player1.inventory.containsItem(2)) {
                    var axe = new PlacedItemStack(2, 1);
                    axe.placeAt(x, y);
                } else if (!player2.inventory.containsItem(3) && !player1.inventory.containsItem(3)) {
                    var pickAxe = new PlacedItemStack(3, 1);
                    pickAxe.placeAt(x, y);
                } else if (!player2.inventory.containsItem(6) && !player1.inventory.containsItem(6)) {
                    var shovel = new PlacedItemStack(6, 1);
                    shovel.placeAt(x, y);
                } else {
                    new MapObject(getObjectTypeByName('Cake')).placeAt(x, y);
                }
            } else if (dataPosition.object.type === getObjectTypeByName('Cake')) {
                cakesEaten++;
                dataPosition.object = null;
                Text.eatCake(this);
            } else if (dataPosition.object.type === getObjectTypeByName('Registrar')) {
                Text.speakToRegistrar();
            } else if (dataPosition.object.type === getObjectTypeByName('WiseSage')) {
                Text.speakToWiseSage(dataPosition.object);
            } else if (npcTypes.includes(dataPosition.object.type)) {
                Text.congratulate();
            }
            return true;
        } else {
            return false;
        }
    };

    Character.prototype.cutTree = function() {
        var result = this.inspectTerrainAhead();
        var floorType = result.floorType;
        var tileFromX = result.tileFromX;
        var tileFromY = result.tileFromY;

        if ((treeTileTypes.indexOf(floorType) !== -1)) {
            if (!this.inventory.containsItem(2)) {
                return false;
            } else {
                mapTileData.map[toIndex(tileFromX, tileFromY)] = new Tile(tileFromX, tileFromY, 1);
                this.inventory.addItems(5, 1);
                Text.cutTree(this);
                var animatedAxe = new MapObject(getObjectTypeByName('Axe'))
                animatedAxe.animate(this, 1000);
                return true;
            }
        } else {
            return false;
        }
    };

    Character.prototype.mineOre = function() {
        var result = this.inspectTerrainAhead();
        var floorType = result.floorType;
        var hasRoof = result.hasRoof;
        var tileFromX = result.tileFromX;
        var tileFromY = result.tileFromY;

        if ((16 === floorType || 15 === floorType || (0 === floorType && !hasRoof))) {
            if (!this.inventory.containsItem(3)) {
                return false;
            } else {
                mapTileData.map[toIndex(tileFromX, tileFromY)] = new Tile(tileFromX, tileFromY, 2);
                this.inventory.addItems(7, 1);
                Text.mineOre(this);
                var animatedPickaxe = new MapObject(getObjectTypeByName('Pickaxe'))
                animatedPickaxe.animate(this, 1000);
                return true;
            }
        } else {
            return false;
        }
    };

    Character.prototype.buildBridge = function() {
        var result = this.inspectTerrainAhead();
        var floorType = result.floorType;
        var tileFromX = result.tileFromX;
        var tileFromY = result.tileFromY;

        if (4 === floorType) {
            if (!this.inventory.containsItem(5)) {
                return false;
            } else {
                if (!this.inventory.containsItem(4)) {
                    return false;
                } else {
                    mapTileData.map[toIndex(tileFromX, tileFromY)] = new Tile(tileFromX, tileFromY, 12)
                    this.inventory.removeItem(5);
                    Text.buildBridge(this);
                    var animatedHammer = new MapObject(getObjectTypeByName('Hammer'))
                    animatedHammer.animate(this, 1000);
                    return true;
                }
            }
        } else {
            return false;
        }
    };

    Character.prototype.buildWall = function() {
        var result = this.inspectTerrainAhead();
        var floorType = result.floorType;
        var tileFromX = result.tileFromX;
        var tileFromY = result.tileFromY;

        if ((1 === floorType || 2 === floorType)) {
            if (!this.inventory.containsItem(4)) {
                return false;
            } else if (!this.inventory.containsItem(6)) {
                return false;
            } else if (!this.inventory.containsItem(7)) {
                return false;
            } else {
                mapTileData.map[toIndex(tileFromX, tileFromY)] = new Tile(tileFromX, tileFromY, 0)
                this.inventory.removeItem(7);
                Text.buildWall(this);
                var animatedHammer = new MapObject(getObjectTypeByName('Hammer'))
                animatedHammer.animate(this, 1000);
                var animatedShovel = new MapObject(getObjectTypeByName('Shovel'))
                animatedShovel.animate(this, 1000);
                return true;
            }
        } else {
            return false;
        }
    };

    Character.prototype.plantTree = function() {
        var result = this.inspectTerrainAhead();
        var floorType = result.floorType;
        var tileFromX = result.tileFromX;
        var tileFromY = result.tileFromY;

        if (1 === floorType && !Character.playerOccupiesTile(player1, tileFromX, tileFromY) && !Character.playerOccupiesTile(player2, tileFromX, tileFromY)) {
            // pick random tree type
            if (!this.inventory.containsItem(6)) {
                return false;
            } else {
                mapTileData.map[toIndex(tileFromX, tileFromY)] = new Tile(tileFromX, tileFromY, treeTileTypes[Math.floor(Math.random() * treeTileTypes.length)]);
                Text.plantTree(this);
                var animatedShovel = new MapObject(getObjectTypeByName('Shovel'))
                animatedShovel.animate(this, 1000);
                return true;
            }
        } else {
            return false;
        }
    };

    var occuredEvents = JSON.parse(localStorage.getItem('occuredEvents'));
    if (!occuredEvents) {
        occuredEvents = {
            "isHouseEntered": false
        }
    }

    function probability(n){
        return !!n && Math.random() <= n;
    }

    function seldom(){
        return probability(0.1);
    }

    function occasionally(){
        return probability(0.3);
    }

    Text.greetPlayers = function() {
        if (!occuredEvents.isHouseEntered)
            typeWriter("Guests: You both arrived!");
        occuredEvents.isHouseEntered = true;
    };

    Text.speakToRegistrar = function() {
        typeWriter("OFFICER: Glad you are here, everything clear at the moment. However sometimes I hear strange behind the house. Maybe you could investigate that. Thank you, have a nice day!");
    };

    Text.speakToWiseSage = function(mapObject) {
        if (mapObject.x == 2 && mapObject.y == 2)
            typeWriter("Wise Sage: There is nothing to look for here I think. Keep looking and exploring. You will probably need tools, if you wish to go to distant places.");
        else if (mapObject.x == 31 && mapObject.y == 38)
            typeWriter("Wise Sage: You did well so far! Except me nobody did manage to get here. A tasty looking blueberry you have there my friend.");
        else if (mapObject.x == 9 && mapObject.y == 60)
            typeWriter("Wise Sage: Look who is arriving there. You do build pretty bridges, I must say!");
    
    };

    Text.congratulate = function() {
        typeWriter(greetingTexts[Math.floor(Math.random() * greetingTexts.length)]);
    };

    Text.needHammer = function() {
        typeWriter('Some professor always says: "This is not the right time nor the right place."');
    };

    Text.needAxe = function(player) {
        var playerName = player.name.toUpperCase();
        typeWriter(playerName + ": I will need an axe for that.");
    };

    Text.needWood = function(player) {
        var playerName = player.name.toUpperCase();
        typeWriter(playerName + ": Don't have enough wood with me.");
    };

    Text.needStone = function(player) {
        var playerName = player.name.toUpperCase();
        typeWriter(playerName + ": Need stones!");
    };

    Text.needPickAxe = function(player) {
        var playerName = player.name.toUpperCase();
        typeWriter(playerName + ": A pickaxe would be perfect now.");
    };

    Text.needShovel = function(player) {
        var playerName = player.name.toUpperCase();
        typeWriter(playerName + ": I need a shovel.");
    };

    Text.receivedItem = function(item) {
        if (2 == item.type)
            typeWriter("You got an axe!");
        else if (3 == item.type)
            typeWriter("You got a pickaxe!");
        if (4 == item.type)
            typeWriter("You got a hammer!");
        if (6 == item.type)
            typeWriter("You got a shovel!");
    };

    Text.hammerTime = function(player) {
        var playerName = player.name.toUpperCase();
        typeWriter(playerName + " excitedly: Hammer Time!");
    };

    Text.gameSaved = function() {
        typeWriter("Savegame saved!");
    };

    Text.saveGameDeleted = function() {
        typeWriter("Savegame removed.");
    };

    Text.eatCake = function(player) {
        var playerName = player.name.toUpperCase();
        typeWriter(playerName + ": " + eatTexts[Math.floor(Math.random() * eatTexts.length)]);
    };

    Text.plantTree = function(player) {
        var playerName = player.name.toUpperCase();
        if (seldom()) {
            typeWriter(playerName + "sows seeds: To quickly plant trees like that is only possible in games!");
        }
    };

    Text.cutTree = function(player) {
        var playerName = player.name.toUpperCase();
        if (seldom()) {
            typeWriter(playerName + " swings axe: *Boo hoo*");
        }
    };

    Text.mineOre = function(player) {
        var playerName = player.name.toUpperCase();
        if (seldom()) {
            typeWriter(playerName + " swings pickaxe: ...time tries to heal our wounds...");
        }
    };
    
    Text.buildWall = function(player) {
        var playerName = player.name.toUpperCase();
        if (seldom()) {
            typeWriter(playerName + ": People tend to build too many walls not bridges.");
        }
    };
    
    Text.buildBridge = function(player) {
        var playerName = player.name.toUpperCase();
        if (seldom()) {
            typeWriter(playerName + ": It is better to build bridges than walls.");
        }
    };

    Text.showAffection = function(player1, player2) {
        var player1Name = player1.name.toUpperCase();
        var player2Name = player2.name.toUpperCase();
        typeWriter(player1Name + " is very happy");
    };
    window.onload = function() {

        requestAnimationFrame(drawGame);
        gameContext.font = "bold 10pt sans-serif";

        window.addEventListener("keydown", function(e) {
            if (e.keyCode in keysDown) {
                keysDown[e.keyCode] = true;
                e.preventDefault();
                return false;
            }
        });
        window.addEventListener("keyup", function(e) {
            /*if (e.keyCode == 19) {
              currentSpeed = (currentSpeed >= (gameSpeeds.length - 1) ? 0 : currentSpeed + 1);
            }*/

            if (e.keyCode in keysDown) {
                keysDown[e.keyCode] = false;
            }
        });

        viewport.screen = [gameWidth,
            gameHeight
        ];

        mapTileData.buildMapFromData(gameMap, mapWidth, mapHeight);
        mapTileData.addRoofs(roofList);
        mapTileData.setupEvent(3, 11, Text.greetPlayers);
        mapTileData.setupEvent(4, 11, Text.greetPlayers);

        function spawnWorldObjects() {

            new MapObject(getObjectTypeByName('Registrar')).placeAt(4, 4);
            new MapObject(getObjectTypeByName('Hare')).placeAt(1, 6);
            new MapObject(getObjectTypeByName('Cat2')).placeAt(2, 6);
            new MapObject(getObjectTypeByName('Dog')).placeAt(5, 6);
            new MapObject(getObjectTypeByName('Goat2')).placeAt(6, 6);
            new MapObject(getObjectTypeByName('Cat')).placeAt(6, 8);
            new MapObject(getObjectTypeByName('Pig')).placeAt(5, 8);
            new MapObject(getObjectTypeByName('Goat')).placeAt(5, 10);
            new MapObject(getObjectTypeByName('Pig2')).placeAt(6, 10);
            new MapObject(getObjectTypeByName('Hare')).placeAt(1, 8);
            new MapObject(getObjectTypeByName('Pig')).placeAt(2, 8);
            new MapObject(getObjectTypeByName('Cat')).placeAt(1, 10);
            new MapObject(getObjectTypeByName('Dog2')).placeAt(2, 10);
            new MapObject(getObjectTypeByName('WiseSage')).placeAt(2, 2);

            new MapObject(getObjectTypeByName('Box')).placeAt(12, 16);
            new MapObject(getObjectTypeByName('Box')).placeAt(17, 27);
            new MapObject(getObjectTypeByName('Box')).placeAt(31, 37);
            new MapObject(getObjectTypeByName('WiseSage')).placeAt(31, 38);
            new MapObject(getObjectTypeByName('Box')).placeAt(9, 59);
            new MapObject(getObjectTypeByName('WiseSage')).placeAt(9, 60);
            new MapObject(getObjectTypeByName('Box')).placeAt(23, 10);

            var spawnCake = function() {
                const flowerFieldWidth = 11;
                const rowStart = 19;
                const rowEnd = 24;
                for (var i = 0; i <= flowerFieldWidth; i++) {
                    for (var j = rowStart; j <= rowEnd; j++) {
                        new MapObject(getObjectTypeByName('Cake')).placeAt(i, j);
                    }
                }

            };
            spawnCake();

        };
        spawnWorldObjects();

        if (!player1.inventory.containsItem(4) && !player2.inventory.containsItem(4)) {
            var hammer = new PlacedItemStack(4, 1);

            hammer.placeAt(0, 1);
        }
        /*for (var i = 3; i < 8; i++) {
          var ps = new PlacedItemStack(1, 1);
          ps.placeAt(i, 1);
        }
        for (var i = 3; i < 8; i++) {
          var ps = new PlacedItemStack(1, 1);
          ps.placeAt(3, i);
        }*/
    };

    function processZ1Movement(player, useLeftFootSprite) {
        if (player.processMovement(gameTime)) {
            if (useLeftFootSprite) {
                player.spritesLeftFoot[player.direction].draw(
                    gameTime,
                    viewport.offset[0] + player.position[0],
                    viewport.offset[1] + player.position[1]);
            } else {
                player.spritesRightFoot[player.direction].draw(
                    gameTime,
                    viewport.offset[0] + player.position[0],
                    viewport.offset[1] + player.position[1]);
            }
        } else {
            if (player.isNotMoving()) {
                player.sprites[player.direction].draw(
                    gameTime,
                    viewport.offset[0] + player.position[0],
                    viewport.offset[1] + player.position[1]);
            } else {
                player.spritesLeftFoot[player.direction].draw(
                    gameTime,
                    viewport.offset[0] + player.position[0],
                    viewport.offset[1] + player.position[1]);
            }
            if (useLeftFootSprite) {
                useLeftFootSprite = false;
            } else {
                useLeftFootSprite = true;
            }
        }
        return useLeftFootSprite;
    }

    function drawGame() {
        if (gameContext == null) {
            return;
        }
        if (!tilesetLoaded) {
            requestAnimationFrame(drawGame);
            return;
        }

        var currentFrameTime = Date.now();
        var timeElapsed = currentFrameTime - lastFrameTime;
        gameTime += Math.floor(timeElapsed * gameSpeeds[currentSpeed].speedFactor);

        var sec = Math.floor(Date.now() / 1000);
        if (sec != currentSecond) {
            currentSecond = sec;
            framesLastSecond = frameCount;
            frameCount = 1;
        } else {
            frameCount++;
        }

        var processKeyboardInput = function(player) {

            if (!player.processMovement(gameTime) && gameSpeeds[currentSpeed].speedFactor != 0) {
                
                if (keysDown[112]) {
                    
                    mapTileData.saveCurrentMap();
                    
                    if (!typeWriterNotWriting)
                        Text.gameSaved();
                } else if (keysDown[113]) {
                    localStorage.clear();
                    
                    if (!typeWriterNotWriting)
                        Text.saveGameDeleted();
                } else if (keysDown[171]) {
                    isViewportSetOnPlayer1 = false;
                } else if (keysDown[173]) {
                    isViewportSetOnPlayer1 = true;
                }
                if (!typeWriterNotWriting) {
                    if (player.isPlayer1) {
                        if (keysDown[87]) {
                            player.moveUp(gameTime);
                        } else if (keysDown[83]) {
                            player.moveDown(gameTime);
                        } else if (keysDown[65]) {
                            player.moveLeft(gameTime);
                        } else if (keysDown[68]) {
                            player.moveRight(gameTime);
                        }
                        
                        if (player.isNotMoving()) {
                            if (keysDown[84]) {
                                player.pickUp();
                            } else if (keysDown[69]) {
                                player.interactWithMapObject();
                            } else if (keysDown[67]) {
                                player.cutTree();
                            } else if (keysDown[89]) {
                                player.buildBridge();
                            } else if (keysDown[88]) {
                                player.plantTree();
                            } else if (keysDown[70]) {
                                player.mineOre();
                            } else if (keysDown[82]) {
                                player.buildWall();
                            }
                        }
                    } else {
                        if (keysDown[38]) {
                            player.moveUp(gameTime);
                        } else if (keysDown[40]) {
                            player.moveDown(gameTime);
                        } else if (keysDown[37]) {
                            player.moveLeft(gameTime);
                        } else if (keysDown[39]) {
                            player.moveRight(gameTime);
                        }
                        
                        if (player.isNotMoving()) {
                            if (keysDown[90]) {
                                player.pickUp();
                            } else if (keysDown[85]) {
                                player.interactWithMapObject();
                            } else if (keysDown[73]) {
                                player.cutTree();
                            } else if (keysDown[72]) {
                                player.buildBridge();
                            } else if (keysDown[74]) {
                                player.plantTree();
                            } else if (keysDown[75]) {
                                player.mineOre();
                            } else if (keysDown[76]) {
                                player.buildWall();
                            }
                        }
                    }
                    if (player.isNotMoving()) {
                        if (keysDown[49]) {
                            if (player == player1 && player1.isFacingOtherPlayer(player2)) {
                                Character.exchangeItem(player1.inventory.getItemAt(0), player1, player2)
                            }
                        } else if (keysDown[50]) {
                            if (player == player1 && player1.isFacingOtherPlayer(player2)) {
                                Character.exchangeItem(player1.inventory.getItemAt(1), player1, player2)
                            }
                        } else if (keysDown[51]) {
                            if (player == player1 && player1.isFacingOtherPlayer(player2)) {
                                Character.exchangeItem(player1.inventory.getItemAt(2), player1, player2)
                            }
                        } else if (keysDown[52]) {
                            if (player == player1 && player1.isFacingOtherPlayer(player2)) {
                                Character.exchangeItem(player1.inventory.getItemAt(3), player1, player2)
                            }
                        } else if (keysDown[53]) {
                            if (player == player1 && player1.isFacingOtherPlayer(player2)) {
                                Character.exchangeItem(player1.inventory.getItemAt(4), player1, player2)
                            }
                        } else if (keysDown[54]) {
                            if (player == player1 && player1.isFacingOtherPlayer(player2)) {
                                Character.exchangeItem(player1.inventory.getItemAt(5), player1, player2)
                            }
                        } else if (keysDown[55]) {
                            if (player == player2 && player2.isFacingOtherPlayer(player1)) {
                                Character.exchangeItem(player2.inventory.getItemAt(0), player2, player1)
                            }
                        } else if (keysDown[56]) {
                            if (player == player2 && player2.isFacingOtherPlayer(player1)) {
                                Character.exchangeItem(player2.inventory.getItemAt(1), player2, player1)
                            }
                        } else if (keysDown[57]) {
                            if (player == player2 && player2.isFacingOtherPlayer(player1)) {
                                Character.exchangeItem(player2.inventory.getItemAt(2), player2, player1)
                            }
                        } else if (keysDown[48]) {
                            if (player == player2 && player2.isFacingOtherPlayer(player1)) {
                                Character.exchangeItem(player2.inventory.getItemAt(3), player2, player1)
                            }
                        } else if (keysDown[63]) {
                            if (player == player2 && player2.isFacingOtherPlayer(player1)) {
                                Character.exchangeItem(player2.inventory.getItemAt(4), player2, player1)
                            }
                        } else if (keysDown[192]) {
                            if (player == player2 && player2.isFacingOtherPlayer(player1)) {
                                Character.exchangeItem(player2.inventory.getItemAt(5), player2, player1)
                            }
                        } else if (keysDown[75]) {
                            if (player2.isFacingOtherPlayer(player1)) {
                                Text.showAffection(player2, player1);
                                player2.showAffection();
                            }
                        } else if (keysDown[81]) {
                            if (player1.isFacingOtherPlayer(player2)) {
                                Text.showAffection(player1, player2);
                                player1.showAffection();
                            }
                        }
                    }
                }
            }
        }
        processKeyboardInput(player1);
        processKeyboardInput(player2);

        var setViewPortOn = function(player) {
            viewport.update(player.position[0] + (player.dimensions[0] / 2),
                player.position[1] + (player.dimensions[1] / 2));
        };
        if (isViewportSetOnPlayer1) {
            setViewPortOn(player1);
        } else {
            setViewPortOn(player2);
        }

        var checkPlayerRoofFrom = function(player) {
            return mapTileData.map[toIndex(
                player.tileFrom[0], player.tileFrom[1])].roof;
        }
        var checkPlayerRoofTo = function(player) {
            return mapTileData.map[toIndex(
                player.tileTo[0], player.tileTo[1])].roof;
        }

        gameContext.fillStyle = "#000000";
        gameContext.fillRect(0, 0, viewport.screen[0], viewport.screen[1]);

        for (var currentTileLevel = 0; currentTileLevel < mapTileData.levels; currentTileLevel++) {

            for (var y = viewport.startTile[1]; y <= viewport.endTile[1]; ++y) {
                for (var x = viewport.startTile[0]; x <= viewport.endTile[0]; ++x) {
                    if (currentTileLevel == 0) {
                        tileTypes[mapTileData.map[toIndex(x, y)].type].sprite.draw(
                            gameTime,
                            viewport.offset[0] + (x * tileWidth),
                            viewport.offset[1] + (y * tileHeight));
                    } else if (currentTileLevel == 1) {
                        var is = mapTileData.map[toIndex(x, y)].itemStack;
                        if (is != null) {
                            itemTypes[is.type].sprite.draw(
                                gameTime,
                                viewport.offset[0] + (x * tileWidth) + itemTypes[is.type].offset[0],
                                viewport.offset[1] + (y * tileHeight) + itemTypes[is.type].offset[1]);
                        }
                    }

                    var objectAtCurrentPosition = mapTileData.map[toIndex(x, y)].object;
                    if (objectAtCurrentPosition != null && objectTypes[objectAtCurrentPosition.type].zIndex == currentTileLevel) {
                        var objectType = objectTypes[objectAtCurrentPosition.type];

                        objectType.sprite.draw(gameTime,
                            viewport.offset[0] + (x * tileWidth) + objectType.offset[0],
                            viewport.offset[1] + (y * tileHeight) + objectType.offset[1]);
                    }

                    if (currentTileLevel == 2) {
                        var isRoofPassed = function() {
                            return mapTileData.map[toIndex(x, y)].roofType != 0 &&
                                mapTileData.map[toIndex(x, y)].roof != checkPlayerRoofFrom(player1) &&
                                mapTileData.map[toIndex(x, y)].roof != checkPlayerRoofTo(player1) &&
                                mapTileData.map[toIndex(x, y)].roof != checkPlayerRoofFrom(player2) &&
                                mapTileData.map[toIndex(x, y)].roof != checkPlayerRoofTo(player2)
                        }
                        if (isRoofPassed()) {

                            tileTypes[mapTileData.map[toIndex(x, y)].roofType].sprite.draw(
                                gameTime,
                                viewport.offset[0] + (x * tileWidth),
                                viewport.offset[1] + (y * tileHeight));

                        }
                    }
                }
            }

            if (currentTileLevel == 1) {
                player1UseLeftFootSprite = processZ1Movement(player1, player1UseLeftFootSprite);
                player2UseLeftFootSprite = processZ1Movement(player2, player2UseLeftFootSprite);
            }
        }

        gameContext.textAlign = "right";

        function drawInventory(player, x_position, y_position) {
            for (var currentInventorySlot = 0; currentInventorySlot < player.inventory.spaces; currentInventorySlot++) {

                gameContext.fillStyle = 'rgba(221, 204, 170, 0.5)';
                gameContext.fillRect(x_position + (currentInventorySlot * 50), y_position,
                    40, 40);

                if (typeof player.inventory.stacks[currentInventorySlot] != 'undefined' && player.inventory.stacks[currentInventorySlot].qty > 0) {
                    var itemType = itemTypes[player.inventory.stacks[currentInventorySlot].type];

                    itemType.sprite.draw(gameTime,
                        x_position + (currentInventorySlot * 50) + itemType.offset[0],
                        y_position + itemType.offset[1]);

                    if (player.inventory.stacks[currentInventorySlot].qty >= 1 && quantifiableItems.includes(player.inventory.stacks[currentInventorySlot].type)) {
                        gameContext.fillStyle = "#000000";
                        gameContext.fillText("" + player.inventory.stacks[currentInventorySlot].qty,
                            x_position + (currentInventorySlot * 50) + 38,
                            y_position + 38);
                    }
                }
            }
        }
        drawInventory(player1, 10, gameHeight - 50);
        drawInventory(player2, 500, gameHeight - 50);
        gameContext.textAlign = "left";

        gameContext.fillStyle = "#ff0000";
        //gameContext.fillText("FPS: " + framesLastSecond, 10, 20);
        //gameContext.fillText(gameSpeeds[currentSpeed].name, 10, 20);
        
        gameContext.fillStyle = 'rgba(255, 255, 255, 0.5)';
        gameContext.fillRect(gameWidth - 190, gameHeight - 50,
            170, 40);
        gameContext.strokeStyle = 'white';
        gameContext.strokeRect(gameWidth - 190, gameHeight - 50,
            170, 40);
        gameContext.fillStyle = "black";
        gameContext.font = "bold 14px Courier"
        gameContext.fillText("Cakes eaten count: " + cakesEaten, gameWidth - 185, gameHeight - 25);

        lastFrameTime = currentFrameTime;
        requestAnimationFrame(drawGame);
    }

})();

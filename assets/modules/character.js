import { Inventory } from "./inventory.js";
import { keysDown } from "./key.js";
import { mapWidth, mapHeight, toIndex } from "./map.js";
import { Sprite } from "./sprite.js";
import { mapTileData, tileWidth, tileHeight } from "./tile/tile.js"
import { floorTypes, getObjectTypeByName, objectCollision, objectTypes, tileTypes, treeTileTypes } from "./object/types.js"

export const directions = {
    up: 0,
    right: 1,
    down: 2,
    left: 3,
};

const npcTypes = [4,5,6,7,8,9];

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

export function Character(name) {
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

Character.prototype.placeAt = function (x, y) {
    this.tileFrom = [x, y];
    this.tileTo = [x, y];
    this.position = [((tileWidth * x) + ((tileWidth - this.dimensions[0]) / 2)),
    ((tileHeight * y) + ((tileHeight - this.dimensions[1]) / 2))
    ];
};

Character.prototype.isNotMoving = function () {
    if (this.isPlayer1) {
        return !keysDown[87] && !keysDown[83] && !keysDown[65] && !keysDown[68];
    } else {
        return !keysDown[37] && !keysDown[38] && !keysDown[39] && !keysDown[40];
    }
};

Character.prototype.showAffection = function () {
    var animatedHeart = new MapObject(getObjectTypeByName('Hearts'));
    animatedHeart.animate(this, 3000)
};

Character.prototype.processMovement = function (t) {
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
Character.prototype.canMoveTo = function (x, y) {
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

Character.prototype.isFacingOtherPlayer = function (player) {
    var nextTile = this.getNextPositionFromDirection(getDirectionKey(this.direction));

    if (nextTile[0] === player.tileFrom[0] && nextTile[1] === player.tileFrom[1]) {
        return true;
    }

    return false;
};

Character.prototype.isFacingMapObject = function () {
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

Character.playerOccupiesTile = function (player, tileX, tileY) {

    if (tileX === player.tileFrom[0] && tileY === player.tileFrom[1]) {
        return true;
    }

    return false;
};

Character.prototype.getNextPositionFromDirection = function (direction) {

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

Character.prototype.collidesWithPlayer = function (player, new_position) {

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

Character.prototype.canMove = function (direction) {
    var positionToMoveTo = this.getNextPositionFromDirection(direction);

    return this.canMoveTo(positionToMoveTo[0], positionToMoveTo[1]) && !this.collidesWithPlayer(this, positionToMoveTo);

};
Character.prototype.canMoveDirection = function (d) {
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

Character.prototype.moveLeft = function (t) {
    if (this.canMove('left'))
        this.tileTo[0] -= 1;
    this.timeMoved = t;
    this.direction = directions.left;
};
Character.prototype.moveRight = function (t) {
    if (this.canMove('right'))
        this.tileTo[0] += 1;
    this.timeMoved = t;
    this.direction = directions.right;
};
Character.prototype.moveUp = function (t) {
    if (this.canMove('up'))
        this.tileTo[1] -= 1;
    this.timeMoved = t;
    this.direction = directions.up;
};
Character.prototype.moveDown = function (t) {
    if (this.canMove('down'))
        this.tileTo[1] += 1;
    this.timeMoved = t;
    this.direction = directions.down;
};
Character.prototype.moveDirection = function (d, t) {
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

Character.prototype.inspectTerrainAhead = function () {
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
    return { "floorType": floorType, "hasRoof": hasRoof, "tileFromX": tileFromX, "tileFromY": tileFromY }
}

Character.prototype.pickUp = function () {
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

Character.exchangeItem = function (item, player1, player2) {

    if (item) {
        if (player1.inventory.containsItem(item)) {
            player1.inventory.removeItem(item);
            player2.inventory.addItems(item, 1)
        }
    }

};

Character.prototype.interactWithMapObject = function () {
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

Character.prototype.cutTree = function () {
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

Character.prototype.mineOre = function () {
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

Character.prototype.buildBridge = function () {
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

Character.prototype.buildWall = function () {
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

Character.prototype.plantTree = function () {
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
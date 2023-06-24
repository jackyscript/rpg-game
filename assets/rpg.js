import { Character, cakesEaten, directions } from "./modules/character/character.js"
import { PlacedItemStack, itemTypes } from "./modules/inventory.js"
import { map as gameMap, mapHeight, mapWidth, toIndex } from "./modules/gameMap.js"
import { getObjectTypeByName, objectTypes, tileTypes } from "./modules/object/types.js"
import { mapTileData, tileHeight, tileWidth } from "./modules/tile/tile.js"
import { typewriter as typeWriter, typeWriterNotWriting } from "./modules/typewriter.js"

import { MapObject } from "./modules/object/map.js"
import { Text } from "./modules/text.js"
import { gameContext } from "./modules/context.js"
import { keysDown } from "./modules/key.js"
import { occuredEvents } from "./modules/events.js"
import { roofList } from "./modules/roof.js"
import { tilesetLoaded } from "./modules/tile/tileset.js"

(function rpgGame() {
    const introductionText = 'Omnipresent Being: Welcome to this little game, I hope you have fun.';
    var introductionGiven = false;

    if (!introductionGiven)
        typeWriter(introductionText);


    var isViewportSetOnPlayer1 = true;

    var gameWidth = document.getElementById('game').getAttribute('width')
    var gameHeight = document.getElementById('game').getAttribute('height')

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

    var offsetFactor = 8;
    var startTileFactor = 1;
    var endTileFactor = 1;
    var viewport = {
        screen: [0, 0],
        startTile: [0, 0],
        endTile: [0, 0],
        offset: [0, 0],
        update: function (px, py) {
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
    player1.setOtherPlayer(player2);
    player2.setOtherPlayer(player1);

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

    var saveCurrentMap = function () {

        var savedGameMap = [];

        for (let i = 0; i < mapTileData.map.length; i++) {
            savedGameMap.push(mapTileData.map[i].type);
        }

        function replacer(key, value) { // break cyclic object serialization
            if ("otherPlayer" == key)
                return undefined;
            else
                return value;
        }

        localStorage.setItem('gameMap', JSON.stringify(savedGameMap));
        localStorage.setItem('occuredEvents', JSON.stringify(occuredEvents));
        localStorage.setItem(player1.name, JSON.stringify(player1, replacer));
        localStorage.setItem(player2.name, JSON.stringify(player2, replacer));
    };

    var loadSavedPlayer = function (player) {
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

    player1.otherPlayer = player2;
    player2.otherPlayer = player1;

    window.onload = function () {

        requestAnimationFrame(drawGame);
        gameContext.font = "bold 10pt sans-serif";

        window.addEventListener("keydown", function (e) {
            if (e.keyCode in keysDown) {
                keysDown[e.keyCode] = true;
                e.preventDefault();
                return false;
            }
        });
        window.addEventListener("keyup", function (e) {
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

            var spawnCake = function () {
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

        var processKeyboardInput = function (player) {

            if (!player.processMovement(gameTime) && gameSpeeds[currentSpeed].speedFactor != 0) {

                if (keysDown[112]) {

                    saveCurrentMap();

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
                                Character.exchangeItem(player1.inventory.getItemAt(0))
                            }
                        } else if (keysDown[50]) {
                            if (player == player1 && player1.isFacingOtherPlayer(player2)) {
                                Character.exchangeItem(player1.inventory.getItemAt(1))
                            }
                        } else if (keysDown[51]) {
                            if (player == player1 && player1.isFacingOtherPlayer(player2)) {
                                Character.exchangeItem(player1.inventory.getItemAt(2))
                            }
                        } else if (keysDown[52]) {
                            if (player == player1 && player1.isFacingOtherPlayer(player2)) {
                                Character.exchangeItem(player1.inventory.getItemAt(3))
                            }
                        } else if (keysDown[53]) {
                            if (player == player1 && player1.isFacingOtherPlayer(player2)) {
                                Character.exchangeItem(player1.inventory.getItemAt(4))
                            }
                        } else if (keysDown[54]) {
                            if (player == player1 && player1.isFacingOtherPlayer(player2)) {
                                Character.exchangeItem(player1.inventory.getItemAt(5))
                            }
                        } else if (keysDown[55]) {
                            if (player == player2 && player2.isFacingOtherPlayer(player1)) {
                                Character.exchangeItem(player2.inventory.getItemAt(0))
                            }
                        } else if (keysDown[56]) {
                            if (player == player2 && player2.isFacingOtherPlayer(player1)) {
                                Character.exchangeItem(player2.inventory.getItemAt(1))
                            }
                        } else if (keysDown[57]) {
                            if (player == player2 && player2.isFacingOtherPlayer(player1)) {
                                Character.exchangeItem(player2.inventory.getItemAt(2))
                            }
                        } else if (keysDown[48]) {
                            if (player == player2 && player2.isFacingOtherPlayer(player1)) {
                                Character.exchangeItem(player2.inventory.getItemAt(3))
                            }
                        } else if (keysDown[63]) {
                            if (player == player2 && player2.isFacingOtherPlayer(player1)) {
                                Character.exchangeItem(player2.inventory.getItemAt(4))
                            }
                        } else if (keysDown[192]) {
                            if (player == player2 && player2.isFacingOtherPlayer(player1)) {
                                Character.exchangeItem(player2.inventory.getItemAt(5))
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

        var setViewPortOn = function (player) {
            viewport.update(player.position[0] + (player.dimensions[0] / 2),
                player.position[1] + (player.dimensions[1] / 2));
        };
        if (isViewportSetOnPlayer1) {
            setViewPortOn(player1);
        } else {
            setViewPortOn(player2);
        }

        var checkPlayerRoofFrom = function (player) {
            return mapTileData.map[toIndex(
                player.tileFrom[0], player.tileFrom[1])].roof;
        }
        var checkPlayerRoofTo = function (player) {
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
                        var isRoofPassed = function () {
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

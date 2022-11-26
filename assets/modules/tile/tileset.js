export var tileset = null;
export var tilesetLoaded = false;

const tilesetURL = "assets/tileset.png";

tileset = new Image();
tileset.onerror = function () {
    gameContext = null;
    alert("Failed loading tileset.");
};
tileset.onload = function () {
    tilesetLoaded = true;
};
tileset.src = tilesetURL;
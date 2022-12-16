import { mapTileData } from "../tile/tile.js"
import { toIndex } from "../gameMap.js";

export function MapObject(nt) {
    this.x = 0;
    this.y = 0;
    this.type = nt;
}

MapObject.prototype.placeAt = function (nx, ny) {
    if (mapTileData.map[toIndex(this.x, this.y)].object == this) {
        mapTileData.map[toIndex(this.x, this.y)].object = null;
    }

    this.x = nx;
    this.y = ny;

    mapTileData.map[toIndex(nx, ny)].object = this;
};

MapObject.prototype.animate = function (player, duration) {

    this.placeAt(player.tileFrom[0], player.tileFrom[1]);
    var x = player.tileFrom[0];
    var y = player.tileFrom[1];
    var clearObject = function () {
        var dataPosition = mapTileData.map[toIndex(x, y)];
        if (dataPosition && dataPosition.object)
            dataPosition.object = undefined
    }
    setTimeout(clearObject, duration);
};
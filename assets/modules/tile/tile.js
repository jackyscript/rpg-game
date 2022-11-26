import { toIndex } from "../map.js";

export function Tile(tx, ty, tt) {
    this.x = tx;
    this.y = ty;
    this.type = tt;
    this.roof = null;
    this.roofType = 0;
    this.eventEnter = null;
    this.object = null;
    this.itemStack = null;
}

export function TileMap() {
    this.map = [];
    this.w = 0;
    this.h = 0;
    this.levels = 4;
}
TileMap.prototype.setupEvent = function (x, y, action) {

    this.map[toIndex(x, y)].eventEnter = function () {
        action();
    };
};
TileMap.prototype.buildMapFromData = function (d, w, h) {
    this.w = w;
    this.h = h;

    if (d.length != (w * h)) {
        return false;
    }

    this.map.length = 0;

    for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
            this.map.push(new Tile(x, y, d[((y * w) + x)]));
        }
    }

    return true;
};
TileMap.prototype.saveCurrentMap = function () {
    var savedGameMap = [];
    for (var i = 0; i < this.map.length; i++) {
        savedGameMap.push(this.map[i].type);
    }
    localStorage.setItem('gameMap', JSON.stringify(savedGameMap));
    localStorage.setItem('occuredEvents', JSON.stringify(occuredEvents));
    localStorage.setItem(player1.name, JSON.stringify(player1));
    localStorage.setItem(player2.name, JSON.stringify(player2));
};
TileMap.prototype.addRoofs = function (roofs) {
    for (var i in roofs) {
        var r = roofs[i];

        if (r.x < 0 || r.y < 0 || r.x >= this.w || r.y >= this.h ||
            (r.x + r.w) > this.w || (r.y + r.h) > this.h ||
            r.data.length != (r.w * r.h)) {
            continue;
        }

        for (var y = 0; y < r.h; y++) {
            for (var x = 0; x < r.w; x++) {
                var tileIdx = (((r.y + y) * this.w) + r.x + x);

                this.map[tileIdx].roof = r;
                this.map[tileIdx].roofType = r.data[((y * r.w) + x)];
            }
        }
    }
};

export const mapTileData = new TileMap();
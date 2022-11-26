import { Sprite } from "./sprite.js";
import { toIndex } from "./map.js";
import { mapTileData } from "./tile/tile.js";

export function Stack(id, qty) {
    this.type = id;
    this.qty = qty;
}

export function Inventory(s) {
    this.spaces = s;
    this.stacks = [];
}

Inventory.prototype.getItemAt = function (index) {
    if (this.stacks[index]) {
        var itemSlot = this.stacks[index];
        if (itemSlot.type) {
            return itemSlot.type;
        }
    }
};
Inventory.prototype.addItems = function (id, qty) {
    for (var i = 0; i < this.spaces; i++) {
        if (this.stacks.length <= i) {
            var maxHere = (qty > itemTypes[id].maxStack ?
                itemTypes[id].maxStack : qty);
            this.stacks.push(new Stack(id, maxHere));

            qty -= maxHere;
        } else if (this.stacks[i].type == id &&
            this.stacks[i].qty < itemTypes[id].maxStack) {
            var maxHere = (itemTypes[id].maxStack - this.stacks[i].qty);
            if (maxHere > qty) {
                maxHere = qty;
            }

            this.stacks[i].qty += maxHere;
            qty -= maxHere;
        }

        if (qty == 0) {
            return 0;
        }
    }

    return qty;
};

Inventory.prototype.removeItem = function (type) {
    for (var i = 0; i < this.spaces; i++) {
        if (type === this.stacks[i].type) {
            if (this.stacks[i].qty > 0) {
                this.stacks[i].qty -= 1;
            }
            return true;
        }
    }
    return false;
};

Inventory.prototype.containsItem = function (id) {
    for (var i = 0; i < this.stacks.length; i++) {
        if (this.stacks[i].type == id && this.stacks[i].qty > 0) {
            return true;
        }
    }

    return false;
};

export function PlacedItemStack(id, qty) {
    this.type = id;
    this.qty = qty;
    this.x = 0;
    this.y = 0;
}

PlacedItemStack.prototype.placeAt = function (nx, ny) {
    if (mapTileData.map[toIndex(this.x, this.y)].itemStack == this) {
        mapTileData.map[toIndex(this.x, this.y)].itemStack = null;
    }

    this.x = nx;
    this.y = ny;

    mapTileData.map[toIndex(nx, ny)].itemStack = this;
};

export const itemTypes = {
    1: {
        name: "Star",
        maxStack: 2,
        sprite: new Sprite([{
            x: 240,
            y: 0,
            w: 40,
            h: 40
        }]),
        offset: [0, 0]
    },
    2: {
        name: "Axe",
        maxStack: 1,
        sprite: new Sprite([{
            x: 300,
            y: 40,
            w: 26,
            h: 26
        }]),
        offset: [0, 0]
    },
    3: {
        name: "Pickaxe",
        maxStack: 1,
        sprite: new Sprite([{
            x: 326,
            y: 40,
            w: 25,
            h: 25
        }]),
        offset: [0, 0]
    },
    4: {
        name: "Hammer",
        maxStack: 1,
        sprite: new Sprite([{
            x: 351,
            y: 40,
            w: 24,
            h: 24
        }]),
        offset: [0, 0]
    },
    5: {
        name: "Wood plank",
        maxStack: 999,
        sprite: new Sprite([{
            x: 375,
            y: 40,
            w: 27,
            h: 21
        }]),
        offset: [0, 0]
    },
    6: {
        name: "Shovel",
        maxStack: 1,
        sprite: new Sprite([{
            x: 300,
            y: 66,
            w: 26,
            h: 26
        }]),
        offset: [0, 0]
    },
    7: {
        name: "Iron ore",
        maxStack: 999,
        sprite: new Sprite([{
            x: 402,
            y: 40,
            w: 28,
            h: 24
        }]),
        offset: [0, 0]
    },
};
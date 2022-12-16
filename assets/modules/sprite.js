import {gameContext} from "./context.js"
import {getRandomInt} from "./utils.js"
import {tileset} from "./tile/tileset.js"

export function Sprite(data) {
    this.animated = data.length > 1;
    this.frameCount = data.length;
    this.duration = 0;
    this.loop = true;

    if (data.length > 1) {
        for (var i in data) {
            if (typeof data[i].d == 'undefined') {
                data[i].d = 100;
            }
            if (data[i].d == 'random') {
                data[i].d = getRandomInt(500, 800);
            }
            this.duration += data[i].d;

            if (typeof data[i].loop != 'undefined') {
                this.loop = data[i].loop ? true : false;
            }
        }
    }

    this.frames = data;
}
Sprite.prototype.draw = function (t, x, y) {
    var frameIndex = 0;

    if (!this.loop && this.animated && t >= this.duration) {
        frameIndex = (this.frames.length - 1);
    } else if (this.animated) {
        t = t % this.duration;
        var totalD = 0;

        for (var i in this.frames) {
            totalD += this.frames[i].d;
            frameIndex = i;

            if (t <= totalD) {
                break;
            }
        }
    }

    var offset = (typeof this.frames[frameIndex].offset == 'undefined' ? [0, 0] : this.frames[frameIndex].offset);

    gameContext.drawImage(tileset,
        this.frames[frameIndex].x, this.frames[frameIndex].y,
        this.frames[frameIndex].w, this.frames[frameIndex].h,
        x + offset[0], y + offset[1],
        this.frames[frameIndex].w, this.frames[frameIndex].h);
};

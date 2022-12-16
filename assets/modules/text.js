import { occuredEvents } from "./events.js"
import { typewriter as typeWriter } from "./typewriter.js"

export class Text { }

const greetingTexts = ["Add your greetings here!", "Hello player 1!", "Hello player 2!", "In every programming project there must be one occurence of 'Hello world', don't you think?", "I don't know what I am talking about.", "Some greetings!", "Happy Birthday!", "Merry Christmas!", "Glad to see you, hope you are doing well?", "There you are, where were you heading?", "Happy to meet you."]
const eatTexts = ["Mjam mjam", "Delicious!", "Tasty!", "This tastes good indeed.", "Yea!", "nom nom nom", "I think I should stop eating.", "One more.", "That tasted a little bit strange."]

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
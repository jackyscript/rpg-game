import { occuredEvents } from "./events.js"
import { typewriter as typeWriter } from "./typewriter.js"
import { occasionally } from "./random.js"

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
    playerSaying(player, "I will need an axe for that.");
};

Text.needWood = function(player) {
    playerSaying(player, "Don't have enough wood with me.");
};

Text.needStone = function(player) {
    playerSaying(player, "Need stones!");
};

Text.needPickAxe = function(player) {
    playerSaying(player, "A pickaxe would be perfect now.");
};

Text.needShovel = function(player) {
    playerSaying(player, "I need a shovel.");
};

Text.receivedItem = function(item) {

    switch (item.type) {

        case 2:
            typeWriter("You got an axe!");
            break;
        case 3:
            typeWriter("You got a pickaxe!");
            break;
        case 4:
            typeWriter("You got a hammer!");
            break;
        case 6:
            typeWriter("You got a shovel!");
            break;

    }

};

Text.hammerTime = function(player) {
    playerSaying(player, "Hammer Time!", "excitedly");
};

Text.gameSaved = function() {
    typeWriter("Savegame saved!");
};

Text.saveGameDeleted = function() {
    typeWriter("Savegame removed.");
};

Text.eatCake = function(player) {
    var eatText = eatTexts[Math.floor(Math.random() * eatTexts.length)];
    playerSaying(player, eatText);
};

Text.plantTree = function(player) {
    playerSaying(player, "To quickly plant trees like that is only possible in games!", "sows seeds");
};

Text.cutTree = function(player) {
    playerSaying(player, "*Boo hoo*", "swings axe");
};

Text.mineOre = function(player) {
    playerSaying(player, "...time tries to heal our wounds...", "swings pickaxe");
};

Text.buildWall = function(player) {
    playerSaying(player, "People tend to build too many walls not bridges.");
};

Text.buildBridge = function(player) {
    playerSaying(player, "It is better to build bridges than walls.");
};

function playerSaying(player, saying, action) {
    
    var playerName = player.name.toUpperCase();
    if (occasionally()) {
        typeWriter(` ${playerName} ${action? action : ""}: ${saying}`);
    }
}

Text.showAffection = function(player1, player2) {
    var player1Name = player1.name.toUpperCase();
    var player2Name = player2.name.toUpperCase();
    typeWriter(player1Name + " is very happy");
};
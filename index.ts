import { RGBot } from "rg-bot";
import {Entity, Item} from "minecraft-data";
import {Vec3} from "vec3";

const BLUE_SCORE = new Vec3(160, 63, -385)

/**
 * This strategy is the simplest example of how to get started with the rg-bot package.
 * The Bot will run around and gather Poppies until it has 100 in its inventory.
 */
export function configureBot(bot: RGBot) {

    bot.setDebug(true);
    bot.allowDigWhilePathing(false);

    // This is our main loop. The Bot will invoke this on spawn.
    // goal: collect 100 Poppies
    async function getFlag() {
        let flag = bot.findBlock("white_banner", {maxDistance: 100})
        if (flag) {
            bot.chat("Going to get the flag!");
            await bot.approachBlock(flag)
        } else {
            bot.chat("Did not find the flag")
        }
    }

    async function returnFlag() {
        bot.chat("Catch me if you can!")
        await bot.approachBlock(bot.mineflayer().blockAt(BLUE_SCORE), {reach: 0.1})
    }

    bot.on("playerCollect", async (collector: Entity, collected: Item) => {
        let isMe = collector.displayName == bot.username()
        let collectedItem = collected.displayName
        bot.chat("Picked up a " + collectedItem)
        if (isMe && collectedItem.toLowerCase().includes("banner")) {
            await returnFlag();
        }
    })

    // Have the Bot begin our main loop when it spawns into the game
    bot.on('spawn', async () => {
        bot.chat('Get ready to face your doom!');

        // If I spawned with a banner, run!
        if (bot.inventoryContainsItem("banner", {partialMatch: true})) {
            await returnFlag();
        }

    });

    bot.on('chat', async (username: string, message: string) => {
        if (message == "get flag") {
            getFlag();
        }
    })

}
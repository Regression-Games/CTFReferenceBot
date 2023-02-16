import { RGBot } from "rg-bot";
import Commander from "./commander";
import {generateTrashTalk} from "./trash-talk";
import {Entity} from "prismarine-entity";
import {Item} from "prismarine-item";
import RGCTFUtils from 'rg-ctf-utils';
import {Vec3} from "vec3";

/**
 * This strategy is the simplest example of how to get started with the rg-bot package.
 * The Bot will run around and gather Poppies until it has 100 in its inventory.
 */
export function configureBot(bot: RGBot) {

    bot.setDebug(true);
    bot.allowDigWhilePathing(false);
    const ctfUtils = new RGCTFUtils(bot);
    ctfUtils.debug = true;
    const commander = new Commander(bot);

    commander.register("start", async () => {
        await ctfUtils.approachFlag();
    })

    bot.on('message', async (jsonMsg, position, sender, verified) => {
        const enemyNames = ["DijkstrasPath"] // ctfUtils.getEnemyUsernames()
        if (position == "system") {
            const message = jsonMsg.extra[0]['text'];
            if (message.includes("flag") && enemyNames.includes(message.split(" ")[0])) {
                const trashTalk = await generateTrashTalk(message);
                if (trashTalk) {
                    bot.chat(trashTalk)
                }
            }
        }
    });

    bot.on('chat', async (username: string, message: string) => {
        const enemyNames = ["DijkstrasPath"] // ctfUtils.getEnemyUsernames()
        if (username == bot.username()) return;
        if (enemyNames.includes(username)) {
            const trashTalk = await generateTrashTalk(message);
            if (trashTalk) {
                bot.chat(trashTalk)
            }
        }
    });

    ctfUtils.on('flagObtained', async (playerUsername: string) => {
        // If I was the one to obtain the flag, go and score!
        if (playerUsername == bot.username()) {
            await ctfUtils.scoreFlag();
        }
    });

    ctfUtils.on('flagScored', async (team: string) => {
        // After scoring, collect items until the flag comes back
        bot.chat("Flag scored, waiting until it respawns")
        // await bot.findAndCollectItemsOnGround({maxDistance: 50});
        // await bot.waitForMilliseconds(1000);
    })

    ctfUtils.on('flagAvailable', async (position: Vec3) => {
        bot.chat("Flag is available, going to get it")
        await ctfUtils.approachFlag();
    })

    ctfUtils.on('itemDetected', (item: Item) => {
        bot.chat(`I see that a ${item.name} has spawned`)
    })

    ctfUtils.on('itemCollected', (collector: Entity, item: Item) => {
        bot.chat(`I see that ${collector.username} picked up ${item.name}`)
    })

}
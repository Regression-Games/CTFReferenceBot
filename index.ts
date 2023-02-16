import { RGBot } from "rg-bot";
import {Entity} from "prismarine-entity";
import {Item} from "prismarine-item";
import RGCTFUtils from 'rg-ctf-utils';
import {Vec3} from "vec3";

/**
 * This strategy is the simplest example of how to get started with the rg-bot and rg-ctf-utils package.
 * The Bot will get the flag and then run back to base to score.
 */
export function configureBot(bot: RGBot) {

    bot.setDebug(true);
    bot.allowDigWhilePathing(false);
    const ctfUtils = new RGCTFUtils(bot);
    ctfUtils.debug = false;

    bot.on('chat', async (username, message) => {
        if (username === bot.username) return;
        if (message === 'start') {
            bot.chat("Going to start capturing the flag!")
            await ctfUtils.approachFlag()
        }
    })

    ctfUtils.on('flagObtained', async (playerUsername: string) => {
        // If I was the one to obtain the flag, go and score!
        if (playerUsername == bot.username()) {
            await ctfUtils.scoreFlag();
        }
    });

    ctfUtils.on('flagScored', async (team: string) => {
        // The flag takes 10 seconds to respawn after scoring
        bot.chat("Flag scored, waiting until it respawns")
    })

    ctfUtils.on('flagAvailable', async (position: Vec3) => {
        bot.chat("Flag is available (either dropped or spawned), going to get it")
        await ctfUtils.approachFlag();
    })

    ctfUtils.on('itemDetected', (item: Item) => {
        bot.chat(`I see that a ${item.name} has spawned`)
    })

    ctfUtils.on('itemCollected', (collector: Entity, item: Item) => {
        bot.chat(`I see that ${collector.username} picked up ${item.name}`)
    })

}
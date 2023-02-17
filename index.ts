import { RGBot } from "rg-bot";
import {Entity} from "prismarine-entity";
import {Item} from "prismarine-item";
import RGCTFUtils, {CTFEvent} from 'rg-ctf-utils';
import {Vec3} from "vec3";

/**
 * This strategy is the simplest example of how to get started with the rg-bot and rg-ctf-utils package.
 * The Bot will get the flag and then run back to base to score.
 */
export function configureBot(bot: RGBot) {

    bot.setDebug(true);
    bot.allowDigWhilePathing(false);
    const rgctfUtils = new RGCTFUtils(bot);
    rgctfUtils.setDebug(false);

    bot.on('chat', async (username, message) => {
        if (username === bot.username) return;
        if (message === 'start') {
            bot.chat("Going to start capturing the flag!")
            await rgctfUtils.approachFlag()
        }
    })

    bot.on(CTFEvent.FLAG_OBTAINED, async (collector: string) => {
        // If I was the one to obtain the flag, go and score!
        if (collector == bot.username()) {
            await rgctfUtils.scoreFlag()
        }
    });

    bot.on(CTFEvent.FLAG_SCORED, async (teamName: string) => {
        // After scoring, send a message to chate
        bot.chat(`Flag scored by ${teamName} team, waiting until it respawns`)
    })

    bot.on(CTFEvent.FLAG_AVAILABLE, async (position: Vec3) => {
        bot.chat("Flag is available, going to get it")
        await rgctfUtils.approachFlag();
    })

    bot.on(CTFEvent.ITEM_DETECTED, (item: Item, entity: Entity) => {
        bot.chat(`I see that a ${item.name} has spawned`)
    })

    bot.on(CTFEvent.ITEM_COLLECTED, (collector: Entity, item: Item) => {
        bot.chat(`I see that ${collector.username} picked up ${item?.name}`)
    })

}
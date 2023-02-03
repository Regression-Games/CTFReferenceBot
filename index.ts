import { RGBot } from "rg-bot";
import RGCTFUtils from './rg-ctf-utils';
import Commander from "./commander";

/**
 * This strategy is the simplest example of how to get started with the rg-bot package.
 * The Bot will run around and gather Poppies until it has 100 in its inventory.
 */
export function configureBot(bot: RGBot) {

    bot.setDebug(true);
    bot.allowDigWhilePathing(false);
    const ctfUtils = new RGCTFUtils(bot);
    const commander = new Commander(bot);

    commander.register('flag', async () => {
        const flagLocation = ctfUtils.getFlagLocation();
        bot.chat("Flag location: " + JSON.stringify(flagLocation));
    })

    commander.register('get flag', async () => {
        await ctfUtils.approachFlag();
    })

    commander.register('score', async () => {
        await ctfUtils.scoreFlag();
    });

    bot.on('entitySpawn', (entity) => {
        console.log(entity)
    })

    bot.on('playerCollect', (collector, collected) => {
        console.log(collector, collected)
    })

}
import { RGBot } from "rg-bot";
import {Entity, Item} from "minecraft-data";
import {Vec3} from "vec3";
import {Steamship} from '@steamship/client'
import RGCTFUtils from './rg-ctf-utils';
import Commander from "./commander";

const BLUE_SCORE = new Vec3(160, 63, -385)

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

}
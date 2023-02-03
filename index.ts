import { RGBot } from "rg-bot";
import RGCTFUtils from './rg-ctf-utils';
import Commander from "./commander";
import {Entity} from "minecraft-data";

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

    commander.register('items', async () => {
        let items = bot.findItemsOnGround({maxDistance: 100});
        console.log(items.length);
        console.log(items);
    })

    bot.on('entitySpawn', (entity) => {
        // if (entity.objectType === "Item" && entity.onGround && entity?.metadata?.length > 8) {
        //     console.log("Item spawned on ground!")
        //     const distance = bot.position().distanceTo(entity.position)
        //     const itemEntity = this.getItemDefinitionById(entity.metadata[8]?.itemId)
        //     const itemName = itemEntity.name
        //     console.log([itemEntity.count, itemName, distance])
        // } else {
        //     console.log("Something spawned that was not on the ground")
        // }
    })

    bot.on('playerCollect', (collector, collected) => {
        // const itemEntity = bot.getItemDefinitionById(collected.metadata[8]?.itemId)
        // const distance = bot.position().distanceTo(collected.position)
        // const itemName = itemEntity.name
        // console.log(["collected", itemEntity.count, itemName, distance])
    })

}
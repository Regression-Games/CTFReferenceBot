import { RGBot } from "rg-bot";
import RGCTFUtils from './rg-ctf-utils';
import Commander from "./commander";
import {Entity} from "minecraft-data";
import StateMachine from "./state_machine";

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

    // Define a state machine that can take actions for us
    const sm = new StateMachine();
    sm.setStateToEdges('has_no_flag', async (): Promise<string> => {
        // When we have no flag, find the flag and go get it
        const flagLocation = ctfUtils.getFlagLocation();
        if (!flagLocation) {
            bot.chat("Could not find flag, going to wait a few more seconds...")
            await new Promise(resolve => setTimeout(resolve, 2000));
            return 'has_no_flag'; // go back to this state
        }

        // When we have the flag, navigate towards it. This could be a whole other state, but
        // we implement it as a transition.
        bot.chat("Found the flag, moving towards it...");
        await ctfUtils.approachFlag();

        // Once we get there, let's actually check that we have the flag. If we don't we need to try again
        // (this could mean someone else picked it up)
        bot.chat("Has flag: " + ctfUtils.hasFlag());

        return ctfUtils.hasFlag() ? "has_flag" : "has_no_flag";
    })

    sm.setStateToEdges('has_flag', async (): Promise<string> => {
        // First, verify that we have a flag. If not, we have to go back to no flag
        if (!ctfUtils.hasFlag()) {
            bot.chat("Thought I had the flag, but I don't... going to go find it");
            return 'has_no_flag';
        }

        // If we have the flag, let's go score it
        await ctfUtils.scoreFlag();
        bot.chat("Scored! Going back to not having a flag")
        return 'has_no_flag';
    })

    sm.setState("has_no_flag");

    commander.register('start', async () => {
        while (!sm.isTerminated()) {
            await sm.tick();
        }
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
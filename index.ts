import { RGBot } from "rg-bot";
import Commander from "./commander";
import StateMachine from "./state_machine";
import {generateTrashTalk} from "./trash-talk";
import {Entity, Item} from "minecraft-data";
import RGCTFUtils from 'rg-ctf-utils';

/**
 * This strategy is the simplest example of how to get started with the rg-bot package.
 * The Bot will run around and gather Poppies until it has 100 in its inventory.
 */
export function configureBot(bot: RGBot) {

    bot.setDebug(true);
    bot.allowDigWhilePathing(false);
    const ctfUtils = new RGCTFUtils(bot);
    const commander = new Commander(bot);

    let shouldStop = false;

    // Define a state machine that can take actions for us
    const sm = new StateMachine();
    sm.setStateToEdges('has_no_flag', async (): Promise<string> => {
        if (shouldStop) {
            return "stop";
        }

        // Check that we may have the flag... if we do, move to has flag
        if (ctfUtils.hasFlag()) {
            bot.chat("Thought I did not have the flag, but I do... going to score it");
            return 'has_flag';
        }

        // When we have no flag, find the flag and go get it
        const flagLocation = ctfUtils.getFlagLocation();
        if (!flagLocation) {
            bot.chat("Could not find flag, going to look for items while I wait...")
            return 'collect_items';
        }

        // When we have the flag, navigate towards it. This could be a whole other state, but
        // we implement it as a transition.
        bot.chat("Found the flag, moving towards it...");
        await ctfUtils.approachFlag();

        // Once we get there, let's actually check that we have the flag. If we don't we need to try again
        // (this could mean someone else picked it up)
        bot.chat("Has flag: " + ctfUtils.hasFlag());

        return ctfUtils.hasFlag() ? "has_flag" : "has_no_flag";
    });

    sm.setStateToEdges('has_flag', async (): Promise<string> => {
        if (shouldStop) {
            return "stop";
        }

        // First, verify that we have a flag. If not, we have to go back to no flag
        if (!ctfUtils.hasFlag()) {
            bot.chat("Thought I had the flag, but I don't... going to go find it");
            return 'has_no_flag';
        }

        // If we have the flag, let's go score it
        bot.chat("Going to score the flag..")
        await ctfUtils.scoreFlag();
        bot.chat("Scored! Going back to not having a flag")
        return 'has_no_flag';
    });

    sm.setStateToEdges('collect_items', async (): Promise<string> => {
        if (shouldStop) {
            return "stop";
        }
        await bot.findAndCollectItemsOnGround({maxDistance: 50});
        bot.chat("Finished collecting items (todo: equip and use)")
        await bot.waitForMilliseconds(1000);
        return "has_no_flag";
    });

    sm.setState("has_no_flag");
    sm.setTerminalState("stop");

    commander.register('start', async () => {
        while (!sm.isTerminated()) {
            await sm.tick();
        }
        bot.chat("Terminated state machine logic")
    });

    commander.register('stop', async () => {
        shouldStop = true;
    });

    commander.register('teams', async () => {
        bot.chat("My Team: " + JSON.stringify(bot.getMyTeam()));
        await bot.waitForMilliseconds(1000);
        bot.chat("My Teammates: " + JSON.stringify(bot.getTeammateUsernames(true)));
        await bot.waitForMilliseconds(1000);
        bot.chat("Enemy Team: " + JSON.stringify(bot.getOpponentUsernames()));
        await bot.waitForMilliseconds(1000);
    });

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

    ctfUtils.on('flagObtained', (playerEntity: Entity, flag: Item) => {
        console.log("CTF EVENT - flagObtained -------")
        // @ts-ignore
        console.log(playerEntity.username)
        console.log(flag)
        console.log("--------------------------------")
    });

    ctfUtils.on('flagScored', (team: string) => {
        // @ts-ignore
        console.log("CTF EVENT - flagScored -------")
        console.log(team)
        console.log("--------------------------------")
    })

    ctfUtils.on('flagAvailable', (flag: Item) => {
        // @ts-ignore
        console.log("CTF EVENT - flagAvailable -------")
        console.log(flag)
        console.log("--------------------------------")
    })

    ctfUtils.on('itemDetected', (item: Item) => {
        // @ts-ignore
        console.log("CTF EVENT - itemDetected -------")
        console.log(item)
        console.log("--------------------------------")
    })

    ctfUtils.on('itemCollected', (collector: Entity, item: Item) => {
        // @ts-ignore
        console.log("CTF EVENT - itemCollected -------")
        // @ts-ignore
        console.log(collector.username)
        console.log(item)
        console.log("--------------------------------")
    })

}
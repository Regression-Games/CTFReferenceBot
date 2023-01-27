import { RGBot } from "rg-bot";

/**
 * This strategy is the simplest example of how to get started with the rg-bot package.
 * The Bot will run around and gather Poppies until it has 100 in its inventory.
 */
export function configureBot(bot: RGBot) {

    bot.setDebug(true);

    // This is our main loop. The Bot will invoke this on spawn.
    // goal: collect 100 Poppies
    async function getFlag() {
        bot.chat("Going to get the flag!");
        let flags = bot.findBlock("banner", {partialMatch: true})
        if (flags) {
            await bot.approachBlock(flags[0])
        }
    }

    // Have the Bot begin our main loop when it spawns into the game
    bot.on('spawn', async () => {
        bot.chat('Get ready to face your doom!');
    });

    bot.on('chat', async (username: string, message: string) => {
        if (message == "get flag") {
            getFlag();
        }
    })

}
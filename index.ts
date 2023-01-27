import { RGBot } from "rg-bot";

/**
 * This strategy is the simplest example of how to get started with the rg-bot package.
 * The Bot will run around and gather Poppies until it has 100 in its inventory.
 */
export function configureBot(bot: RGBot) {

    bot.setDebug(true);

    // This is our main loop. The Bot will invoke this on spawn.
    // goal: collect 100 Poppies
    async function startGathering() {

        // Check the Bot's inventory - if it has less than 100 Poppies
        // then it needs to find and gather one
        while (bot.getInventoryItemQuantity('Poppy') < 100) {

            // Try to locate a Poppy nearby and dig it up
            const collectedPoppy = await bot.findAndDigBlock('Poppy');

            if (collectedPoppy) {
                // If the Bot collected a Poppy, then announce it in chat
                bot.chat('I collected a Poppy.');
            }
            else {
                // If the Bot couldn't find a poppy
                // or failed to collect one that it did find,
                // then have it wander around before trying to find another
                await bot.wander();
            }
        }

        // once the Bot has 4 poppies, celebrate!
        bot.chat('Wow! I have collected 100 Poppies!');
    }

    // Have the Bot begin our main loop when it spawns into the game
    bot.on('spawn', async () => {
        bot.chat('Hello, I have arrived!');
        startGathering();
    });

}
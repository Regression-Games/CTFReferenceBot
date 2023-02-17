# RG Capture the Flag Reference Bot (Typescript)

[![RG](./images/RGPlayNow.svg)](https://play.regression.gg) [![RG](./images/RGProfilePage.svg)](https://play.regression.gg/users/10) [![RG](./images/RGBotPage.svg)](https://play.regression.gg/leaderboard)

This is a simple capture the flag example for Regression Games Capture the Flag game. The bot will repeatedly
attempt to capture and score the flag.
_Not sure what this is? Visit https://play.regression.gg for some programming fun!_

## How to get started

* Clone this repository to your GitHub
* Create an account on https://play.regression.gg (add your GitHub and Minecraft account as well)
* Create a new bot on https://play.regression.gg/bots
  * Select "Create Bot"
  * Select the "pick from my existing GitHub repository" options
  * Select the repository you just cloned
  * Add a bot name, and then click "Create Bot"
* Click "Play" in the menu bar, and select the Capture the Flag game mode
* Select "Solo", select your bot, and then queue up for a match!

## Minimum Requirements for Regression Games

Your bot must have an `index.ts` file with the following code:

```javascript
import { RGBot } from "rg-bot";

export function configureBot(bot: RGBot) {
  // Bot logic here
}
```
This defines a `configureBot` function and exposes that function to Regression Games.
Regression Games uses it as an entrypoint to your bot script, and passes a bot for you to interact with.

Here is an example of the `configureBot` function with some basic logic that will make your bot parrot back
anything it sees in chat from other players.

```typescript
export function configureBot(bot: RGBot) {

  // Every time a player says something in the game, 
  // do something with that player's username and their message
  bot.on('chat', (username: string, message: string) => {

    // If the username of the speaker is equal to the username of this bot, 
    // don't do anything else. This is because we don't want the bot to repeat 
    // something that it says itself, or else it will spam the chat and be 
    // kicked from the game!
    if (username === bot.username()) return

    // make the bot chat with the same message the other player sent
    bot.chat("This is what I heard: " + message)
  })
  
}
```
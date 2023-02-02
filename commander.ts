import {RGBot} from "rg-bot";


export default class Commander {

    private bot: RGBot;

    constructor(bot: RGBot) {
        this.bot = bot;
    }

    register(command, callback) {
        this.bot.on('chat', async (username: string, message: string) => {
            if (message == command) {
                await callback();
            }
        })
    }

}
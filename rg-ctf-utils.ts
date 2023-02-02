import {Vec3} from "vec3";
import {RGBot} from "rg-bot";


export default class RGCTFUtils {

    private bot: RGBot;

    public NEUTRAL_FLAG_ITEM_NAME = "white_banner";

    constructor(bot: RGBot) {
        this.bot = bot;
    }

    /**
     * Gets the location of the flag
     */
    getFlagLocation(): Vec3 {
        return this.bot.findBlock(this.NEUTRAL_FLAG_ITEM_NAME, {maxDistance: 100}).position;
    }

}
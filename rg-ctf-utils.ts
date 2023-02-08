import {Vec3} from "vec3";
import {RGBot} from "rg-bot";
const { GoalNear } = require('mineflayer-pathfinder').goals

/**
 * A collection of utilities for the Capture the Flag game mode
 * Includes location of points of interest, simplified functions
 * for gathering and scoring the flag, and utilities for finding
 * both teammates and enemies.
 */
export default class RGCTFUtils {

    private bot: RGBot;

    public FLAG_ITEM_NAME = "white_banner";
    public FLAG_DROP_NAME = "banner";
    public BLUE_SCORE_LOCATION = new Vec3(160, 63, -385)
    public RED_SCORE_LOCATION = new Vec3(160, 63, -385);

    constructor(bot: RGBot) {
        this.bot = bot;
    }

    /**
     * Gets the location of either the neutral flag OR a team's flag on the ground.
     * @return The location of either the neutral flag OR a team's flag on the ground.
     */
    getFlagLocation(): Vec3 | null {
        let flag = this.bot.findBlock(this.FLAG_ITEM_NAME, {maxDistance: 100, partialMatch: false});
        if (!flag) {
            // @ts-ignore
            flag = this.bot.findItemOnGround(this.FLAG_DROP_NAME, {maxDistance: 100, partialMatch: true});
        }
        return flag ? flag.position : null;
    }

    /**
     * Commands the bot to move towards the flag location, if the flag exists.
     * @return true if the bot reached the flag, false otherwise
     */
    async approachFlag(): Promise<boolean> {
        const flagLocation = this.getFlagLocation();
        if (flagLocation) {
            return await this.bot.approachPosition(flagLocation, {reach: 0.1});
        }
    }

    /**
     * Commands the bot to score the flag in your team's base.
     * @return true if the bot reached the scoring zone, and false otherwise
     */
    async scoreFlag(): Promise<boolean> {
        const myTeam = this.bot.myTeam();
        const scoreLocation = myTeam == "BLUE" ? this.RED_SCORE_LOCATION : this.BLUE_SCORE_LOCATION;
        const goal = new GoalNear(scoreLocation.x, scoreLocation.y, scoreLocation.z, 0.1);
        return await this.bot.handlePath(async () => {
            // @ts-ignore
            await this.bot.mineflayer().pathfinder.goto(goal);
        });
    }

    /**
     * Returns true if this bot has the flag, and false otherwise.
     */
    hasFlag(): boolean {
        return this.bot.inventoryContainsItem('banner', {partialMatch: true})
    }

}
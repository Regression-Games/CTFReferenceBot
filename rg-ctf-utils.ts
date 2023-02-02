import {Vec3} from "vec3";
import {RGBot} from "rg-bot";
const { GoalNear, GoalPlaceBlock, GoalLookAtBlock, GoalXZ, GoalInvert, GoalFollow } = require('mineflayer-pathfinder').goals


export default class RGCTFUtils {

    private bot: RGBot;

    public FLAG_ITEM_NAME = "banner";

    constructor(bot: RGBot) {
        this.bot = bot;
    }

    /**
     * Gets the location of either the neutral flag OR a team's flag on the ground.
     */
    getFlagLocation(): Vec3 {
        let flagLocation = this.bot.findBlock(this.FLAG_ITEM_NAME, {maxDistance: 100, partialMatch: true}).position;
        if (!flagLocation) {
            // @ts-ignore
            flagLocation = this.bot.findItemOnGround(this.FLAG_ITEM_NAME, {maxDistance: 100, partialMatch: true}).position;
        }
        return flagLocation;
    }

    async approachFlag(): Promise<boolean> {
        const flagLocation = this.getFlagLocation();
        // TODO: This should be a built-in function, as approachPosition
        const goal = new GoalNear(flagLocation.x, flagLocation.y, flagLocation.z, 0.1);
        return await this.bot.handlePath(async () => {
            // @ts-ignore
            await this.bot.mineflayer().pathfinder.goto(goal);
        });
    }



}
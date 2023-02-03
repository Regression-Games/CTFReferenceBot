import {Vec3} from "vec3";
import {RGBot} from "rg-bot";
const { GoalNear, GoalPlaceBlock, GoalLookAtBlock, GoalXZ, GoalInvert, GoalFollow } = require('mineflayer-pathfinder').goals


export default class RGCTFUtils {

    private bot: RGBot;

    public FLAG_ITEM_NAME = "white_banner";
    public BLUE_SCORE_LOCATION = new Vec3(160, 63, -385)
    public RED_SCORE_LOCATION = new Vec3(160, 63, -385);

    constructor(bot: RGBot) {
        this.bot = bot;
    }

    getMyTeam(): string {
        console.log(this.bot.matchInfo())
        return this.bot.matchInfo().players.filter(player => player.username == this.bot.username())[0].team;
    }

    /**
     * Gets the location of either the neutral flag OR a team's flag on the ground.
     */
    getFlagLocation(): Vec3 {
        let flagLocation = this.bot.findBlock(this.FLAG_ITEM_NAME, {maxDistance: 100, partialMatch: false}).position;
        if (!flagLocation) {
            // @ts-ignore
            flagLocation = this.bot.findItemOnGround(this.FLAG_ITEM_NAME, {maxDistance: 100, partialMatch: false}).position;
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

    async scoreFlag(): Promise<boolean> {
        const myTeam = this.getMyTeam();
        console.log(myTeam)
        const scoreLocation = myTeam == "BLUE" ? this.RED_SCORE_LOCATION : this.BLUE_SCORE_LOCATION;
        const goal = new GoalNear(scoreLocation.x, scoreLocation.y, scoreLocation.z, 0.1);
        return await this.bot.handlePath(async () => {
            // @ts-ignore
            await this.bot.mineflayer().pathfinder.goto(goal);
        });
    }

    hasFlag(): boolean {
        return this.bot.inventoryContainsItem('banner', {partialMatch: true})
    }

}
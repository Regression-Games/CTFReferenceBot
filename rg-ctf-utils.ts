import {Vec3} from "vec3";
import {RGBot} from "rg-bot";
const { GoalNear, GoalPlaceBlock, GoalLookAtBlock, GoalXZ, GoalInvert, GoalFollow } = require('mineflayer-pathfinder').goals


export default class RGCTFUtils {

    private bot: RGBot;

    public FLAG_ITEM_NAME = "white_banner";
    public FLAG_DROP_NAME = "banner";
    public BLUE_SCORE_LOCATION = new Vec3(160, 63, -385)
    public RED_SCORE_LOCATION = new Vec3(160, 63, -385);

    constructor(bot: RGBot) {
        this.bot = bot;
    }

    getMyTeam(): string {
        if (!this.bot.matchInfo()) return null
        return this.bot.matchInfo().players.filter(player => player.username == this.bot.username())[0].team;
    }

    getTeammateUsernames(includeMyself: boolean): string[] {
        if (!this.bot.matchInfo()) return null
        const myTeam = this.getMyTeam();
        return this.bot.matchInfo().players
            .filter(player => player.team == myTeam && (includeMyself || player.username != this.bot.username()))
            .map(player => player.username)
    }

    getEnemyUsernames(): string[] {
        if (!this.bot.matchInfo()) return null
        const myTeam = this.getMyTeam();
        return this.bot.matchInfo().players
            .filter(player => player.team != myTeam)
            .map(player => player.username)
    }

    /**
     * Gets the location of either the neutral flag OR a team's flag on the ground.
     */
    getFlagLocation(): Vec3 | null {
        let flag = this.bot.findBlock(this.FLAG_ITEM_NAME, {maxDistance: 100, partialMatch: false});
        if (!flag) {
            // @ts-ignore
            flag = this.bot.findItemOnGround(this.FLAG_DROP_NAME, {maxDistance: 100, partialMatch: false});
        }
        return flag ? flag.position : null;
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

    /**
     * Scores the flag in your team's base.
     */
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

    async wait(milliseconds: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }

}
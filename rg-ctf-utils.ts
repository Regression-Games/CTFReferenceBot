import {Vec3} from "vec3";
import {RGBot} from "rg-bot";
import {EventEmitter} from "events";
import {Entity} from "minecraft-data";
import {RGMatchInfo} from "rg-match-info";
const { GoalNear } = require('mineflayer-pathfinder').goals

/**
 * A collection of utilities for the Capture the Flag game mode
 * Includes location of points of interest, simplified functions
 * for gathering and scoring the flag, and utilities for finding
 * both teammates and enemies.
 */
export default class RGCTFUtils {

    private bot: RGBot;
    private eventEmitter: EventEmitter;

    public FLAG_ITEM_NAME = "white_banner";
    public FLAG_DROP_NAME = "banner";
    public BLUE_SCORE_LOCATION = new Vec3(160, 63, -385)
    public RED_SCORE_LOCATION = new Vec3(160, 63, -385);

    public CTF_EVENTS = ["flagObtained", "flagAvailable", "flagScored", "itemDetected", "itemCollected"];

    private lastMatchInfo: RGMatchInfo | null = null;

    constructor(bot: RGBot) {
        this.bot = bot;
        this.eventEmitter = new EventEmitter();

        // Emit CTF-specific events

        /**
         * When a player picks up an object, fire off a flagObtained event if they
         * picked up the banner, and then emit the itemCollected event with our more
         * simplified item object (vs an entity).
         */
        bot.on('playerCollect', (collector: Entity, collected: Entity) => {
            // @ts-ignore
            const item = bot.getItemDefinitionById(collected.metadata[8].itemId)
            if (item.name.includes(this.FLAG_DROP_NAME)) {
                this.eventEmitter.emit('flagObtained', collector, item);
            }
            this.eventEmitter.emit('itemCollected', collector, item);
        })

        /**
         * When an item is dropped, if it's the flag, emit the flagAvailable event.
         * Otherwise, simply emit that an item is detected.
         */
        bot.on("itemDrop", (entity: Entity) => {
            // @ts-ignore
            const itemId = entity.metadata[8]?.itemId;
            if (itemId) {
                const item = bot.getItemDefinitionById(itemId);
                if (item.name.includes(this.FLAG_DROP_NAME)) {
                    this.eventEmitter.emit('flagAvailable', item);
                }
                this.eventEmitter.emit('itemDetected', item);
            }
        });

        /**
         * When an item is spawned, if it's the flag, emit the flagAvailable event.
         * Otherwise, simply emit that an item is detected.
         */
        bot.on('entitySpawn', (entity: Entity) => {
            // @ts-ignore
            const itemId = entity.metadata[8]?.itemId;
            if (itemId) {
                const item = bot.getItemDefinitionById(itemId)
                if (item.name.includes(this.FLAG_DROP_NAME)) {
                    this.eventEmitter.emit('flagAvailable', item);
                }
                this.eventEmitter.emit('itemDetected', item);
            }
        });

        /**
         * When the score is updated, detect if the flag was scored via flag captures change
         */
        bot.on('score_update', (matchInfo: RGMatchInfo) => {
            matchInfo?.teams.forEach(team => {
                const newCaptures = team.metadata.flagCaptures;
                const oldCaptures = this.lastMatchInfo?.teams.find(t => t.name == team.name)?.metadata.flagCaptures ?? 0;
                if (newCaptures !== oldCaptures) {
                    this.eventEmitter.emit('flagScored', team.name);
                }
            });
        });

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
        const myTeam = this.bot.getMyTeam();
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

    /**
     * Registers a callback to listen for a particular CTF event. Possible events are:
     * Events:
     *   flagObtained
     *     Description: Triggered when a flag is obtained by a player. Provides the Entity that collected the flag, and
     *                  the flag itself
     *     Args: (collector: Entity, flag: Item)
     *
     * @param event The event (must be on of the events in CTF_EVENTS
     * @param func A callback with the appropriate
     */
    on(event: string, func: (...args: any[]) => void) {
        if (!this.CTF_EVENTS.includes(event)) {
            throw new Error(`Tried to register an event of "${event}", which is not included in the valid list of ${this.CTF_EVENTS}`)
        }
        this.eventEmitter.on(event, func);
    }

}
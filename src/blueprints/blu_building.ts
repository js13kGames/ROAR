import {float, integer} from "../../common/random.js";
import {Action} from "../actions.js";
import {collide} from "../components/com_collide.js";
import {lifespan} from "../components/com_lifespan.js";
import {trigger} from "../components/com_trigger.js";
import {BUILDING_LIFESPAN} from "../config.js";
import {Blueprint} from "../core.js";
import {Game, Layer} from "../game.js";
import {blueprint_block} from "./blu_block.js";
import {blueprint_star} from "./blu_star.js";

export function blueprint_building(game: Game): Blueprint {
    let height = Math.max(integer(0, 3), integer(0, 4));
    let blocks: Array<Blueprint> = [];

    if (float() > 0.2) {
        // Square tower.
        let variant = integer(1, 4);
        for (let y = 1; y <= height; y++) {
            blocks.push({
                ...blueprint_block(game, variant, y === height),
                Translation: [0, y - 0.5, 0],
            });
        }
    } else {
        // Star tower.
        for (let y = 1; y <= height; y++) {
            blocks.push({
                ...blueprint_star(game),
                Translation: [0, y - 0.5, 0],
            });
        }
    }

    return {
        Using: [
            collide(
                false,
                Layer.BuildingShell,
                Layer.BuildingBlock | Layer.PlayerHand | Layer.PlayerGrip | Layer.Missile,
                [1, height * 2, 1]
            ),
            lifespan(BUILDING_LIFESPAN),
            trigger(Action.Wake),
        ],
        Children: blocks,
    };
}
import {Action} from "../actions.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

export interface Lifespan {
    Remaining: number;
    Action?: Action;
}

export function lifespan(remaining: number, action?: Action) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Lifespan;
        game.World.Lifespan[entity] = {
            Remaining: remaining,
            Action: action,
        };
    };
}

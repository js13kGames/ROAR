import {Quat, Vec3} from "../common/math.js";
import {transform} from "./components/com_transform.js";
import {Entity, Game} from "./game.js";
import {Has, World} from "./world.js";

const MAX_ENTITIES = 10000;

let raf = 0;

export function loop_start(game: Game) {
    let last = performance.now();

    function tick(now: number, frame?: XRFrame) {
        let delta = (now - last) / 1000;
        last = now;

        if (frame) {
            game.XrFrame = frame;
            raf = game.XrFrame.session.requestAnimationFrame(tick);
        } else {
            game.XrFrame = undefined;
            raf = requestAnimationFrame(tick);
        }

        game.FrameUpdate(delta);
        game.FrameReset();
    }

    if (game.XrSession) {
        raf = game.XrSession.requestAnimationFrame(tick);
    } else {
        raf = requestAnimationFrame(tick);
    }
}

export function loop_stop(game: Game) {
    if (game.XrSession) {
        game.XrSession.cancelAnimationFrame(raf);
    } else {
        cancelAnimationFrame(raf);
    }
}

export function create(world: World, signature: number = 0) {
    for (let i = 0; i < MAX_ENTITIES; i++) {
        if (!world.Signature[i]) {
            world.Signature[i] = signature;
            return i;
        }
    }
    throw new Error("No more entities available.");
}

type Mixin = (game: Game, entity: Entity) => void;
export interface Blueprint {
    Translation?: Vec3;
    Rotation?: Quat;
    Scale?: Vec3;
    Using?: Array<Mixin>;
    Disable?: Has;
    Children?: Array<Blueprint>;
}

export function instantiate(
    game: Game,
    {Translation, Rotation, Scale, Using = [], Disable = 0, Children = []}: Blueprint
) {
    let entity = create(game.World);
    transform(Translation, Rotation, Scale)(game, entity);
    for (let mixin of Using) {
        mixin(game, entity);
    }
    if (Disable) {
        game.World.Signature[entity] &= ~Disable;
    }
    let entity_transform = game.World.Transform[entity];
    for (let subtree of Children) {
        let child = instantiate(game, subtree);
        let child_transform = game.World.Transform[child];
        child_transform.Parent = entity;
        entity_transform.Children.push(child);
    }
    return entity;
}

export function destroy(world: World, entity: Entity) {
    if (world.Signature[entity] & Has.Transform) {
        for (let child of world.Transform[entity].Children) {
            destroy(world, child);
        }
    }
    world.Signature[entity] = 0;
}

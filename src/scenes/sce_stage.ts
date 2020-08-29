import {from_euler} from "../../common/quat.js";
import {float, integer, set_seed} from "../../common/random.js";
import {blueprint_block} from "../blueprints/blu_block.js";
import {blueprint_camera} from "../blueprints/blu_camera.js";
import {blueprint_star} from "../blueprints/blu_star.js";
import {blueprint_viewer} from "../blueprints/blu_viewer.js";
import {collide} from "../components/com_collide.js";
import {light_directional, light_point} from "../components/com_light.js";
import {render_colored_diffuse} from "../components/com_render_colored_diffuse.js";
import {RigidKind, rigid_body} from "../components/com_rigid_body.js";
import {instantiate} from "../core.js";
import {Game, Layer} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.Camera = undefined;
    game.ViewportResized = true;
    game.Gl.clearColor(0.0, 0.1, 0.2, 1);

    set_seed(Date.now());

    // Camera.
    instantiate(game, {
        ...blueprint_camera(game),
        Translation: [0, 10, 10],
        Rotation: from_euler([0, 0, 0, 0], 30, 180, 0),
    });

    // VR Camera.
    instantiate(game, {
        ...blueprint_viewer(game),
        Translation: [0, 6, 0],
        Scale: [4, 4, 4],
    });

    // Main Light.
    instantiate(game, {
        Translation: [2, 4, 3],
        Using: [light_directional([1, 1, 1], 0.3)],
    });

    // Spot light.
    instantiate(game, {
        Translation: [0, 10, 0],
        Using: [light_point([1, 1, 1], 8)],
    });

    let grid_size = 10;

    // Ground.
    instantiate(game, {
        Scale: [grid_size, 1, grid_size],
        Using: [
            collide(false, Layer.Terrain, Layer.None),
            rigid_body(RigidKind.Static),
            render_colored_diffuse(game.MaterialDiffuseToon, game.MeshCube, [1, 1, 1, 1]),
        ],
    });

    for (let z = -grid_size / 2; z <= grid_size / 2; z++) {
        for (let x = -grid_size / 2; x <= grid_size / 2; x++) {
            if (x % 2 === 0 || z % 2 === 0) {
                continue;
            }
            let count = integer(1, 4);
            let c = float(0.2, 0.8);
            let b = Math.random() > 0.2 ? blueprint_block(game) : blueprint_star(game, c);
            for (let y = 0; y < count; y++) {
                instantiate(game, {
                    ...b,
                    Translation: [x, y + 1, z],
                });
            }
        }
    }
}

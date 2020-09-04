import {from_euler} from "../../common/quat.js";
import {control_move} from "../components/com_control_move.js";
import {cull} from "../components/com_cull.js";
import {light_point} from "../components/com_light.js";
import {move} from "../components/com_move.js";
import {render_colored_unlit} from "../components/com_render_colored_unlit.js";
import {Blueprint} from "../core.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export function blueprint_moon(game: Game): Blueprint {
    return {
        Using: [control_move(null, [0, 1, 0, 0]), move(0, 0.01)],
        Children: [
            {
                Translation: [0, 10, 10],
                Using: [light_point([1, 1, 1], 14)],
            },
            {
                Translation: [0, 100, 100],
                Rotation: from_euler([0, 0, 0, 0], -135, 0, 0),
                Scale: [20, 20, 20],
                Using: [
                    render_colored_unlit(game.MaterialColoredUnlit, game.MeshPlane, [1, 1, 1, 1]),
                    cull(Has.Render),
                ],
            },
        ],
    };
}

import {create, get_translation, invert, multiply, perspective} from "../../common/mat4.js";
import {Mat4} from "../../common/math.js";
import {CameraKind, CameraPerspective, CameraXr} from "../components/com_camera.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Camera;

export function sys_camera(game: Game, delta: number) {
    if (game.ViewportWidth != window.innerWidth || game.ViewportHeight != window.innerHeight) {
        game.ViewportWidth = game.Canvas.width = window.innerWidth;
        game.ViewportHeight = game.Canvas.height = window.innerHeight;
        game.ViewportResized = true;
    }

    game.Camera = undefined;
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            let camera = game.World.Camera[i];

            if (camera.Kind === CameraKind.Xr && game.XrFrame) {
                update_vr(game, i, camera);

                // Support only one camera per scene.
                return;
            }

            if (camera.Kind !== CameraKind.Xr && !game.XrFrame) {
                update_perspective(game, i, camera);

                // Support only one camera per scene.
                return;
            }
        }
    }
}

function update_perspective(game: Game, entity: Entity, camera: CameraPerspective) {
    let transform = game.World.Transform[entity];
    game.Camera = camera;

    if (game.ViewportResized) {
        let aspect = game.ViewportWidth / game.ViewportHeight;
        if (aspect > 1) {
            // Landscape orientation.
            perspective(camera.Projection, camera.FovY, aspect, camera.Near, camera.Far);
        } else {
            // Portrait orientation.
            perspective(camera.Projection, camera.FovY / aspect, aspect, camera.Near, camera.Far);
        }
    }

    camera.View = transform.Self.slice() as Mat4;
    multiply(camera.Pv, camera.Projection, transform.Self);
    get_translation(camera.Position, transform.World);
}

function update_vr(game: Game, entity: Entity, camera: CameraXr) {
    game.Camera = camera;

    let transform = game.World.Transform[entity];
    let pose = game.XrFrame!.getViewerPose(game.XrSpace);

    for (let viewpoint of pose.views) {
        if (!camera.Eyes[viewpoint.eye]) {
            camera.Eyes[viewpoint.eye] = {
                Viewpoint: viewpoint,
                View: create(),
                Pv: create(),
                Position: [0, 0, 0],
                FogDistance: camera.FogDistance,
            };
        }

        let eye = camera.Eyes[viewpoint.eye];
        eye.Viewpoint = viewpoint;

        // Compute the eye's world matrix.
        multiply(eye.View, transform.World, viewpoint.transform.matrix);
        get_translation(eye.Position, eye.View);

        // Compute the view matrix.
        invert(eye.View, eye.View);
        // Compute the PV matrix.
        multiply(eye.Pv, viewpoint.projectionMatrix, eye.View);
    }
}

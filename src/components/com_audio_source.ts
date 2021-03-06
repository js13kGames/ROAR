import {Instrument} from "../../common/audio.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

export interface AudioSource {
    Panner?: PannerNode;
    /** The next clip to play. */
    Trigger?: AudioClip;
    /** The clip which was triggered most recently. */
    Current?: AudioClip;
    /** The clip to play by default, in a loop. */
    Idle?: AudioClip;
    /** Elapsed time since the last clip change. */
    Time: number;
}

/**
 * Add the AudioSource component.
 *
 * @param idle The name of the clip to play by default, in a loop.
 */
export function audio_source(spatial: boolean, idle?: AudioClip) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.AudioSource;
        game.World.AudioSource[entity] = {
            Panner: spatial ? game.Audio.createPanner() : undefined,
            Idle: idle,
            Time: 0,
        };
    };
}

export interface AudioClip extends AudioTrack {
    /** How soon after starting this clip can we play another one (in seconds)? */
    Exit: number;
    Next?: () => AudioClip;
}

export interface AudioTrack {
    Instrument: Instrument;
    Note: number;
}

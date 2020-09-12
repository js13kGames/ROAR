import {RenderParticles} from "./com_render_particles.js";
import {RenderTexturedDiffuse} from "./com_render_textured_diffuse.js";

export type Render = RenderTexturedDiffuse | RenderParticles;

export const enum RenderKind {
    TexturedDiffuse,
    Particles,
}

export const enum RenderPhase {
    Opaque,
    Translucent,
}

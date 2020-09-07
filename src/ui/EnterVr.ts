import {html} from "../../common/html.js";
import {Action} from "../actions.js";
import {Game} from "../game.js";

export function EnterVr(game: Game) {
    return html`
        <div
            style="
                position: absolute;
                bottom: 10vmin;
                right: 10vmin;
                color: #fff;
                font: 24px Arial;
            "
        >
            ${game.XrFrame
                ? ExitButton()
                : window.isSecureContext
                ? navigator.xr
                    ? game.XrSupported
                        ? EnterButton()
                        : `<div style="padding: 1vmin">WebXR headset not found</div>`
                    : `<div style="padding: 1vmin">WebXR not supported</div>`
                : `<div style="padding: 1vmin">WebXR requires HTTPS</div>`}
        </div>
    `;
}

function EnterButton() {
    return html`
        <button
            onclick="$(${Action.EnterVr})"
            style="
                color: #fc0;
                background: transparent;
                border: none;
                font: 5rem Impact;
            "
        >
            Enter VR
        </button>
    `;
}

function ExitButton() {
    return html`
        <button
            onclick="$(${Action.ExitVr})"
            style="
                padding: 1vmin;
                background: #000;
                color: #fff;
                border: none;
            "
        >
            Exit VR
        </button>
    `;
}

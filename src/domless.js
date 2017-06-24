let domless = {};

domless.app = new Phaser.Game("100%", "100%", Phaser.AUTO, "body", null, true);

import * as states from "./states";
domless.states = states;

export default domless;

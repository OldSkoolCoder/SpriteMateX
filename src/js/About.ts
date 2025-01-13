import { dom } from "./helper";
export default class About {
  constructor(public window: number, public config, public eventhandler) {
    this.config = config;
    this.window = window;
    this.eventhandler = eventhandler;

    const template = `
    <div id="info">
        <img autofocus src="logo-menu.svg" width="300px" id="logo" alt="SpritemateX">
        <p>The <s>Commodore 64</s> Commander X16 sprite editor,
        v${this.config.version.toFixed(2)}</p>

        <fieldset>
            <h1>Release notes</h1>
            <h2>This is a clone of the source code for SpriteMate for the Commodore 64 (<a href="https://spritemate.com">spritemate.com</a>)</h2>

            <h1>V0.41</h1>
            <p>
            - Updated The NodeJS to Version 22 using the Vite Framework
            </p>

            <p>
            - Added the ability to animate a set of sprites.</br>
            - Organise the animated frames.</br>
            - Add / Remove Frames from animation set.</br>
            - and all the "Normal" windowy type functions, like Zoom and border.</br>
            </p>

            <h1>V0.39</h1>
            <p>
            - Added Ability To Increase Colour Depth</br>
            </p>

            <h1>V0.38</h1>
            <p>
            - Added Exporting of Binary Files</br>
            </p>

            <h1>V0.37</h1>
            <p>
            - Added Importing of Binary Files</br>
            </p>

            <h1>V0.35</h1>
            <p>
            - Added Sprite and Tile Layout to Assembly Export</br>
            </p>

            <h1>V0.34</h1>
            <p>
            - Added Project Types (Sprite / Tile)</br>
            - Added Export of Assets, Pallets or Both</br>
            </p>

            <h1>V0.33</h1>
            <p>
            - Fixed Duplication Sprite naming bug</br>
            - Removed the importing of SPD C64 Files</br>
            </p>

            <h1>V0.32</h1>
            <p>
            - Fixed Drawing Issue<br/>
            - Added XCI Export<br/>
            </p>

            <h1>V0.3</h1>
            <p>
            - Commented out remaining C64 specific code.<br/>
            - Added X16 stye pallet notation #FFF (#RedGreenBlue) single digits<br/>
            - Added Project Information to status bar<br/>
            </p>

            <h1>V0.2</h1>
            <p>
            - Added Commander X16 16 Colour Palettes.<br/>
            - Added size specification on New<br/>
            - Added Colour Depth on New<br/>
            - Removed Multi Colour Toggles<br/>
            - Invert function only for colour depths 2 and 4<br/>
            - Removed Double Height and Double Width<br/>
            </p>

            <h1>V0.1</h1>
            <p>
            - Added the ability to individually assign pixels a colour from the palette.<br/>
            - Added specifying the asset size when using "New".<br/>
            - Added export to Kick and ACME with the new format.<br/>
            - created a new file standard called *.spmx.<br/>
            </p>

        </fieldset>

        <button id="button-info">Let's go!</button>
    </div>
    `;

    dom.append("#window-" + this.window, template);

    $("#window-" + this.window).dialog({ show: "fade", hide: "fade" });
    dom.sel("#button-info").onclick = () => {
      $("#window-" + this.window).dialog("close");
      this.eventhandler.onLoad(); // calls "regain_keyboard_controls" method in app.js
    };
  }
}

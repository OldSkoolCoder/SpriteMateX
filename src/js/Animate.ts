import { dom } from "./helper";
import Window_Controls from "./Window_Controls";

export default class Animate extends Window_Controls {
  canvas_element: any = {};
  canvas: any = {};
  animationFrames: any = []

  constructor(public window: number, public config) {
    super();
    this.config = config;
    this.window = window;
    this.canvas_element = document.createElement("canvas");
    this.zoom = this.config.window_animate.zoom; // this.config.zoom;
    this.zoom_min = 4;
    this.zoom_max = 16;
    this.pixels_x = this.config.sprite_x;
    this.pixels_y = this.config.sprite_y;
    this.width = this.pixels_x * this.zoom;
    this.height = this.pixels_y * this.zoom;
    this.animationFrames = []

    this.canvas_element.id = "animate";
    this.canvas_element.width = this.width;
    this.canvas_element.height = this.height;
    this.canvas = this.canvas_element.getContext("2d");

    // this.canvas_element.addEventListener("myAnimStart",() => {console.log("AnimStarted")})
    // this.canvas_element.addEventListener("myAnimStop",() => {console.log("AnimStopped")})

    const template = `
      <div class="window_menu">
        <img src="ui/icon-zoom-plus.png" class="icon-hover" id="icon-animate-zoom-in" title="zoom in">
        <img src="ui/icon-zoom-minus.png" class="icon-hover" id="icon-animate-zoom-out" title="zoom out">
      </div>
      <div id="animate-canvas"></div>
    `;

    dom.append("#window-" + this.window, template);
    dom.append_element("#animate-canvas", this.canvas_element);
  }

  set_animationFrames(animationFrames)
  {
    //console.log(animationFrames)
    this.animationFrames = animationFrames
  }

  update(all_data) 
  {
    if (all_data.current_animated_frame != -1 && all_data.current_animated_frame < this.animationFrames.length)
    {
        this.canvas_element.width = this.width;
        this.canvas_element.height = this.height;
        let animatedSpriteID = this.animationFrames[all_data.current_animated_frame][1];
        const sprite_data = all_data.sprites[animatedSpriteID];
        //const sprite_data = all_data.sprites[all_data.current_sprite];
        let x_grid_step = 1;
        // if (sprite_data.multicolor) x_grid_step = 2;
    
        // first fill the whole sprite with the background color
        this.canvas.fillStyle = this.config.colors[all_data.colors[0]];
        this.canvas.fillRect(0, 0, this.width, this.height);
    
        for (let i = 0; i < this.pixels_x; i = i + x_grid_step) {
          for (let j = 0; j < this.pixels_y; j++) {
            const array_entry = sprite_data.pixels[j][i];
    
            if (array_entry != 0) {
              // transparent
              //let color = sprite_data.color;
              let color = all_data.colors[array_entry]; //sprite_data.color;
            //   if (array_entry != 1 && sprite_data.multicolor)
            //     color = all_data.colors[array_entry];
              this.canvas.fillStyle = this.config.colors[color];
              this.canvas.fillRect(
                i * this.zoom,
                j * this.zoom,
                x_grid_step * this.zoom,
                this.zoom
              );
            }
          }
      }
    }
    else
    {
        this.canvas_element.width = this.width;
        this.canvas_element.height = this.height;
        this.canvas.fillStyle = this.config.colors[all_data.colors[0]];
        this.canvas.fillRect(0, 0, this.width, this.height);
    }

    // set the preview window x and y stretch
    dom.css("#animate", "width", this.width + "px");
    dom.css("#animate", "height", this.height + "px");
  }

  resize_editor(sprite_x, sprite_y)
  {
    this.pixels_x = sprite_x;
    this.pixels_y = sprite_y;
    this.width = this.pixels_x * this.zoom;
    this.height = this.pixels_y * this.zoom;
    this.canvas_element.width = this.width;
    this.canvas_element.height = this.height;
  }

}

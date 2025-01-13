import { dom } from "./helper";
import Window_Controls from "./Window_Controls";

export default class AnimateList extends Window_Controls {
  clicked_sprite: number;
  sorted_array: any = [];
  grid: boolean;
  animationFrames: any = [];


  constructor(public window: number, public config) {
    super();
    this.config = config;
    this.window = window;
    this.zoom = this.config.window_animate_list.zoom;
    this.zoom_min = 4;
    this.zoom_max = 16;
    this.pixels_x = this.config.sprite_x;
    this.pixels_y = this.config.sprite_y;
    this.width = this.pixels_x * this.zoom;
    this.height = this.pixels_y * this.zoom;
    this.clicked_sprite = 0;
    this.sorted_array = [];
    this.grid = true;
    this.animationFrames = [];

    const template = `
      <div class="window_menu">
      <div class="icons-zoom-area">
          <img src="ui/icon-zoom-plus.png" class="icon-hover" id="icon-animatelist-zoom-in" title="zoom in">
          <img src="ui/icon-zoom-minus.png" class="icon-hover" id="icon-animatelist-zoom-out" title="zoom out">
          <img src="ui/icon-grid.png" class="icon-hover" id="icon-animatelist-grid" title="toggle sprite borders">
      </div>
        <img src="ui/icon-list-trash.png" class="icon-right icon-hover" id="icon-animatelist-delete" title="remove sprite">
      </div>
      <div id="animatelist"></div>
    `;

    dom.append("#window-" + this.window, template);

    $("#animatelist").sortable({
      cursor: "move",
      tolerance: "pointer",
      revert: "100",
    });

    // TODO: needs to go away with new/better sorting and zooming
    // this line is ridiculous, but apparently it is needed for the sprite sorting to not screw up
    document.head.insertAdjacentHTML(
      "beforeend",
      `<style id="zoom-sort-fix" type='text/css'>.list-animate-size{ width: ${this.width}px; height:${this.height}px;} </style>`
    );

    // TODO:
    //$-old-("#spritelist").disableSelection(); // can't see the reason for this
  }

  get_clicked_sprite() {
    if (this.get_animation_list_length() == 0)
    {
        return -1
    }
    else
    {
        return this.clicked_sprite;
    }
  }

  toggle_grid() {
    this.grid = !this.grid;
  }

  update_zoom() {
    this.width = this.pixels_x * this.zoom;
    this.height = this.pixels_y * this.zoom;

    // TODO: needs to go away with new/better sorting and zooming
    const boo = document.getElementById("zoom-sort-fix") as any;
    boo.parentNode.removeChild(boo);
    document.head.insertAdjacentHTML(
      "beforeend",
      `<style id="zoom-sort-fix" type='text/css'>.list-animate-size{ width: ${this.width}px; height:${this.height}px;} </style>`
    );
  }

  update(all_data) {
    // this one gets called during drawing in the editor
    // because the normal update method gets too slow
    // when the sprite list is becoming longer

    $("#window-" + this.window).dialog(
      "option",
      "title",
      `sprite ${all_data.current_sprite + 1} of ${all_data.sprites.length}`
    );
    const c: any = document.getElementById(all_data.current_sprite);
    const canvas = c.getContext("2d", { alpha: false });
    const sprite_data = all_data.sprites[all_data.current_sprite];
    this.draw_sprite(canvas, sprite_data, all_data);
  }

  update_all(all_data) {
    const length = all_data.sprites.length;
    this.animationFrames = [];
    for (let i = 0; i < length; i++)
    {
        if (all_data.sprites[i].animationframe.length > 0)
        {
            for (let j = 0; j<all_data.sprites[i].animationframe.length; j++)
            {
                let animationSprite = [] as any
                animationSprite.push(all_data.sprites[i].animationframe[j])
                animationSprite.push(i)                
                this.animationFrames.push(animationSprite);
            }
        }
    }
    this.animationFrames.sort()

    dom.remove_all_elements(".animation_in_list");
    for (let i = 0; i < this.animationFrames.length; i++) {
      const canvas_element: any = document.createElement("canvas");
      let animationFrameID = this.animationFrames[i][0]
      let spriteID = this.animationFrames[i][1]
      canvas_element.id = "AS-" + i;
      canvas_element.width = this.width;
      canvas_element.height = this.height;

      dom.append_element("#animatelist", canvas_element);
      dom.add_class(canvas_element, "animation_in_list");

      canvas_element.setAttribute("title", all_data.sprites[spriteID].name);
      dom.add_class(canvas_element, "list-animate-size"); // see comment in constructor

      if (this.grid) dom.add_class(canvas_element, "animation_in_list_border");

      canvas_element.addEventListener("click", () => 
        {
            this.clicked_sprite = i;
            //canvas_element.classList.toggle("animation_in_list_selected");
        });

      const canvas = canvas_element.getContext("2d", { alpha: false });
      const sprite_data = all_data.sprites[spriteID];

      this.draw_sprite(canvas, sprite_data, all_data);
    }

    // if (animationFrames.length > 0)
    // {
    //     dom.sel("#animatelist").dispatchEvent(AnimStart);
    // }
    // else
    // {
    //     dom.sel("#animatelist").dispatchEvent(AnimStop);
    // }
  }

  get_animation_list_length()
  {
    let animate_list_len: any;
    try 
    {
        animate_list_len = dom.sel("#animatelist").children.length;
        if (animate_list_len == undefined)
        {
            animate_list_len = 0;
        }
    }
    catch(err) {
        animate_list_len = 0;
    }
    return animate_list_len;
  }

  draw_sprite(canvas, sprite_data, all_data) {
    let x_grid_step = 1;
    // if (sprite_data.multicolor) x_grid_step = 2;

    // first fill the whole sprite with the background color
    canvas.fillStyle = this.config.colors[all_data.colors[0]]; // transparent
    canvas.fillRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.pixels_x; i = i + x_grid_step) {
      for (let j = 0; j < this.pixels_y; j++) {
        const array_entry = sprite_data.pixels[j][i];

        if (array_entry != 0) {
          // transparent
          //let color = sprite_data.color;
          let color = all_data.colors[array_entry]; //sprite_data.color;
        //   if (array_entry != 1 && sprite_data.multicolor)
        //     color = all_data.colors[array_entry];
          canvas.fillStyle = this.config.colors[color];
          canvas.fillRect(
            i * this.zoom,
            j * this.zoom,
            x_grid_step * this.zoom,
            this.zoom
          );
        }
      }
    }
  }

  resize_editor(sprite_x, sprite_y)
  {
    this.pixels_x = sprite_x;
    this.pixels_y = sprite_y;
    this.width = this.pixels_x * this.zoom;
    this.height = this.pixels_y * this.zoom;

    this.update_zoom();
  }

} // end class

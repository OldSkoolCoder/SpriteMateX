// ASCII text: http://patorjk.com/software/taag/#p=display&h=2&f=Doh&t=TOOLS

/*
  To switch to photoshop style layers:
  - load "List_layerstyle.js" instead of "List.js" in index.html
  - comment & uncomment 2 lines of code in update_ui in this file
*/

import List from "./List";
import About from "./About";
import Tools from "./Tools";
import Load from "./Load";
import Save from "./Save";
import Settings from "./Settings";
import Editor from "./Editor";
import Palette from "./Palette";
import Preview from "./Preview";
import Animate from "./Animate";
import AnimateList from "./AnimateList";
import Sprite from "./Sprite";
import Storage from "./Storage";
import Window from "./Window";
import { get_config } from "./config";
import { dom, tipoftheday, status, toggle_fullscreen } from "./helper";

class App {
  storage: any = {};
  sprite: any = {};
  editor: any;
  window_editor: any;
  window_palette: any;
  palette: any;
  window_preview: any;
  preview: any;
  window_animate:any;
  animate: any;
  window_list: any;
  list: any;
  window_animate_list: any;
  animatelist: any;
  window_about: any;
  about: any;
  window_save: any;
  save: any;
  window_settings: any;
  settings: any;
  window_tools: any;
  window_help: any;
  tools: any;
  load: any;
  is_drawing: boolean;
  oldpos: any;
  mode: any;
  allow_keyboard_shortcuts: boolean;
  move_start: any;
  move_start_pos: any;
  dragging: any;

//   AnimStart: Event;
//   AnimStop: Event;

  constructor(public config) {
    this.storage = new Storage(config);
    this.config = this.storage.get_config();
    this.config.colors = this.config.palettes[this.config.selected_palette];

    // this.AnimStart = new Event("myAnimStart");
    // this.AnimStop = new Event("myAnimStop");

    this.sprite = new Sprite(this.config);
    dom.val("#ProjectType", this.config.type);

    // editor
    const editor_config = {
      name: "window_editor",
      title: "Editor",
      type: "sprite",
      resizable: false,
      left: this.config.window_editor.left,
      top: this.config.window_editor.top,
      width: "auto",
      height: "auto",
      window_id: 0,
    };
    this.window_editor = new Window(
      editor_config,
      this.store_window.bind(this)
    );
    this.editor = new Editor(editor_config.window_id, this.config);

    // palette
    const palette_config = {
      name: "window_palette",
      title: "Colors",
      type: "colors",
      resizable: false,
      left: this.config.window_palette.left,
      top: this.config.window_palette.top,
      width: "auto",
      height: "auto",
      window_id: 1,
    };
    this.window_palette = new Window(
      palette_config,
      this.store_window.bind(this)
    );
    this.palette = new Palette(palette_config.window_id, this.config);

    // preview
    const preview_config = {
      name: "window_preview",
      title: "Preview",
      type: "preview",
      resizable: false,
      left: this.config.window_preview.left,
      top: this.config.window_preview.top,
      width: "auto",
      height: "auto",
      window_id: 2,
    };
    this.window_preview = new Window(
      preview_config,
      this.store_window.bind(this)
    );
    this.preview = new Preview(preview_config.window_id, this.config);

    // sprite list
    const list_config = {
      name: "window_list",
      title: "Sprite List",
      type: "list",
      resizable: true,
      left: this.config.window_list.left,
      top: this.config.window_list.top,
      width: this.config.window_list.width,
      height: this.config.window_list.height,
      window_id: 3,
    };
    this.window_list = new Window(list_config, this.store_window.bind(this));
    this.list = new List(list_config.window_id, this.config);

    // about
    const about_config = {
      name: "window_about",
      title: "SpritemateX",
      type: "info",
      escape: true,
      modal: true,
      resizable: false,
      autoOpen: false,
      width: "680",
      height: "auto",
      window_id: 4,
    };
    this.window_about = new Window(about_config);
    this.about = new About(about_config.window_id, this.config, {
      onLoad: this.regain_keyboard_controls.bind(this),
    });

    // save
    const save_config = {
      name: "window_save",
      title: "Save",
      type: "file",
      escape: true,
      modal: true,
      resizable: false,
      autoOpen: false,
      width: "580",
      height: "auto",
      window_id: 5,
    };
    this.window_save = new Window(save_config);
    this.save = new Save(save_config.window_id, this.config, {
      onLoad: this.regain_keyboard_controls.bind(this),
    });

    // settings
    const settings_config = {
      name: "window_settings,",
      title: "Settings",
      type: "settings",
      modal: true,
      escape: true,
      resizable: false,
      autoOpen: false,
      width: "760",
      height: "auto",
      window_id: 6,
    };
    this.window_settings = new Window(settings_config);
    this.settings = new Settings(settings_config.window_id, this.config, {
      onLoad: this.update_config.bind(this),
    });

    // tools
    const tools_config = {
      name: "window_tools",
      title: "Tools",
      type: "tools",
      resizable: false,
      left: this.config.window_tools.left,
      top: this.config.window_tools.top,
      width: "auto",
      height: "auto",
      window_id: 8,
    };
    this.window_tools = new Window(tools_config, this.store_window.bind(this));
    this.tools = new Tools(tools_config.window_id, this.config);

    // animate
    const animate_config = {
        name: "window_animate",
        title: "Animate",
        type: "animate",
        resizable: false,
        left: this.config.window_animate.left,
        top: this.config.window_animate.top,
        width: "auto",
        height: "auto",
        window_id: 9,
      };
      this.window_animate = new Window(
        animate_config,
        this.store_window.bind(this)
      );
      this.animate = new Animate(animate_config.window_id, this.config);

          // animate list
    const animatelist_config = {
        name: "window_animate_list",
        title: "Animate List",
        type: "animatelist",
        resizable: true,
        left: this.config.window_animate_list.left,
        top: this.config.window_animate_list.top,
        width: this.config.window_animate_list.width,
        height: this.config.window_animate_list.height,
        window_id: 10,
      };
      this.window_animate_list = new Window(animatelist_config, this.store_window.bind(this));
      this.animatelist = new AnimateList(animatelist_config.window_id, this.config);
  
  
    this.load = new Load(this.config, {
      onLoad: this.update_loaded_file.bind(this),
    });

    this.is_drawing = false;
    this.oldpos = { x: 0, y: 0 }; // used when drawing and moving the mouse in editor
    this.sprite.new_sprite();

    this.mode = "draw"; // modes can be "draw" and "fill"
    this.allow_keyboard_shortcuts = true;

    this.displayProjectInfo();
    tipoftheday();

    this.list.update_all(this.sprite.get_all());
    this.animatelist.update_all(this.sprite.get_all());
    this.update();
    this.user_interaction();

    if (this.storage.is_updated_version())
      $(this.window_about.get_window_id()).dialog("open");

    this.animateSprites();
  }

  animateSprites()
  {
    const all = this.sprite.get_all();

    if (this.animatelist.get_animation_list_length() == 0)
    {
        setTimeout(() => 
        {
            this.animate.update(all);
            this.animateSprites();
        }, 3000);
    }
    else
    {
        if (this.sprite.all.current_animated_frame >= this.animatelist.get_animation_list_length())
        {
            this.sprite.all.current_animated_frame = 0;
        }
        setTimeout(() => 
        {
            this.animate.update(this.sprite.all);
            this.sprite.all.current_animated_frame += 1;
    
            setTimeout(() => {
                this.animateSprites();
            }, 250);
        }, 250)    
    }
  }
  

  displayProjectInfo()
  {
    const projInfo = this.config.type + " Size : " + this.config.sprite_x + " by " + this.config.sprite_y + ", with colour depth of : " + this.config.colour_depth;
    dom.html("#projectinfo", projInfo);
  }

  update() {
    const all = this.sprite.get_all();
    this.editor.update(all);
    this.preview.update(all);
    this.list.update(all);
    this.animatelist.update_all(all);
    this.animate.set_animationFrames(this.animatelist.animationFrames)
    this.palette.update(all);
    this.update_ui();
  }

  update_ui() {
    if (this.sprite.get_number_of_sprites() > 1) {
      dom.fade("#icon-list-delete", 0.33, 1);
    } else {
      dom.fade("#icon-list-delete", 1, 0.33);
    }

    if (this.sprite.is_copy_empty()) {
      dom.fade("#icon-list-paste", 1, 0.33);
    } else {
      dom.fade("#icon-list-paste", 0.33, 1);
    }

    if (this.sprite.can_undo()) {
      dom.fade("#icon-undo", 0.33, 1);
    } else {
      dom.fade("#icon-undo", 1, 0.33);
    }

    if (this.sprite.can_redo()) {
      dom.fade("#icon-redo", 0.33, 1);
    } else {
      dom.fade("#icon-redo", 1, 0.33);
    }

    if (this.sprite.is_overlay()) {
      dom.attr(
        "#icon-preview-overlay",
        "src",
        "ui/icon-preview-overlay-hi.png"
      );
    } else {
      dom.attr(
        "#icon-preview-overlay",
        "src",
        "ui/icon-preview-overlay.png"
      );
    }

    if (this.preview.is_min_zoom()) {
      dom.fade("#icon-preview-zoom-out", 1, 0.33);
    } else {
      dom.fade("#icon-preview-zoom-out", 0.33, 1);
    }

    if (this.preview.is_max_zoom()) {
      dom.fade("#icon-preview-zoom-in", 1, 0.33);
    } else {
      dom.fade("#icon-preview-zoom-in", 0.33, 1);
    }

    if (this.animate.is_min_zoom()) {
        dom.fade("#icon-animate-zoom-out", 1, 0.33);
      } else {
        dom.fade("#icon-animate-zoom-out", 0.33, 1);
      }
  
      if (this.animate.is_max_zoom()) {
        dom.fade("#icon-animate-zoom-in", 1, 0.33);
      } else {
        dom.fade("#icon-animate-zoom-in", 0.33, 1);
      }
  
      if (this.editor.is_min_zoom()) {
      dom.fade("#icon-editor-zoom-out", 1, 0.33);
    } else {
      dom.fade("#icon-editor-zoom-out", 0.33, 1);
    }

    if (this.editor.is_max_zoom()) {
      dom.fade("#icon-editor-zoom-in", 1, 0.33);
    } else {
      dom.fade("#icon-editor-zoom-in", 0.33, 1);
    }

    if (this.list.is_min_zoom()) {
      dom.fade("#icon-list-zoom-out", 1, 0.33);
    } else {
      dom.fade("#icon-list-zoom-out", 0.33, 1);
    }

    if (this.list.is_max_zoom()) {
      dom.fade("#icon-list-zoom-in", 1, 0.33);
    } else {
      dom.fade("#icon-list-zoom-in", 0.33, 1);
    }

    // photoshop style layer
    //$-old-('.sprite_layer').removeClass("sprite_layer_selected");
    //$-old-('#spritelist').find('#'+this.sprite.get_current_sprite_number()).addClass("sprite_layer_selected");

    // spritepad style layer
    dom.remove_all_class(".sprite_in_list", "sprite_in_list_selected");
    document
      .getElementById(this.sprite.get_current_sprite_number())
      ?.classList.add("sprite_in_list_selected");

    dom.remove_all_class(".animation_in_list", "animation_in_list_selected");
    document
        .getElementById("AS-" + this.animatelist.clicked_sprite)
        ?.classList.add("animation_in_list_selected");

    if (this.animatelist.get_clicked_sprite() != -1) {
        dom.fade("#icon-animatelist-delete", 0.33, 1);
        } else {
        dom.fade("#icon-animatelist-delete", 1, 0.33);
        }
      
    }

  /** 
  check which data is in the object, compare with config data of that window
  and replace the data in the config if matching
  then save to storage 
  */
  store_window(obj) {
    for (const key in obj.data) {
      // eslint-disable-next-line no-prototype-builtins
      if (this.config[obj.name].hasOwnProperty(key))
        this.config[obj.name][key] = obj.data[key];
    }
    this.storage.write(this.config);
  }

  update_config() {
    // this gets called after the settings modal has been closed
    this.palette.set_colors(this.config.colors, this.config.colour_depth);
    this.storage.write(this.config);
    this.list.update_all(this.sprite.get_all());
    this.animatelist.update_all(this.sprite.get_all())
    this.animate.set_animationFrames(this.animatelist.animationFrames)
    this.update();
    this.regain_keyboard_controls();
    status("Configuration updated.");
  }
 
  update_loaded_file() {
    // called as a callback event from the load class
    // after a file got loaded in completely
    this.sprite.set_all(this.load.get_imported_file());
    this.config.colors = this.load.get_imported_file().palette;
    this.config.colour_depth = this.load.get_imported_file().colour_depth;
    this.config.sprite_x = this.load.get_imported_file().sprite_x;
    this.config.sprite_y = this.load.get_imported_file().sprite_y;
    this.sprite.width = this.config.sprite_x;
    this.sprite.height = this.config.sprite_y;
    this.sprite.colour_depth = this.config.colour_depth;
    this.palette.set_colors(this.config.colors, this.config.colour_depth);

    for (let i=0;i<this.config.colors.length;i++)
    {
        this.config.palettes.custom[i] = this.config.colors[i];
    }
    this.settings.update_colors();
    this.palette.draw_palette();
    this.resizeAndUpdateDialogs();
    this.update_config();
    this.displayProjectInfo();
  }

  resizeAndUpdateDialogs()
  {
    this.editor.resize_editor(this.config.sprite_x, this.config.sprite_y)
    this.editor.update(this.sprite.get_all());
    this.preview.resize_editor(this.config.sprite_x, this.config.sprite_y)
    this.preview.update(this.sprite.get_all());
    this.list.resize_editor(this.config.sprite_x, this.config.sprite_y)
    this.list.update_all(this.sprite.get_all());
    this.animatelist.resize_editor(this.config.sprite_x, this.config.sprite_y)
    this.animatelist.update_all(this.sprite.get_all());
    this.animate.resize_editor(this.config.sprite_x, this.config.sprite_y)
    this.animate.set_animationFrames(this.animatelist.animationFrames)
    this.update();
  }
  
  regain_keyboard_controls() {
    // this will be called whenever keyboard controls have been deactivated, e.g. for input fields
    // currently used as callback after the save dialog
    this.allow_keyboard_shortcuts = true;
  }

  update_sprite_name() {
    // checks the sprite name input box for the name
    // and updates the sprite name
    this.allow_keyboard_shortcuts = true;
    let sprite_name: string = dom.val("#input-sprite-name");
    sprite_name = sprite_name.replace(/[^A-Za-z0-9-_]+/g, ""); // allowed chars are characters, number, -, _
    this.sprite.set_sprite_name(sprite_name);
    this.list.update_all(this.sprite.get_all());
    this.animatelist.update_all(this.sprite.get_all());
    this.update();
  }

  checkXWidth()
  {
    if(dom.val("#XWidth") >= 32)
    {
        // if asset is 32 pixels or more, remove colour depth options 1 and 2 bit
        dom.sel("#colDepth").options[0].style.display='none';
        dom.sel("#colDepth").options[1].style.display='none';
        if(dom.val("#colDepth") <= 4)
        {
            // Anything 16 pixels or bigger cannot be less then 4 bit colour, so set to 4 bit colour
            dom.val("#colDepth", 16);
        }
    }
    else
    {
        // if asset is 32 pixels or less, add colour depth options 1 and 2 bit
        dom.sel("#colDepth").options[0].style.display='block';
        dom.sel("#colDepth").options[1].style.display='block';
    }
  }

  checkColDepth()
  {
    dom.sel("#menubar-invert").style.display="none";

    if(dom.val("#colDepth") == 2 || dom.val("#colDepth") == 4)
    {
        //console.log("block");
        dom.sel("#menubar-invert").style.display="block";
    }
  }

  user_interaction() {
    /*

KKKKKKKKK    KKKKKKK   EEEEEEEEEEEEEEEEEEEEEE   YYYYYYY       YYYYYYY      SSSSSSSSSSSSSSS 
K:::::::K    K:::::K   E::::::::::::::::::::E   Y:::::Y       Y:::::Y    SS:::::::::::::::S
K:::::::K    K:::::K   E::::::::::::::::::::E   Y:::::Y       Y:::::Y   S:::::SSSSSS::::::S
K:::::::K   K::::::K   EE::::::EEEEEEEEE::::E   Y::::::Y     Y::::::Y   S:::::S     SSSSSSS
KK::::::K  K:::::KKK     E:::::E       EEEEEE   YYY:::::Y   Y:::::YYY   S:::::S            
  K:::::K K:::::K        E:::::E                   Y:::::Y Y:::::Y      S:::::S            
  K::::::K:::::K         E::::::EEEEEEEEEE          Y:::::Y:::::Y        S::::SSSS         
  K:::::::::::K          E:::::::::::::::E           Y:::::::::Y          SS::::::SSSSS    
  K:::::::::::K          E:::::::::::::::E            Y:::::::Y             SSS::::::::SS  
  K::::::K:::::K         E::::::EEEEEEEEEE             Y:::::Y                 SSSSSS::::S 
  K:::::K K:::::K        E:::::E                       Y:::::Y                      S:::::S
KK::::::K  K:::::KKK     E:::::E       EEEEEE          Y:::::Y                      S:::::S
K:::::::K   K::::::K   EE::::::EEEEEEEE:::::E          Y:::::Y          SSSSSSS     S:::::S
K:::::::K    K:::::K   E::::::::::::::::::::E       YYYY:::::YYYY       S::::::SSSSSS:::::S
K:::::::K    K:::::K   E::::::::::::::::::::E       Y:::::::::::Y       S:::::::::::::::SS 
KKKKKKKKK    KKKKKKK   EEEEEEEEEEEEEEEEEEEEEE       YYYYYYYYYYYYY        SSSSSSSSSSSSSSS  

*/

    document.addEventListener("keydown", (e) => {
      //console.log(e.key);
      if (this.allow_keyboard_shortcuts) {
        if (e.key == "a") {
          console.time("performance");
          for (let i = 0; i <= 1000; i++) this.update();
          console.timeEnd("performance");
        }

        if (e.key == "ArrowRight") {
          this.sprite.set_current_sprite("right");
          this.update();
        }
        if (e.key == "ArrowLeft") {
          this.sprite.set_current_sprite("left");
          this.update();
        }

        if (e.key == "F") {
          toggle_fullscreen();
        }

        /*
        if (e.key == "q")
        {
          this.sprite.set_all(example_sprite);
          // example sprite is defined in the config.js
          this.list.update_all(this.sprite.get_all());
          this.update();
        }
        */

        if (e.key == "m") {
          this.mode = "move";
          status("Move mode");
          dom.attr("#image-icon-move", "src", "ui/icon-move-hi.png");
          dom.attr("#image-icon-draw", "src", "ui/icon-draw.png");
          dom.attr("#image-icon-erase", "src", "ui/icon-erase.png");
          dom.attr("#image-icon-fill", "src", "ui/icon-fill.png");
        }

        if (e.key == "d") {
          this.mode = "draw";
          status("Draw mode");
          dom.attr("#image-icon-move", "src", "ui/icon-move.png");
          dom.attr("#image-icon-draw", "src", "ui/icon-draw-hi.png");
          dom.attr("#image-icon-erase", "src", "ui/icon-erase.png");
          dom.attr("#image-icon-fill", "src", "ui/icon-fill.png");
        }

        if (e.key == "e") {
          this.mode = "erase";
          status("Erase mode");
          dom.attr("#image-icon-move", "src", "ui/icon-move.png");
          dom.attr("#image-icon-draw", "src", "ui/icon-draw.png");
          dom.attr("#image-icon-erase", "src", "ui/icon-erase-hi.png");
          dom.attr("#image-icon-fill", "src", "ui/icon-fill.png");
        }

        if (e.key == "f") {
          this.mode = "fill";
          status("Fill mode");
          dom.attr("#image-icon-move", "src", "ui/icon-move.png");
          dom.attr("#image-icon-draw", "src", "ui/icon-draw.png");
          dom.attr("#image-icon-erase", "src", "ui/icon-erase.png");
          dom.attr("#image-icon-fill", "src", "ui/icon-fill-hi.png");
        }

        if (e.key == "1") {
          this.sprite.set_pen(0);
          this.update();
        }

        if (e.key == "2") {
          this.sprite.set_pen(1);
          this.update();
        }

        if (e.key == "z") {
          this.sprite.undo();
          this.update();
        }

        if (e.key == "Z") {
          this.sprite.redo();
          this.update();
        }

        if (e.key == "N") {
          this.sprite.new_sprite();
          this.list.update_all(this.sprite.get_all());
          this.update();
          status("New sprite.");
        }

        if (e.key == "C") {
          this.sprite.copy();
          this.update_ui();
          status("Sprite copied.");
        }

        if (e.key == "V") {
          if (!this.sprite.is_copy_empty()) {
            this.sprite.paste();
            this.update();
            status("Sprite pasted.");
          } else {
            status("Nothing to copy.", "error");
          }
        }

        if (e.key == "D") {
          this.sprite.duplicate();
          this.list.update_all(this.sprite.get_all());
          this.update_ui();
          status("Sprite duplicated.");
        }

        if (e.key == "X") {
          this.sprite.delete();
          this.list.update_all(this.sprite.get_all());
          this.update();
        }

        if (e.key == "i") {
          this.sprite.invert();
          this.update();
        }
      }
    });

    /*

MMMMMMMM               MMMMMMMMEEEEEEEEEEEEEEEEEEEEEENNNNNNNN        NNNNNNNNUUUUUUUU     UUUUUUU  
M:::::::M             M:::::::ME::::::::::::::::::::EN:::::::N       N::::::NU::::::U     U:::::U 
M::::::::M           M::::::::ME::::::::::::::::::::EN::::::::N      N::::::NU::::::U     U:::::U
M:::::::::M         M:::::::::MEE::::::EEEEEEEEE::::EN:::::::::N     N::::::NUU:::::U     U:::::U
M::::::::::M       M::::::::::M  E:::::E       EEEEEEN::::::::::N    N::::::N U:::::U     U:::::U  
M:::::::::::M     M:::::::::::M  E:::::E             N:::::::::::N   N::::::N U:::::D     D:::::U
M:::::::M::::M   M::::M:::::::M  E::::::EEEEEEEEEE   N:::::::N::::N  N::::::N U:::::D     D:::::U
M::::::M M::::M M::::M M::::::M  E:::::::::::::::E   N::::::N N::::N N::::::N U:::::D     D:::::U
M::::::M  M::::M::::M  M::::::M  E:::::::::::::::E   N::::::N  N::::N:::::::N U:::::D     D:::::U
M::::::M   M:::::::M   M::::::M  E::::::EEEEEEEEEE   N::::::N   N:::::::::::N U:::::D     D:::::U
M::::::M    M:::::M    M::::::M  E:::::E             N::::::N    N::::::::::N U:::::D     D:::::U
M::::::M     MMMMM     M::::::M  E:::::E       EEEEEEN::::::N     N:::::::::N U::::::U   U::::::U
M::::::M               M::::::MEE::::::EEEEEEEE:::::EN::::::N      N::::::::N U:::::::UUU:::::::U
M::::::M               M::::::ME::::::::::::::::::::EN::::::N       N:::::::N  UU:::::::::::::UU
M::::::M               M::::::ME::::::::::::::::::::EN::::::N        N::::::N    UU:::::::::UU
MMMMMMMM               MMMMMMMMEEEEEEEEEEEEEEEEEEEEEENNNNNNNN         NNNNNNN      UUUUUUUUU


 */

    /*

  SPRITEMATE

*/

    dom.sel("#menubar-info").onclick = () => {
      this.allow_keyboard_shortcuts = false;
      $(this.window_about.get_window_id()).dialog("open");
    };

    dom.sel("#menubar-settings").onclick = () => {
      this.allow_keyboard_shortcuts = false;
      $(this.window_settings.get_window_id()).dialog("open");
    };

    /*

  FILE

*/

    dom.sel("#menubar-load").onclick = () => {
      dom.sel("#input-load").click();
    };

    dom.sel("#menubar-save").onclick = () => {
      this.allow_keyboard_shortcuts = false;
      $(this.window_save.get_window_id()).dialog("open");
      this.save.set_save_data(this.sprite.get_all(), this.config.colors);
    };

    dom.sel("#menubar-upthemode").onclick = () => {//
        if (this.config.colour_depth == 2)
        {
            this.config.colour_depth = 4;
        }
        else if (this.config.colour_depth == 4)
        {
            this.config.colour_depth = 16;
        }
        this.palette.set_colors(this.config.colors, this.config.colour_depth);
        this.update_config()
        this.resizeAndUpdateDialogs();
        this.displayProjectInfo();
    };

    dom.sel("#menubar-new").onclick = () => {//
        dom.val("#XWidth", this.config.sprite_x);
        dom.val("#YHeight", this.config.sprite_y);
        dom.val("#colDepth", this.config.colour_depth);
        dom.css("#dialog-confirm", "visibility", "visible");
        this.checkXWidth();
        $("#dialog-confirm").dialog("open");
    };

    dom.sel("#XWidth").onchange = () => {
        this.checkXWidth();
        this.checkColDepth();
    }

    dom.sel("#colDepth").onchange = () => {
        this.checkColDepth();
    }

    dom.sel("#ProjectType").onchange = () => {
        this.config.type = dom.val("#ProjectType");

        if (this.config.type=="Sprite")
        {
            dom.sel("#XWidth").options[0].style.display='none';
            dom.sel("#YHeight").options[0].style.display='none';

            dom.sel("#XWidth").options[2].style.display='block';
            dom.sel("#YHeight").options[2].style.display='block';

            dom.sel("#XWidth").options[3].style.display='block';
            dom.sel("#YHeight").options[3].style.display='block';

            dom.val("#XWidth", 16);
            dom.val("#YHeight", 16);

            dom.sel("#colDepth").options[0].style.display='none';
            dom.sel("#colDepth").options[1].style.display='none';

            dom.val("#colDepth", 16);
        }
        else
        {
            dom.sel("#XWidth").options[0].style.display='block';
            dom.sel("#YHeight").options[0].style.display='block';

            dom.sel("#XWidth").options[2].style.display='none';
            dom.sel("#YHeight").options[2].style.display='none';

            dom.sel("#XWidth").options[3].style.display='none';
            dom.sel("#YHeight").options[3].style.display='none';

            dom.val("#XWidth", 8);
            dom.val("#YHeight", 8);

            dom.sel("#colDepth").options[0].style.display='block';
            dom.sel("#colDepth").options[1].style.display='block';

            dom.val("#colDepth", 2);
             
        }
    }

    $("#dialog-confirm").dialog({
      resizable: false,
      autoOpen: false,
      height: "auto",
      width: 400,
      modal: true,
      dialogClass: "no-close",
      buttons: [
        {
          click: () => {
            this.config.sprite_x = dom.val("#XWidth");
            this.config.sprite_y = dom.val("#YHeight");
            this.config.colour_depth = dom.val("#colDepth");
            this.sprite.width = this.config.sprite_x;
            this.sprite.height = this.config.sprite_y;
        
            this.palette.set_colors(this.config.colors, this.config.colour_depth);
            this.update_config()
            this.sprite = new Sprite(this.config);
            this.sprite.new_sprite();
            this.resizeAndUpdateDialogs();
            // this.list.update_all(this.sprite.get_all());
            // this.update();
            $("#dialog-confirm").dialog("close");
            this.displayProjectInfo();
            status("New file created.");
          },
          text: "Ok",
          class: "confirm-button",
        },
        {
          click: () => {
            $("#dialog-confirm").dialog("close");
          },
          text: "Cancel",
          class: "confirm-button",
        },
      ],
    });

    /*

  EDIT

*/

    dom.sel("#menubar-undo").onclick = () => {
      this.sprite.undo();
      this.list.update_all(this.sprite.get_all());
      this.update();
    };

    dom.sel("#menubar-redo").onclick = () => {
      this.sprite.redo();
      this.list.update_all(this.sprite.get_all());
      this.update();
    };

    dom.sel("#menubar-new-sprite").onclick = () => {
      this.sprite.new_sprite();
      this.list.update_all(this.sprite.get_all());
      this.update();
    };

    dom.sel("#menubar-kill").onclick = () => {
      this.sprite.delete();
      this.list.update_all(this.sprite.get_all());
      this.update();
    };

    dom.sel("#menubar-copy").onclick = () => {
      this.sprite.copy();
      this.update_ui();
      status("Sprite copied.");
    };

    dom.sel("#menubar-paste").onclick = () => {
      if (!this.sprite.is_copy_empty()) {
        this.sprite.paste();
        this.update();
        status("Sprite pasted.");
      } else {
        status("Nothing to copy.", "error");
      }
    };

    dom.sel("#menubar-duplicate").onclick = () => {
      this.sprite.duplicate();
      this.list.update_all(this.sprite.get_all());
      this.update_ui();
      status("Sprite duplicated.");
    };

    /*

  SPRITE

*/

    dom.sel("#menubar-shift-left").onclick = () => {
      this.sprite.shift_horizontal("left");
      this.update();
    };

    dom.sel("#menubar-shift-right").onclick = () => {
      this.sprite.shift_horizontal("right");
      this.update();
    };

    dom.sel("#menubar-shift-up").onclick = () => {
      this.sprite.shift_vertical("up");
      this.update();
    };

    dom.sel("#menubar-shift-down").onclick = () => {
      this.sprite.shift_vertical("down");
      this.update();
    };

    dom.sel("#menubar-flip-horizontal").onclick = () => {
      this.sprite.flip_horizontal();
      this.update();
    };

    dom.sel("#menubar-flip-vertical").onclick = () => {
      this.sprite.flip_vertical();
      this.update();
    };

    // dom.sel("#menubar-colormode").onclick = () => {
    //   this.sprite.toggle_multicolor();
    //   this.update();
    // };

    // dom.sel("#menubar-stretch-x").onclick = () => {
    //   this.sprite.toggle_double_x();
    //   this.update();
    // };

    // dom.sel("#menubar-stretch-y").onclick = () => {
    //   this.sprite.toggle_double_y();
    //   this.update();
    // };

    dom.sel("#menubar-invert").onclick = () => {
      this.sprite.invert();
      this.update();
    };

    dom.sel("#menubar-overlay").onclick = () => {
      this.sprite.toggle_overlay();
      this.update();
    };

    /*

  VIEW

*/

    dom.sel("#menubar-fullscreen").onclick = () => {
      toggle_fullscreen();
    };

    dom.sel("#menubar-editor-zoom-in").onclick = () => {
      this.editor.zoom_in();
      this.config.window_editor.zoom = this.editor.get_zoom();
      this.storage.write(this.config);
      this.update();
    };

    dom.sel("#menubar-editor-zoom-out").onclick = () => {
      this.editor.zoom_out();
      this.config.window_editor.zoom = this.editor.get_zoom();
      this.storage.write(this.config);
      this.update();
    };

    dom.sel("#menubar-editor-grid").onclick = () => {
      this.editor.toggle_grid();
      this.config.window_editor.grid = this.editor.get_grid();
      this.storage.write(this.config);
      this.update();
    };

    dom.sel("#menubar-preview-zoom-in").onclick = () => {
      this.preview.zoom_in();
      this.config.window_preview.zoom = this.preview.get_zoom();
      this.storage.write(this.config);
      this.update();
    };

    dom.sel("#menubar-preview-zoom-out").onclick = () => {
      this.preview.zoom_out();
      this.config.window_preview.zoom = this.preview.get_zoom();
      this.storage.write(this.config);
      this.update();
    };

    dom.sel("#menubar-list-grid").onclick = () => {
      this.list.toggle_grid();
      this.list.update_all(this.sprite.get_all());
      this.update();
    };

    dom.sel("#menubar-list-zoom-in").onclick = () => {
      this.list.zoom_in();
      this.config.window_list.zoom = this.list.get_zoom();
      this.storage.write(this.config);
      this.list.update_all(this.sprite.get_all());
      this.update();
    };

    dom.sel("#menubar-list-zoom-out").onclick = () => {
      this.list.zoom_out();
      this.config.window_list.zoom = this.list.get_zoom();
      this.storage.write(this.config);
      this.list.update_all(this.sprite.get_all());
      this.update();
    };

    dom.sel("#menubar-animate-zoom-in").onclick = () => {
        this.animate.zoom_in();
        this.config.window_animate.zoom = this.animate.get_zoom();
        this.storage.write(this.config);
        this.update();
      };
  
      dom.sel("#menubar-animate-zoom-out").onclick = () => {
        this.animate.zoom_out();
        this.config.window_animate.zoom = this.animate.get_zoom();
        this.storage.write(this.config);
        this.update();
      };
 
    /*

    PREVIEW

*/

    dom.sel("#icon-preview-zoom-in").onclick = () => {
      this.preview.zoom_in();
      this.config.window_preview.zoom = this.preview.get_zoom();
      this.storage.write(this.config);
      this.update();
    };

    dom.sel("#icon-preview-zoom-out").onclick = () => {
      this.preview.zoom_out();
      this.config.window_preview.zoom = this.preview.get_zoom();
      this.storage.write(this.config);
      this.update();
    };

/*
    ANIMATE
*/

    dom.sel("#icon-animate-zoom-in").onclick = () => {
        this.animate.zoom_in();
        this.config.window_animate.zoom = this.animate.get_zoom();
        this.storage.write(this.config);
        this.update();
      };
  
      dom.sel("#icon-animate-zoom-out").onclick = () => {
        this.animate.zoom_out();
        this.config.window_animate.zoom = this.animate.get_zoom();
        this.storage.write(this.config);
        this.update();
      };
  
    dom.sel("#icon-preview-overlay").onclick = () => {
      this.sprite.toggle_overlay();
      this.update();
    };

    /*


    

TTTTTTTTTTTTTTTTTTTTTTT      OOOOOOOOO         OOOOOOOOO      LLLLLLLLLLL                 SSSSSSSSSSSSSSS 
T:::::::::::::::::::::T    OO:::::::::OO     OO:::::::::OO    L:::::::::L               SS:::::::::::::::S
T:::::::::::::::::::::T  OO:::::::::::::OO OO:::::::::::::OO  L:::::::::L              S:::::SSSSSS::::::S
T:::::TT:::::::TT:::::T O:::::::OOO:::::::O:::::::OOO:::::::O LL:::::::LL              S:::::S     SSSSSSS
TTTTTT  T:::::T  TTTTTT O::::::O   O::::::O::::::O   O::::::O   L:::::L                S:::::S            
        T:::::T         O:::::O     O:::::O:::::O     O:::::O   L:::::L                S:::::S            
        T:::::T         O:::::O     O:::::O:::::O     O:::::O   L:::::L                 S::::SSSS         
        T:::::T         O:::::O     O:::::O:::::O     O:::::O   L:::::L                  SS::::::SSSSS    
        T:::::T         O:::::O     O:::::O:::::O     O:::::O   L:::::L                    SSS::::::::SS  
        T:::::T         O:::::O     O:::::O:::::O     O:::::O   L:::::L                       SSSSSS::::S 
        T:::::T         O:::::O     O:::::O:::::O     O:::::O   L:::::L                            S:::::S
        T:::::T         O::::::O   O::::::O::::::O   O::::::O   L:::::L         LLLLLL             S:::::S
      TT:::::::TT       O:::::::OOO:::::::O:::::::OOO:::::::O LL:::::::LLLLLLLLL:::::L SSSSSSS     S:::::S
      T:::::::::T        OO:::::::::::::OO OO:::::::::::::OO  L::::::::::::::::::::::L S::::::SSSSSS:::::S
      T:::::::::T          OO:::::::::OO     OO:::::::::OO    L::::::::::::::::::::::L S:::::::::::::::SS 
      TTTTTTTTTTT            OOOOOOOOO         OOOOOOOOO      LLLLLLLLLLLLLLLLLLLLLLLL  SSSSSSSSSSSSSSS  



*/

    dom.sel("#icon-load").onclick = () => {
      dom.sel("#input-load").click();
    };

    dom.sel("#icon-save").onclick = () => {
      this.allow_keyboard_shortcuts = false;
      $(this.window_save.get_window_id()).dialog("open");
      this.save.set_save_data(this.sprite.get_all(), this.config.colors);
    };

    dom.sel("#icon-undo").onclick = () => {
      this.sprite.undo();
      this.list.update_all(this.sprite.get_all());
      this.update();
    };

    dom.sel("#icon-redo").onclick = () => {
      this.sprite.redo();
      this.list.update_all(this.sprite.get_all());
      this.update();
    };

    dom.sel("#icon-move").onclick = () => {
      this.mode = "move";
      status("Move mode");
      dom.attr("#image-icon-move", "src", "ui/icon-move-hi.png");
      dom.attr("#image-icon-draw", "src", "ui/icon-draw.png");
      dom.attr("#image-icon-erase", "src", "ui/icon-erase.png");
      dom.attr("#image-icon-fill", "src", "ui/icon-fill.png");
    };

    dom.sel("#icon-draw").onclick = () => {
      this.mode = "draw";
      status("Draw mode");
      dom.attr("#image-icon-move", "src", "ui/icon-move.png");
      dom.attr("#image-icon-draw", "src", "ui/icon-draw-hi.png");
      dom.attr("#image-icon-erase", "src", "ui/icon-erase.png");
      dom.attr("#image-icon-fill", "src", "ui/icon-fill.png");
    };

    dom.sel("#icon-erase").onclick = () => {
      this.mode = "erase";
      status("Erase mode");
      dom.attr("#image-icon-move", "src", "ui/icon-move.png");
      dom.attr("#image-icon-draw", "src", "ui/icon-draw.png");
      dom.attr("#image-icon-erase", "src", "ui/icon-erase-hi.png");
      dom.attr("#image-icon-fill", "src", "ui/icon-fill.png");
    };

    dom.sel("#icon-fill").onclick = () => {
      this.mode = "fill";
      status("Fill mode");
      dom.attr("#image-icon-move", "src", "ui/icon-move.png");
      dom.attr("#image-icon-draw", "src", "ui/icon-draw.png");
      dom.attr("#image-icon-erase", "src", "ui/icon-erase.png");
      dom.attr("#image-icon-fill", "src", "ui/icon-fill-hi.png");
    };

    /*

        CCCCCCCCCCCCC     OOOOOOOOO     LLLLLLLLLLL                  OOOOOOOOO     RRRRRRRRRRRRRRRRR      SSSSSSSSSSSSSSS 
     CCC::::::::::::C   OO:::::::::OO   L:::::::::L                OO:::::::::OO   R::::::::::::::::R   SS:::::::::::::::S
   CC:::::::::::::::C OO:::::::::::::OO L:::::::::L              OO:::::::::::::OO R::::::RRRRRR:::::R S:::::SSSSSS::::::S
  C:::::CCCCCCCC::::CO:::::::OOO:::::::OLL:::::::LL             O:::::::OOO:::::::ORR:::::R     R:::::RS:::::S     SSSSSSS
 C:::::C       CCCCCCO::::::O   O::::::O  L:::::L               O::::::O   O::::::O  R::::R     R:::::RS:::::S            
C:::::C              O:::::O     O:::::O  L:::::L               O:::::O     O:::::O  R::::R     R:::::RS:::::S            
C:::::C              O:::::O     O:::::O  L:::::L               O:::::O     O:::::O  R::::RRRRRR:::::R  S::::SSSS         
C:::::C              O:::::O     O:::::O  L:::::L               O:::::O     O:::::O  R:::::::::::::RR    SS::::::SSSSS    
C:::::C              O:::::O     O:::::O  L:::::L               O:::::O     O:::::O  R::::RRRRRR:::::R     SSS::::::::SS  
C:::::C              O:::::O     O:::::O  L:::::L               O:::::O     O:::::O  R::::R     R:::::R       SSSSSS::::S 
C:::::C              O:::::O     O:::::O  L:::::L               O:::::O     O:::::O  R::::R     R:::::R            S:::::S
 C:::::C       CCCCCCO::::::O   O::::::O  L:::::L         LLLLLLO::::::O   O::::::O  R::::R     R:::::R            S:::::S
  C:::::CCCCCCCC::::CO:::::::OOO:::::::OLL:::::::LLLLLLLLL:::::LO:::::::OOO:::::::ORR:::::R     R:::::RSSSSSSS     S:::::S
   CC:::::::::::::::C OO:::::::::::::OO L::::::::::::::::::::::L OO:::::::::::::OO R::::::R     R:::::RS::::::SSSSSS:::::S
     CCC::::::::::::C   OO:::::::::OO   L::::::::::::::::::::::L   OO:::::::::OO   R::::::R     R:::::RS:::::::::::::::SS 
        CCCCCCCCCCCCC     OOOOOOOOO     LLLLLLLLLLLLLLLLLLLLLLLL     OOOOOOOOO     RRRRRRRR     RRRRRRR SSSSSSSSSSSSSSS   

*/

    dom.sel("#palette_all_colors").onclick = (e) => {
      this.palette.set_active_color(e);
      this.sprite.set_pen_color(this.palette.get_color());
      this.list.update_all(this.sprite.get_all());
      this.update();
    };

    dom.sel("#palette_1").onclick = () => {
      //this.sprite.set_pen(1);
      this.update();
    };

    dom.sel("#palette_0").onclick = () => {
      this.sprite.set_pen(0);
      this.update();
    };

    /* 

EEEEEEEEEEEEEEEEEEEEEE   DDDDDDDDDDDDD         IIIIIIIIII   TTTTTTTTTTTTTTTTTTTTTTT    
E::::::::::::::::::::E   D::::::::::::DDD      I::::::::I   T:::::::::::::::::::::T 
E::::::::::::::::::::E   D:::::::::::::::DD    I::::::::I   T:::::::::::::::::::::T
EE::::::EEEEEEEEE::::E   DDD:::::DDDDD:::::D   II::::::II   T:::::TT:::::::TT:::::T
  E:::::E       EEEEEE     D:::::D    D:::::D    I::::I     TTTTTT  T:::::T  TTTTTT
  E:::::E                  D:::::D     D:::::D   I::::I             T:::::T        
  E::::::EEEEEEEEEE        D:::::D     D:::::D   I::::I             T:::::T        
  E:::::::::::::::E        D:::::D     D:::::D   I::::I             T:::::T         
  E:::::::::::::::E        D:::::D     D:::::D   I::::I             T:::::T        
  E::::::EEEEEEEEEE        D:::::D     D:::::D   I::::I             T:::::T        
  E:::::E                  D:::::D     D:::::D   I::::I             T:::::T       
  E:::::E       EEEEEE     D:::::D    D:::::D    I::::I             T:::::T       
EE::::::EEEEEEEE:::::E   DDD:::::DDDDD:::::D   II::::::II         TT:::::::TT     
E::::::::::::::::::::E   D:::::::::::::::DD    I::::::::I         T:::::::::T     
E::::::::::::::::::::E   D::::::::::::DDD      I::::::::I         T:::::::::T      
EEEEEEEEEEEEEEEEEEEEEE   DDDDDDDDDDDDD         IIIIIIIIII         TTTTTTTTTTT        

*/

    dom.sel("#icon-editor-zoom-in").onclick = () => {
      this.editor.zoom_in();
      this.config.window_editor.zoom = this.editor.get_zoom();
      this.storage.write(this.config);
      this.update();
    };

    dom.sel("#icon-editor-zoom-out").onclick = () => {
      this.editor.zoom_out();
      this.config.window_editor.zoom = this.editor.get_zoom();
      this.storage.write(this.config);
      this.update();
    };

    dom.sel("#icon-editor-grid").onclick = () => {
      this.editor.toggle_grid();
      this.config.window_editor.grid = this.editor.get_grid();
      this.storage.write(this.config);
      this.update();
    };

    dom.sel("#icon-shift-left").onclick = () => {
        this.sprite.shift_horizontal("left");
        this.update();
      };
  
      dom.sel("#icon-shift-right").onclick = () => {
        this.sprite.shift_horizontal("right");
        this.update();
      };
  
      dom.sel("#icon-shift-up").onclick = () => {
        this.sprite.shift_vertical("up");
        this.update();
      };
  
      dom.sel("#icon-shift-down").onclick = () => {
        this.sprite.shift_vertical("down");
        this.update();
      };
  
    dom.sel("#icon-flip-horizontal").onclick = () => {
      this.sprite.flip_horizontal();
      this.update();
    };

    dom.sel("#icon-flip-vertical").onclick = () => {
      this.sprite.flip_vertical();
      this.update();
    };

    dom.sel("#input-sprite-name").onfocus = () => {
      this.allow_keyboard_shortcuts = false;
    };

    dom.sel("#input-sprite-name").onkeyup = (e) => {
      if (e.key === "Enter") {
        this.update_sprite_name();
        dom.sel("#input-sprite-name").blur();
      }
    };

    dom.sel("#input-sprite-name").onblur = () => {
      this.update_sprite_name();
    };

    // prevent scrolling of canvas on mobile
    dom.sel("#editor").ontouchmove = (e) => {
      e.preventDefault();
    };

    dom.sel("#editor").onmousedown = (e) => {
      if (this.mode == "draw") {
        this.sprite.set_pixel(this.editor.get_pixel(e), e.shiftKey); // updates the sprite array at the grid position with the color chosen on the palette
        this.is_drawing = true; // needed for mousemove drawing
      }

      if (this.mode == "erase") {
        this.sprite.set_pixel(this.editor.get_pixel(e), true); // updates the sprite array at the grid position with the color chosen on the palette
        this.is_drawing = true; // needed for mousemove drawing
      }

      if (this.mode == "fill") {
        this.sprite.floodfill(this.editor.get_pixel(e));
      }

      if (this.mode == "move") {
        this.move_start = true;
        this.move_start_pos = this.editor.get_pixel(e);
      }
      this.update();
    };

    dom.sel("#editor").onmousemove = (e) => {
      if (this.is_drawing && (this.mode == "draw" || this.mode == "erase")) {
        const newpos = this.editor.get_pixel(e);
        // only draw if the mouse has entered a new pixel area (just for performance)
        if (newpos.x != this.oldpos.x || newpos.y != this.oldpos.y) {
          const all = this.sprite.get_all();
          let delete_trigger = e.shiftKey;
          if (this.mode == "erase") delete_trigger = true;
          this.sprite.set_pixel(newpos, delete_trigger); // updates the sprite array at the grid position with the color chosen on the palette
          this.editor.update(all);
          this.preview.update(all);
          this.list.update(all); // only updates the sprite drawn onto
          this.oldpos = newpos;
        }
      }

      if (this.move_start) {
        const x_diff = this.editor.get_pixel(e).x - this.move_start_pos.x;
        const y_diff = this.editor.get_pixel(e).y - this.move_start_pos.y;

        if (x_diff > 0) {
          this.sprite.shift_horizontal("right");
        }
        if (x_diff < 0) {
          this.sprite.shift_horizontal("left");
        }
        if (y_diff > 0) {
          this.sprite.shift_vertical("down");
        }
        if (y_diff < 0) {
          this.sprite.shift_vertical("up");
        }

        if (x_diff || y_diff) {
          this.move_start_pos = this.editor.get_pixel(e);
          this.update();
        }
      }
    };

    dom.sel("#editor").onclick = () => {
      // stop drawing pixels
      this.is_drawing = false;
      this.move_start = false;
      this.sprite.save_backup();
      this.update();
    };

    /*

LLLLLLLLLLL                IIIIIIIIII      SSSSSSSSSSSSSSS    TTTTTTTTTTTTTTTTTTTTTTT
L:::::::::L                I::::::::I    SS:::::::::::::::S   T:::::::::::::::::::::T
L:::::::::L                I::::::::I   S:::::SSSSSS::::::S   T:::::::::::::::::::::T
LL:::::::LL                II::::::II   S:::::S     SSSSSSS   T:::::TT:::::::TT:::::T
  L:::::L                    I::::I     S:::::S               TTTTTT  T:::::T  TTTTTT
  L:::::L                    I::::I     S:::::S                       T:::::T        
  L:::::L                    I::::I      S::::SSSS                    T:::::T        
  L:::::L                    I::::I       SS::::::SSSSS               T:::::T        
  L:::::L                    I::::I         SSS::::::::SS             T:::::T        
  L:::::L                    I::::I            SSSSSS::::S            T:::::T        
  L:::::L                    I::::I                 S:::::S           T:::::T        
  L:::::L         LLLLLL     I::::I                 S:::::S           T:::::T        
LL:::::::LLLLLLLLL:::::L   II::::::II   SSSS        S:::::S         TT:::::::TT      
L::::::::::::::::::::::L   I::::::::I   S::::::SSSSSS:::::S         T:::::::::T      
L::::::::::::::::::::::L   I::::::::I   S:::::::::::::::SS          T:::::::::T      
LLLLLLLLLLLLLLLLLLLLLLLL   IIIIIIIIII    SSSSSSSSSSSSSSS            TTTTTTTTTTT  

*/

    dom.sel("#icon-list-grid").onclick = () => {
      this.list.toggle_grid();
      this.list.update_all(this.sprite.get_all());
      this.update();
    };

    dom.sel("#icon-list-zoom-in").onclick = () => {
      this.list.zoom_in();
      this.config.window_list.zoom = this.list.get_zoom();
      this.storage.write(this.config);
      this.list.update_all(this.sprite.get_all());
      this.update();
    };

    dom.sel("#icon-list-zoom-out").onclick = () => {
      this.list.zoom_out();
      this.config.window_list.zoom = this.list.get_zoom();
      this.storage.write(this.config);
      this.list.update_all(this.sprite.get_all());
      this.update();
    };

    dom.sel("#icon-list-new").onclick = () => {
      this.sprite.new_sprite();
      this.list.update_all(this.sprite.get_all());
      this.update();
    };

    dom.sel("#icon-list-delete").onclick = () => {
      this.sprite.delete();
      this.list.update_all(this.sprite.get_all());
      this.update();
    };

    dom.sel("#icon-list-copy").onclick = () => {
      this.sprite.copy();
      this.update_ui();
      status("Sprite copied.");
    };

    dom.sel("#icon-list-paste").onclick = () => {
      if (!this.sprite.is_copy_empty()) {
        this.sprite.paste();
        this.update();
        status("Sprite pasted.");
      } else {
        status("Nothing to copy.", "error");
      }
    };

    dom.sel("#icon-list-duplicate").onclick = () => {
        this.sprite.duplicate();
        this.list.update_all(this.sprite.get_all());
        this.update_ui();
        status("Sprite duplicated.");
      };

      dom.sel("#icon-list-add-animate").onclick = () => {
      this.animatelist.get_animation_list_length();
      this.sprite.all.sprites[this.sprite.all.current_sprite].animationframe.push(this.animatelist.get_animation_list_length());
      this.animatelist.update_all(this.sprite.get_all());
      this.animate.set_animationFrames(this.animatelist.animationFrames);
      this.update_ui()
    };

    dom.sel("#spritelist").onclick = () => {
      if (!this.dragging) {
        this.sprite.set_current_sprite(this.list.get_clicked_sprite());
        this.update();
      }
    };

    $("#spritelist").sortable({
      stop: () => {
        this.sprite.sort_spritelist($("#spritelist").sortable("toArray"));
        this.dragging = false;
        this.list.update_all(this.sprite.get_all());
        this.update();
      },
    });

    $("#spritelist").sortable({
      start: () => {
        this.dragging = true;
      },
    });


    dom.sel("#animatelist").onclick = () => {
        if (!this.dragging) {
            this.update();
        }
    };

    $("#animatelist").sortable(
    {
        stop: () => {
            //this.sprite.sort_spritelist($("#animatelist").sortable("toArray"));
            let newAnimationOrder = $("#animatelist").sortable("toArray")
            const sorted_list = newAnimationOrder.map(function (x) {
                return parseInt(x.replace("AS-",""));
              });
            for (let i = 0; i < this.sprite.all.sprites.length; i++) {
                this.sprite.all.sprites[i].animationframe = []
            }
          
            for (let i = 0; i < sorted_list.length; i++) {
                let animationFrameID = this.animatelist.animationFrames[sorted_list[i]][0]
                let spriteID = this.animatelist.animationFrames[sorted_list[i]][1]

                this.sprite.all.sprites[spriteID].animationframe.push(i);
            }
            this.dragging = false;
            this.animatelist.update_all(this.sprite.get_all());
            this.animate.set_animationFrames(this.animatelist.animationFrames);
            this.update_ui()
        },
    });

    $("#animatelist").sortable(
    {
        start: () => {
            this.dragging = true;
        },
    });

    dom.sel("#icon-animatelist-delete").onclick = () => {

        if (this.animatelist.get_animation_list_length() == 0)
        {
            this.sprite.current_animated_frame = -1
        }
        else
        {
            const animationFrame = this.animatelist.clicked_sprite;
            const spriteID = this.animatelist.animationFrames[animationFrame][1]
    
            this.sprite.all.sprites[spriteID].animationframe.pop(animationFrame)

            this.animatelist.update_all(this.sprite.get_all());
            this.animate.set_animationFrames(this.animatelist.animationFrames)
            if (this.animatelist.clicked_sprite > this.animatelist.get_animation_list_length()-1)
            {
                this.animatelist.clicked_sprite = this.animatelist.get_animation_list_length()-1
            }

            if (this.animatelist.get_animation_list_length() == 0)
            {
                this.sprite.current_animated_frame = -1
            }
            else
            {
                this.sprite.current_animated_frame = 0
            }
            this.update();
            this.update_ui();
        }
    };

    dom.sel("#icon-animatelist-grid").onclick = () => {
        this.animatelist.toggle_grid();
        this.animatelist.update_all(this.sprite.get_all());
        this.animate.set_animationFrames(this.animatelist.animationFrames);
        this.update();
      };
  
      dom.sel("#icon-animatelist-zoom-in").onclick = () => {
        this.animatelist.zoom_in();
        this.config.window_list.zoom = this.list.get_zoom();
        this.storage.write(this.config);
        this.animatelist.update_all(this.sprite.get_all());
        this.animate.set_animationFrames(this.animatelist.animationFrames);
        this.update();
      };
  
      dom.sel("#icon-animatelist-zoom-out").onclick = () => {
        this.animatelist.zoom_out();
        this.config.window_list.zoom = this.list.get_zoom();
        this.storage.write(this.config);
        this.animatelist.update_all(this.sprite.get_all());
        this.animate.set_animationFrames(this.animatelist.animationFrames);
        this.update();
      };
  
  
        
            
  }
}

// const AnimStart = new Event("myAnimStart");
// const AnimStop = new Event("myAnimStop");

// document.addEventListener("myAnimStart", (e) => {

// }, false);

// document.addEventListener("myAnimStop", (e) => {

// }, false);
    
document.addEventListener("DOMContentLoaded", function () {
  new App(get_config());
});

import { dom, status } from "./helper";
import Palette from "./Palette";

export default class Save {
  default_filename: any;
  savedata: any;

  constructor(public window: number, public config, public eventhandler) {
    this.config = config;
    this.window = window;
    this.default_filename = "mysprites";
    this.eventhandler = eventhandler;

    const template = `
    <div id="window-save">

      <div class="center">
        Filename: <input autofocus type="text" id="filename" name="filename" value="${this.default_filename}">
        <p>The file will be saved to your browser's default download location.</p>
      </div>
      <br/>
      <fieldset>
        <legend>SpritemateX // *.spmx</legend>
        <button id="button-save-spm">Save as SpritemateX</button>
        <p>JSON file format for spritemateX. Recommended as long as you are not done working on the sprites.</p>
      </fieldset>
    
      <fieldset>
        <legend>Assembly code // *.txt</legend>
        <div class="fieldset right">
          <button id="button-save-source-kick">KICK ASS</button>
          <button id="button-save-source-acme">ACME</button>
          <button id="button-save-source-xci">XCI</button>
          <button id="button-save-bin">BIN</button>
        </div>
        <p>A text file containing the sprite data in assembly language. KICK ASS, ACME and XCI are compilers with slightly different syntax.</p><br>
        <input type="checkbox" id="chkAssets" name="chkAssets" value="Assets" checked>
        <label for="chkAssets">Assets</label><br>
        <input type="checkbox" id="chkPalette" name="chkPalette" value="Palette" checked>
        <label for="chkPalette">Palette</label><br>
      </fieldset>

      <fieldset>
        <legend>BASIC // *.bas</legend>
        <button id="button-save-basic">Save as BASIC 2.0</button>
        <p>A BASIC 2.0 text file that you can copy & paste into X16 emu.</p>
      </fieldset>

      <fieldset>
        <legend>PNG image</legend>
        <p>To save a sprite as a PNG image, "right click" on the sprite in the PREVIEW window. Your browser will display a "save image as..." option in the context menu. The size of the PNG can be set with the zoom levels of the PREVIEW window.</p>
      </fieldset>

      <div id="button-row">
        <button id="button-save-cancel" class="button-cancel">Cancel</button>
      </div>
    </div> 
    `;

    dom.append("#window-" + this.window, template);
    $("#window-" + this.window).dialog({ show: "fade", hide: "fade" });
    dom.sel("#button-save-cancel").onclick = () => this.close_window();
    dom.sel("#button-save-spm").onclick = () => this.save_spm();
    dom.sel("#button-save-source-kick").onclick = () =>
      this.save_assembly("kick");
    dom.sel("#button-save-source-acme").onclick = () =>
      this.save_assembly("acme");
    dom.sel("#button-save-source-xci").onclick = () =>
      this.save_assembly("xci");
    dom.sel("#button-save-bin").onclick = () =>
        this.save_binary();
      dom.sel("#button-save-basic").onclick = () => this.save_basic();

    dom.sel("#filename").onkeyup = () => {
      this.default_filename = dom.val("#filename");
      if (this.default_filename.length < 1) {
        dom.add_class("#filename", "error");

        dom.disabled("#button-save-spm", true);
        dom.add_class("#button-save-spm", "error");

        dom.disabled("#button-save-source-kick", true);
        dom.add_class("#button-save-source-kick", "error");

        dom.disabled("#button-save-source-acme", true);
        dom.add_class("#button-save-source-acme", "error");

        dom.disabled("#button-save-basic", true);
        dom.add_class("#button-save-basic", "error");
      } else {
        dom.remove_class("#filename", "error");

        dom.disabled("#button-save-spm", false);
        dom.remove_class("#button-save-spm", "error");

        dom.disabled("#button-save-source-kick", false);
        dom.remove_class("#button-save-source-kick", "error");

        dom.disabled("#button-save-source-acme", false);
        dom.remove_class("#button-save-source-acme", "error");

        dom.disabled("#button-save-basic", false);
        dom.remove_class("#button-save-basic", "error");
      }
    };
  }

  // https://stackoverflow.com/questions/13405129/javascript-create-and-save-file

  save_file_to_disk(file, filename): void {
    if (window.navigator.msSaveOrOpenBlob)
      // IE10+
      window.navigator.msSaveOrOpenBlob(file, filename);
    else {
      // Others
      const a = document.createElement("a"),
        url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
    }

    status("File has been saved.");
    if (filename.split('.').pop()=="spmx")
    {
        dom.html("#menubar-filename-name", filename);
    }
  }

  save_spm(): void {
    const filename = this.default_filename + ".spmx";
    let data = JSON.stringify(this.savedata);
    // these regular expressions are used to make the outpult file
    // easier to read with line breaks
    data = data
      .replace(/],/g, "],\n")
      .replace(/\[\[/g, "[\n[")
      .replace(/]]/g, "]\n]");
    const file = new Blob([data], { type: "text/plain" });
    this.save_file_to_disk(file, filename);
    this.close_window();
  }

  save_assembly(format): void {
    const filename = this.default_filename + ".asm";
    const assets = dom.isChecked("#chkAssets");
    const pallete = dom.isChecked("#chkPalette");
    let data = "";
    if (assets)
    {
        data += this.create_assembly(format);
    }
    if (format != "xci")
    {
        if (pallete)
        {
            data += this.create_assembly_pallet(format);
        }
    }
    const file = new Blob([data], { type: "text/plain" });
    this.save_file_to_disk(file, filename);
    this.close_window();
  }

  save_basic(): void {
    const filename = this.default_filename + ".bas";
    const data = this.create_basic();
    const file = new Blob([data], { type: "text/plain" });
    this.save_file_to_disk(file, filename);
    this.close_window();
  }

  save_binary(): void {
    const assets = dom.isChecked("#chkAssets");
    const pallete = dom.isChecked("#chkPalette");

    let data = []
    if (assets)
    {
        data = this.create_binary();
        this.saveBinaryFile(this.default_filename + ".spr", data)
    }
    if (pallete)
    {
        data = this.create_binary_pallet();
        this.saveBinaryFile(this.default_filename + ".pal", data)
    }
    
    this.close_window();
  }

  saveBinaryFile(filename, data): void {
    const buffer = new Int8Array(data.length);
    // Write each integer into the buffer
    data.forEach((int, index) => {
        buffer[index] = int; // Write as a signed 8-bit integer
    });
    console.log(buffer);
    const file = new Blob([buffer], { type: "application/octet-stream" });
    this.save_file_to_disk(file, filename);
  }

  create_binary_pallet() {

    let data: any = [];
    for (let palletColour = 0; palletColour < this.config.colour_depth; palletColour++)
    {
        const red = parseInt(this.savedata.palette[palletColour].substring(1,2), 16);
        const green = parseInt(this.savedata.palette[palletColour].substring(3,4),16);
        const blue = parseInt(this.savedata.palette[palletColour].substring(5,6),16);

        data.push((green* 16) + blue);
        data.push((0 * 16) + red);
    }
    return data;
}


  /*

               AAA                 SSSSSSSSSSSSSSS MMMMMMMM               MMMMMMMM
              A:::A              SS:::::::::::::::SM:::::::M             M:::::::M
             A:::::A            S:::::SSSSSS::::::SM::::::::M           M::::::::M
            A:::::::A           S:::::S     SSSSSSSM:::::::::M         M:::::::::M
           A:::::::::A          S:::::S            M::::::::::M       M::::::::::M
          A:::::A:::::A         S:::::S            M:::::::::::M     M:::::::::::M
         A:::::A A:::::A         S::::SSSS         M:::::::M::::M   M::::M:::::::M
        A:::::A   A:::::A         SS::::::SSSSS    M::::::M M::::M M::::M M::::::M
       A:::::A     A:::::A          SSS::::::::SS  M::::::M  M::::M::::M  M::::::M
      A:::::AAAAAAAAA:::::A            SSSSSS::::S M::::::M   M:::::::M   M::::::M
     A:::::::::::::::::::::A                S:::::SM::::::M    M:::::M    M::::::M
    A:::::AAAAAAAAAAAAA:::::A               S:::::SM::::::M     MMMMM     M::::::M
   A:::::A             A:::::A  SSSSSSS     S:::::SM::::::M               M::::::M
  A:::::A               A:::::A S::::::SSSSSS:::::SM::::::M               M::::::M
 A:::::A                 A:::::AS:::::::::::::::SS M::::::M               M::::::M
AAAAAAA                   AAAAAAASSSSSSSSSSSSSSS   MMMMMMMM               MMMMMMMM


 */

  create_assembly(format) {
    let comment = "; ";
    let prefix = "!";
    let label_suffix = "";
    let label_dollar = "$";
    let label_comma = ",";
    let label_byte = "byte";
    let label_prefix = "";

    if (format == "kick") {
      comment = "// ";
      prefix = ".";
      label_suffix = ":";
    }
    else if ((format == "xci"))
    {
        comment = "# ";
        prefix = "";
        label_suffix = "";
        label_dollar = "";
        label_comma = "";
        label_byte = "";
        label_prefix = "#";
    }

    let data = "";

    data +=
      "\n" +
      comment +
      this.savedata.sprites.length +
      " sprites generated with spritemateX on " +
      new Date().toLocaleString();

    let byte = 0;
    let bit = "";

    for (
      let j = 0;
      j < this.savedata.sprites.length;
      j++ // iterate through all sprites
    ) {
      const spritedata = [].concat.apply([], this.savedata.sprites[j].pixels); // flatten 2d array
      let stepping = 1;
      const line_breaks_after = this.config.sprite_x;

      data += "\n\n" + comment + "sprite " + j;
      data += ", Width : " + this.config.sprite_x + ", Height : " + this.config.sprite_y;
      data += ", Colour Depth : " + this.config.colour_depth + "\n";
      data += "\n" + label_prefix + this.savedata.sprites[j].name.replace(/[^a-z0-9]/gi, '') + label_suffix + "\n";

      if (this.config.colour_depth == 16)
      {
        stepping = 2;
      }
      else if (this.config.colour_depth == 4)
      {
        stepping = 4;
      }
      else
      {
        stepping = 8;
      }
      
      let spritelayout = "";

      // iterate through the pixel data array
      // and create a hex or binary values based on multicolor or singlecolor
      for (let i = 0; i < spritedata.length; i = i + stepping) {
        if (i % line_breaks_after == 0) {
            if (format != "xci")
            {
                data = data.substring(0, data.length - 1);
                data += spritelayout
            }
            data += "\n" + prefix + label_byte + " ";
            spritelayout = "          " + comment + " ";
        }

        if (stepping == 8)
        {
            byte = 0;
            for (let bit = 0; bit < 8 ; bit++)
            {
                byte += (spritedata[i+bit] * Math.pow(2,(7-bit)));
                spritelayout += (spritedata[i+bit]==1 ? "X" : ".");
            }
        }
        else if (stepping == 4)
        {
            byte = (spritedata[i] * 64) + (spritedata[i+1] * 16) + (spritedata[i+2] * 4) + spritedata[i+3];
            spritelayout += (spritedata[i]==0 ? "." : "X");
            spritelayout += (spritedata[i+1]==0 ? "." : "X");
            spritelayout += (spritedata[i+2]==0 ? "." : "X");
            spritelayout += (spritedata[i+3]==0 ? "." : "X");
        }
        else
        {
            byte = (spritedata[i] * 16) + (spritedata[i+1]);
            spritelayout += (spritedata[i]==0 ? "." : "X");
            spritelayout += (spritedata[i+1]==0 ? "." : "X");
        }

        const hex = byte.toString(16);
        data += label_dollar + (("0" + hex).slice(-2));
        if (i < spritedata.length-stepping) 
        {
            data += label_comma;
        }
      }
      data += spritelayout + "\n";
    }

    // if (format != "xci")
    // {
    //     data += this.create_assembly_pallet(format)
    // }

    return data;
  }

  create_assembly_pallet(format) {
    let comment = "; ";
    let prefix = "!";
    let label_suffix = "";

    if (format == "kick") {
      comment = "// ";
      prefix = ".";
      label_suffix = ":";
    }

    let data = "";
    data += "\n\nSpriteColourPallet" + label_suffix;
    for (let palletColour = 0; palletColour < this.config.colour_depth; palletColour++)
    {
        const red = this.savedata.palette[palletColour].substring(1,2);
        const green = this.savedata.palette[palletColour].substring(3,4);
        const blue = this.savedata.palette[palletColour].substring(5,6);

        data += "\n" + prefix + "byte ";
        data += "$" + green + blue + ", $0" + red;
    }
    return data;
}
  /*

BBBBBBBBBBBBBBBBB               AAA                 SSSSSSSSSSSSSSS IIIIIIIIII      CCCCCCCCCCCCC
B::::::::::::::::B             A:::A              SS:::::::::::::::SI::::::::I   CCC::::::::::::C
B::::::BBBBBB:::::B           A:::::A            S:::::SSSSSS::::::SI::::::::I CC:::::::::::::::C
BB:::::B     B:::::B         A:::::::A           S:::::S     SSSSSSSII::::::IIC:::::CCCCCCCC::::C
  B::::B     B:::::B        A:::::::::A          S:::::S              I::::I C:::::C       CCCCCC
  B::::B     B:::::B       A:::::A:::::A         S:::::S              I::::IC:::::C              
  B::::BBBBBB:::::B       A:::::A A:::::A         S::::SSSS           I::::IC:::::C              
  B:::::::::::::BB       A:::::A   A:::::A         SS::::::SSSSS      I::::IC:::::C              
  B::::BBBBBB:::::B     A:::::A     A:::::A          SSS::::::::SS    I::::IC:::::C              
  B::::B     B:::::B   A:::::AAAAAAAAA:::::A            SSSSSS::::S   I::::IC:::::C              
  B::::B     B:::::B  A:::::::::::::::::::::A                S:::::S  I::::IC:::::C              
  B::::B     B:::::B A:::::AAAAAAAAAAAAA:::::A               S:::::S  I::::I C:::::C       CCCCCC
BB:::::BBBBBB::::::BA:::::A             A:::::A  SSSSSSS     S:::::SII::::::IIC:::::CCCCCCCC::::C
B:::::::::::::::::BA:::::A               A:::::A S::::::SSSSSS:::::SI::::::::I CC:::::::::::::::C
B::::::::::::::::BA:::::A                 A:::::AS:::::::::::::::SS I::::::::I   CCC::::::::::::C
BBBBBBBBBBBBBBBBBAAAAAAA                   AAAAAAASSSSSSSSSSSSSSS   IIIIIIIIII      CCCCCCCCCCCCC

 */

  create_basic() {
    let line_number = 10;
    const line_inc = 10;
    let data = "";
    const max_sprites = Math.min(8, this.savedata.sprites.length); // display up to 8 sprites

    data += line_number + " print chr$(147)";
    line_number += line_inc;
    data += "\n" + line_number + ' print "generated with spritematex"';
    line_number += line_inc;
    data +=
      "\n" +
      line_number +
      ' print "' +
      max_sprites +
      " of " +
      this.savedata.sprites.length +
      ' sprites displayed."';
    line_number += line_inc;
    // data +=
    //   "\n" +
    //   line_number +
    //   " poke 53285," +
    //   this.savedata.colors[2] +
    //   ": rem multicolor 1";
    // line_number += line_inc;
    // data +=
    //   "\n" +
    //   line_number +
    //   " poke 53286," +
    //   this.savedata.colors[3] +
    //   ": rem multicolor 2";
    // line_number += line_inc;
    // data +=
    //   "\n" + line_number + " poke 53269,255 : rem set all 8 sprites visible";
    // line_number += line_inc;
    data +=
      "\n" +
      line_number +
      " for x=12800 to 12800+" +
      (this.savedata.sprites.length * 64 - 1) +
      ": read y: poke x,y: next x: rem sprite generation";
    line_number += line_inc;

    let multicolor_byte = 0;
    let double_x_byte = 0;
    let double_y_byte = 0;

    for (
      let j = 0;
      j < max_sprites;
      j++ // iterate through all sprites
    ) {
      data += "\n" + line_number + " :: rem " + this.savedata.sprites[j].name;
      line_number += line_inc;
      data +=
        "\n" +
        line_number +
        " poke " +
        (53287 + j) +
        "," +
        this.savedata.sprites[j].color +
        ": rem color = " +
        this.savedata.sprites[j].color;
      line_number += line_inc;

      data +=
        "\n" +
        line_number +
        " poke " +
        (2040 + j) +
        "," +
        (200 + j) +
        ": rem pointer";
      line_number += line_inc;

      let xpos = j * 48 + 24 + 20;
      let ypos = 120;

      if (j >= 4) {
        xpos -= 4 * 48;
        ypos += 52;
      }

      data +=
        "\n" +
        line_number +
        " poke " +
        (53248 + j * 2) +
        ", " +
        xpos +
        ": rem x pos";
      line_number += line_inc;

      data +=
        "\n" +
        line_number +
        " poke " +
        (53249 + j * 2) +
        ", " +
        ypos +
        ": rem y pos";
      line_number += line_inc;

      // this bit manipulation is brilliant Ingo
      if (this.savedata.sprites[j].multicolor)
        multicolor_byte = multicolor_byte | (1 << j);
      if (this.savedata.sprites[j].double_x)
        double_x_byte = double_x_byte | (1 << j);
      if (this.savedata.sprites[j].double_y)
        double_y_byte = double_y_byte | (1 << j);
    }

    data +=
      "\n" +
      line_number +
      " poke 53276, " +
      multicolor_byte +
      ": rem multicolor";
    line_number += line_inc;
    data +=
      "\n" + line_number + " poke 53277, " + double_x_byte + ": rem width";
    line_number += line_inc;
    data +=
      "\n" + line_number + " poke 53271, " + double_y_byte + ": rem height";
    line_number += line_inc;

    let byte = "";
    let bit = "";

    line_number = 1000;
    for (
      let j = 0;
      j < this.savedata.sprites.length;
      j++ // iterate through all sprites
    ) {
      const spritedata = [].concat.apply([], this.savedata.sprites[j].pixels); // flatten 2d array
      const is_multicolor = this.savedata.sprites[j].multicolor;
      let stepping = 1;
      if (is_multicolor) stepping = 2; // for multicolor, half of the array data can be ignored

      data += "\n" + line_number + " :: rem " + this.savedata.sprites[j].name;
      line_number += line_inc;

      if (is_multicolor) {
        data += " / " + "multicolor";
      } else {
        data += " / " + "singlecolor";
      }

      data += " / color: " + this.savedata.sprites[j].color;

      // iterate through the pixel data array
      // and create a hex values based on multicolor or singlecolor
      for (let i = 0; i < spritedata.length; i = i + 8) {
        if (i % 128 == 0) {
          data += "\n" + line_number + " data ";
          line_number += line_inc;
        }

        for (let k = 0; k < 8; k = k + stepping) {
          const pen = spritedata[i + k];

          if (is_multicolor) {
            if (pen == 0) bit = "00";
            if (pen == 1) bit = "10";
            if (pen == 2) bit = "01";
            if (pen == 3) bit = "11";
          }

          if (!is_multicolor) {
            bit = "1";
            if (pen == 0) bit = "0";
          }

          byte = byte + bit;
        }

        const hex = parseInt(byte, 2).toString(10);
        data += hex + ",";
        byte = "";
      }

      // finally, we add multicolor and color info for byte 64
      let high_nibble = "0000";
      if (is_multicolor) high_nibble = "1000";

      const low_nibble = (
        "000" + (this.savedata.sprites[j].color >>> 0).toString(2)
      ).slice(-4);

      const color_byte = parseInt(high_nibble + low_nibble, 2).toString(10);
      data += color_byte; // should be the individual color
    }

    data += "\n";
    data = data.replace(/,\n/g, "\n"); // removes all commas at the end of a DATA line

    return data;
  }

  set_save_data(savedata, colourPallet): void {
    this.savedata = savedata;
    this.savedata.palette = colourPallet;
    this.savedata.sprite_x = this.config.sprite_x;
    this.savedata.sprite_y = this.config.sprite_y;
  }

  close_window(): void {
    $("#window-" + this.window).dialog("close");
    this.eventhandler.onLoad(); // calls "regain_keyboard_controls" method in app.js
  }

  create_binary() 
  {

    let data: any = [];

    for (
      let j = 0;
      j < this.savedata.sprites.length;
      j++ // iterate through all sprites
    ) {
        let byte = 0;

        const spritedata = [].concat.apply([], this.savedata.sprites[j].pixels); // flatten 2d array
      let stepping = 1;

      if (this.config.colour_depth == 16)
      {
        stepping = 2;
      }
      else if (this.config.colour_depth == 4)
      {
        stepping = 4;
      }
      else
      {
        stepping = 8;
      }
      
      // iterate through the pixel data array
      // and create a hex or binary values based on multicolor or singlecolor
      for (let i = 0; i < spritedata.length; i = i + stepping) {
        if (stepping == 8)
        {
            byte = 0;
            for (let bit = 0; bit < 8 ; bit++)
            {
                byte += (spritedata[i+bit] * Math.pow(2,(7-bit)));
            }
        }
        else if (stepping == 4)
        {
            byte = (spritedata[i] * 64) + (spritedata[i+1] * 16) + (spritedata[i+2] * 4) + spritedata[i+3];
        }
        else
        {
            byte = (spritedata[i] * 16) + (spritedata[i+1]);
        }
        console.log(byte);
        data.push(byte);
      }
    }

    return data;
  }
}

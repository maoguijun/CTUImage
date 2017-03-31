let postFile = {
  init:function(){
    // console.log(this);
    let t = this;
    t.regional = document.getElementById("label");
    t.getImage = document.getElementById("get_image");
    t.editPic = document.getElementById("edit_pic");
    t.editBox = document.getElementById("cover_box");
    t.px=0;
    t.py=0;
    t.sx=15;
    t.sy=15;
    t.sHeight=150;
    t.sWidth=150;

    document.getElementById("post_file").addEventListener("change",t.handleFile,false);
    // debugger;
    document.getElementById("save_button").onclick = function(){
      t.editPic.height = t.sHeight;
      t.editPic.width = t.sWidth;
      let ctx = t.editPic.getContext("2d");
      let images = new Image();
      images.src = t.imgUrl;
      images.onload = function(){
        ctx.drawImage(images,-t.sx,-t.sy,t.imgWidth,t.imgHeight);
        document.getElementsByTagName("img")[0].src = t.editPic.toDataURL();
      };
    };
    
  },
  handleFile:function(){
    let fileList = this.files[0];
    var oFReader = new FileReader();
    oFReader.readAsDataURL(fileList);
    oFReader.onload = (oFREvent)=>{
      postFile.paintImage(oFREvent.target.result);
    };
  },
  paintImage:function(url){
    let t = this;
    let createCanvas = t.getImage.getContext("2d");
    let img = new Image();
    img.src = url;
    img.onload = function(){
      if(img.width<t.regional.offsetWidth && img.height < t.regional.offsetHeight){
        t.imgWidth = img.width;
        t.imgHeight = img.height;
      }else{
        let pWidth = img.width/(img.height/t.regional.offsetHeight);
        let pHeight = img.Height /(img.width/t.regional.offsetWidth);
        t.imgWidth = img.width >img.height ? t.regional.offsetWidth:pWidth;
        t.imgHeight = img.height >img.width ? t.regional.offsetHeight:pHeight;
      }
      t.px = (t.regional.offsetWidth-t.imgWidth)/2+"px";
      t.py = (t.regional.offsetHeight-t.imgHeight)/2+"px";
      t.getImage.height = t.imgHeight;
      t.getImage.width = t.imgWidth;
      t.getImage.style.left = t.px;
      t.getImage.style.top = t.py;
      createCanvas.drawImage(img,0,0,t.imgWidth,t.imgHeight);
      t.imgUrl = t.getImage.toDataURL();
      t.cutImage();
      t.drag();
    };
  },

  drag:function(){
    let t =this;
    let draging = false;
    let startX = 0;
    let startY = 0;
    document.getElementById("cover_box").onmousemove =function(e){
      
      let pageX = e.pageX - (t.regional.offsetLeft + this.offsetLeft);
      let pageY = e.pageY - (t.regional.offsetTop + this.offsetTop);
      if(pageX > t.sx&& pageX <t.sx+t.sWidth && pageY > t.sy && pageY < t.sy + t.sHeight){
        this.style.cursor = "move";
        this.onmousedown = function(){
        // console.log("1");
          draging = true;
          t.ex = t.sx;
          t.ey = t.sy;
          startX = e.pageX-(t.regional.offsetLeft + this.offsetLeft)
          startY = e.pageY-(t.regional.offsetTop + this.offsetTop)
        };

        window.onmouseup = function(){
          draging = false;
        };

        if(draging){
          if(t.ex +(pageX-startX)<0){
            t.sx= 0;
          }else if(t.ex +(pageX-startX)+t.sWidth > t.imgWidth){
            t.sx= t.imgWidth - t.sWidth;
          }else{
            t.sx= t.ex + (pageX - startX);
          }

          if(t.ey +(pageY-startY)<0){
            t.sy = 0;
          }else if(t.ey +(pageY-startY)+t.sHeight > t.imgHeight){
            t.sy = t.imgHeight- t.sHeight;
          }else{
            t.sy = t.ey + (pageY - startY);
          }

          t.cutImage();
        }else{this.style.cursor = "auto";}

      }
    };
  },

  cutImage:function(){
    let t = this;
    t.editBox.height = t.imgHeight;
    t.editBox.width = t.imgWidth;
    t.editBox.style.display = "block";
    t.editBox.style.left = t.px;
    t.editBox.style.top = t.py;
    let cover = t.editBox.getContext("2d");
    cover.fillStyle = "rgba(0,0,0,0.5)";
    cover.fillRect(0,0,t.imgWidth,t.imgHeight);
    cover.clearRect(t.sx,t.sy,t.sHeight,t.sWidth);

    let show_edit = document.getElementById("show_edit");
    show_edit.style.background = `url(${t.imgUrl}) -${t.sx}px -${t.sy}px no-repeat`;
    show_edit.style.height = t.sHeight+"px";
    show_edit.style.width = t.sWidth+"px";
  },
};
postFile.init();


var  drag = {
  label : document.getElementById("label"),
  init:function(){
    window.ondragenter = function(e){
      // this.style.border = "1px solid #f00";
    };
    window.ondragover = function(e){
      e.preventDefault();
      label.style.border = "1px solid #f00";  
    };
    window.ondragleave = function(e){
      label.style.border = 0;
    };

    window.ondrop = function(e){
      e.preventDefault();  
      // console.log(e.dataTransfer);
      var data = e.dataTransfer.getData("url");
      // console.log(data);
    };

    label.ondrop = function(e){
      // console.log(e.dataTransfer.files);
      var f0 = e.dataTransfer.files[0];
      var fr = new FileReader();
      fr.readAsDataURL(f0);
      fr.onload = function(){
        // console.log(fr.result);
        postFile.paintImage(fr.result);
      };
    }
  },
}
drag.init();

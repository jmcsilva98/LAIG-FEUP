class MyWater extends CGFobject{

    constructor(scene, graph, textureID, heightmapID, parts, heightscale,texscale){
     super(scene);
  
     this.textureID = textureID;
     this.heightmapID = heightmapID;
     this.graph = graph;
     this.parts = parts;
     this.heightscale = heightscale;
     this.texscale=texscale;
     this.i = 0;
     this.maxS=1;
     this.maxT=1;
  
     this.shader=new CGFshader(this.scene.gl, "shaders/texture2.vert","shaders/texture2.frag");
     this.texture = this.graph.textures[this.textureID];
     this.heightmap = this.graph.textures[this.heightmapID];
  
     this.appearance = new CGFappearance(this.scene);
     this.appearance.setDiffuse(0.1,0.1,0.1,0.1);
     this.appearance.setAmbient(1,1,1,1);
     this.appearance.loadTexture('/images/water.jpg');
  
  
     this.plane = new MyPlane(this.scene,this.parts,this.parts);
     this.initBuffers();
     };
  
     initBuffers(){
  
       this.shader.setUniformsValues({uSampler3: 2});
       this.shader.setUniformsValues({uSampler2: 0});
       this.shader.setUniformsValues({normScale: this.heightscale});
       this.shader.setUniformsValues({timeFactor: this.i});
  
  
  
     };
  
     display(){
        this.update();
       this.scene.setActiveShader(this.shader);
       this.scene.pushMatrix();
       this.scene.scale(20,1,20);
       this.appearance.apply();
       this.texture.bind(1);
       this.heightmap.bind(2);
       this.plane.display();
       this.scene.popMatrix();
       this.scene.setActiveShader(this.scene.defaultShader);
     };
     updateTexCoords(length_s,length_t){

     var minS = 0;
     var minT = 0;
     var maxS = (this.maxS - this.minS) / this.texscale;
     var maxT = (this.maxT- this.minT) /this.texscale;

     this.texCoords = [
         minS, maxT,
         maxS, maxT,
         minS, minT,
         maxS, minT
     ];

     this.updateTexCoordsGLBuffers();
     }
     update(){
       
        var factor = (Math.sin((this.i * 3.0) % 3141 * 0.002)+1.0)*.5;
        factor *=this.texscale;
        factor-=1;
         this.i +=0.3;
         //this.updateTexCoords(0,1);
         if (this.i >=5)
         this.i=0;
         this.shader.setUniformsValues({timeFactor: factor});

     }
  
  };
  
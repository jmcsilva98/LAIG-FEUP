

class MyTerrain extends CGFobject{

  constructor(scene, graph, textureID, heightmapID, parts, heightscale){
   super(scene);

   this.textureID = textureID;
   this.heightmapID = heightmapID;
   this.graph = graph;
   this.parts = parts;
   this.heightscale = heightscale;

   this.shader=new CGFshader(this.scene.gl, "shaders/texture1.vert","shaders/texture1.frag");
   this.texture = this.graph.textures[this.textureID];
   this.heightmap = this.graph.textures[this.heightmapID];

   this.appearance = new CGFappearance(this.scene);
   this.appearance.setDiffuse(0.1,0.1,0.1,0.1);
   this.appearance.setAmbient(1,1,1,1);
   this.appearance.loadTexture('/images/texture.jpg');


   this.plane = new MyPlane(this.scene,this.parts,this.parts);
   this.initBuffers();
   };

  /* update(currentTime){

     this.timeFactor = (Math.sin((currentTime * 3.0) % 3141 * 0.002)+1.0)*0.5;
     this.shader.setUniformValues({timeFactor: this.timeFactor});
   }*/
   initBuffers(){

     this.shader.setUniformsValues({uSampler3: 2});
     this.shader.setUniformsValues({uSampler2: 0});
     this.shader.setUniformsValues({normScale: 1});



   };

   display(){

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
   }

};

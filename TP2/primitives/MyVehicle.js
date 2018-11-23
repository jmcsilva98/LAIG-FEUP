class MyVehicle extends CGFobject {
  constructor(scene, graph) {
    super(scene);
    this.graph = graph;
    this.head = new MySphere(this.scene, 3.5, 40, 40);
    this.upperBody = new Cylinder2(this.scene, this.graph, 1, 3, 10, 20, 8);
    this.lowerBody = new Cylinder2(this.scene, this.graph, 1, 1, 15, 20, 8);
    this.sphere = new MySphere(this.scene, 1.2, 40, 40);
    this.antenna = new Cylinder2(this.scene, this.graph, 1, 1, 4, 20, 8);


    this.body = new CGFappearance(this.scene);
    this.body.loadTexture("images/dragonfly.jpg");

    this.antennaT = new CGFappearance(this.scene);
    this.antennaT.loadTexture("images/antenna.jpeg");

    this.headT = new CGFappearance(this.scene);
    this.headT.loadTexture("images/head.jpg");

    this.wingPoints = [
      [
        [-0.5, 0, 2, 1],
        [-0.5, 0, -2, 0.6]
      ],
      [
        [0, 0, 2, 1],
        [0, 0, -2.5, 0.6]
      ],
      [
        [0.5, 0, 2, 1],
        [0.5, 0, -2, 0.6]
      ]
    ];


    this.wing = new MyPatch(this.scene, 3, 2, 20, 20, this.wingPoints);


    this.initBuffers();
  };



  initBuffers() {


  };

  display() {
    // Display of the head of the dragonfly
    this.scene.pushMatrix();
    this.headT.apply();
    this.head.display();
    this.scene.popMatrix();

    // Display of the upperBody of the dragonfly
    this.scene.pushMatrix();
    this.scene.translate(0, 0, 3.5);
    this.body.apply();
    this.upperBody.display();
    this.scene.popMatrix();

    // Display of the lowerBody of the dragonfly
    this.scene.pushMatrix();
    this.scene.translate(0, 0, 11);
    this.lowerBody.display();
    this.scene.popMatrix();

    // Display of the tail of the dragonfly
    this.scene.pushMatrix();
    this.scene.translate(0, 0, 18.84);
    this.antennaT.apply();
    this.sphere.display();
    this.scene.popMatrix();

    // Display of the left side upper wing of the dragonfly
    this.scene.pushMatrix();
    this.scene.translate(-4, 1, 5);
    this.scene.scale(2, 2, 2);
    this.scene.rotate(Math.PI / 2, 0, 1, 0);
    this.scene.rotate(Math.PI / 8, 1, 0, 0);
    this.wing.display();
    this.scene.popMatrix();

    // Display of the right side lower wing of the dragonfly
    this.scene.pushMatrix();
    this.scene.rotate(Math.PI, 0, 0, 1);
    this.scene.scale(2, 2, 2);
    this.scene.translate(-2, -0.5, 2.5);
    this.scene.rotate(Math.PI / 2, 0, 1, 0);
    this.scene.rotate(-Math.PI / 8, 1, 0, 0);
    this.wing.display();
    this.scene.popMatrix();

    // Display of the right side upper wing of the dragonfly
    this.scene.pushMatrix();
    this.scene.translate(4, 1, 5);
    this.scene.scale(2, 2, 2);
    this.scene.rotate(-Math.PI / 2, 0, 1, 0);
    this.scene.rotate(Math.PI / 8, 1, 0, 0);
    this.wing.display();
    this.scene.popMatrix();

    // Display of the left side lower wing of the dragonfly
    this.scene.pushMatrix();
    this.scene.rotate(Math.PI, 0, 0, 1);
    this.scene.scale(2, 2, 2);
    this.scene.translate(2, -0.5, 2.5);
    this.scene.rotate(-Math.PI / 2, 0, 1, 0);
    this.scene.rotate(-Math.PI / 8, 1, 0, 0);
    this.wing.display();
    this.scene.popMatrix();

    // Display of the left side antenna of the dragonfly
    this.scene.pushMatrix();
    this.scene.rotate(Math.PI / 4, 1, 0, 0);
    this.scene.rotate(-Math.PI / 4, 0, 1, 0);
    this.scene.translate(1, 1.2, -3.8);
    this.scene.scale(0.25, 0.25, 1);
    this.antennaT.apply();
    this.antenna.display();
    this.scene.popMatrix();

    // Display of the right side antenna of the dragonfly
    this.scene.pushMatrix();
    this.scene.rotate(Math.PI / 4, 1, 0, 0);
    this.scene.rotate(Math.PI / 4, 0, 1, 0);
    this.scene.translate(-1, 1.2, -3.8);
    this.scene.scale(0.25, 0.25, 1);
    this.antenna.display();
    this.scene.popMatrix();

    // Display of the left side antenna sphere of the dragonfly
    this.scene.pushMatrix();
    this.scene.translate(-4.9, 3.4, -1.65);
    this.scene.scale(0.35, 0.35, 0.35);
    this.sphere.display();
    this.scene.popMatrix();

    // Display of the left side antenna sphere of the dragonfly
    this.scene.pushMatrix();
    this.scene.translate(4.9, 3.4, -1.65);
    this.scene.scale(0.35, 0.35, 0.35);
    this.sphere.display();
    this.scene.popMatrix();

  }
  updateTexCoords(length_s, length_t) {

  }
};

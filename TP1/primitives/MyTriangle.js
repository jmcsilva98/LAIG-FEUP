/**
 * MyTriangle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyTriangle extends CGFobject {
  constructor(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
    super(scene);
    this.p1 = [x1, y1, z1];
    this.p2 = [x2, y2, z2];
    this.p3 = [x3, y3, z3];
    this.initBuffers();
  };

  initBuffers() {

    this.vertices = [
      this.p1[0], this.p1[1], this.p1[2],
      this.p2[0], this.p2[1], this.p2[2],
      this.p3[0], this.p3[1], this.p3[2]
    ];

    this.indices = [
      0, 1, 2,

    ];

    var x = ((this.p2[1] - this.p1[1]) * (this.p3[2] - this.p1[2]) - (this.p2[2] - this.p1[2]) * (this.p3[1] - this.p1[1])) / Math.sqrt(Math.pow((this.p2[1] - this.p1[1]) * (this.p3[2] - this.p1[2]) - (this.p2[2] - this.p1[2]) * (this.p3[1] - this.p1[1]), 2) + Math.pow((this.p2[2] - this.p1[2]) * (this.p3[0] - this.p1[0]) - (this.p2[0] - this.p1[0]) * (this.p3[2] - this.p1[2]), 2) + Math.pow((this.p2[0] - this.p1[0]) * (this.p3[1] - this.p1[1]) - (this.p2[1] - this.p1[1]) * (this.p3[0] - this.p1[0]), 2));
    var y = ((this.p2[2] - this.p1[2]) * (this.p3[0] - this.p1[0]) - (this.p2[0] - this.p1[0]) * (this.p3[2] - this.p1[2])) / Math.sqrt(Math.pow((this.p2[1] - this.p1[1]) * (this.p3[2] - this.p1[2]) - (this.p2[2] - this.p1[2]) * (this.p3[1] - this.p1[1]), 2) + Math.pow((this.p2[2] - this.p1[2]) * (this.p3[0] - this.p1[0]) - (this.p2[0] - this.p1[0]) * (this.p3[2] - this.p1[2]), 2) + Math.pow((this.p2[0] - this.p1[0]) * (this.p3[1] - this.p1[1]) - (this.p2[1] - this.p1[1]) * (this.p3[0] - this.p1[0]), 2));
    var z = ((this.p2[0] - this.p1[0]) * (this.p3[1] - this.p1[1]) - (this.p2[1] - this.p1[1]) * (this.p3[0] - this.p1[0])) / Math.sqrt(Math.pow((this.p2[1] - this.p1[1]) * (this.p3[2] - this.p1[2]) - (this.p2[2] - this.p1[2]) * (this.p3[1] - this.p1[1]), 2) + Math.pow((this.p2[2] - this.p1[2]) * (this.p3[0] - this.p1[0]) - (this.p2[0] - this.p1[0]) * (this.p3[2] - this.p1[2]), 2) + Math.pow((this.p2[0] - this.p1[0]) * (this.p3[1] - this.p1[1]) - (this.p2[1] - this.p1[1]) * (this.p3[0] - this.p1[0]), 2));

    this.normals = [
      x, y, z,
      x, y, z,
      x, y, z,
    ];


    this.texCoords = [
      0, 1, //this.minS, this.maxT,
      1, 1, //this.maxS, this.maxT,
      0, 0, //this.minS, this.minT,
      1, 0 //this.maxS, this.minT
    ];
    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  };

  updateTexCoords(length_s, length_t) {
    this.length_s = length_s;
    this.length_t = length_t;

    this.b = Math.sqrt((this.p1[0] - this.p3[0]) * (this.p1[0] - this.p3[0]) +
      (this.p1[1] - this.p3[1]) * (this.p1[1] - this.p3[1]) +
      (this.p1[2] - this.p3[2]) * (this.p1[2] - this.p3[2]));

    this.c = Math.sqrt((this.p2[0] - this.p1[0]) * (this.p2[0] - this.p1[0]) +
      (this.p2[1] - this.p1[1]) * (this.p2[1] - this.p1[1]) +
      (this.p2[2] - this.p1[2]) * (this.p2[2] - this.p1[2]));

    this.a = Math.sqrt((this.p3[0] - this.p2[0]) * (this.p3[0] - this.p2[0]) +
      (this.p3[1] - this.p2[1]) * (this.p3[1] - this.p2[1]) +
      (this.p3[2] - this.p2[2]) * (this.p3[2] - this.p2[2]));


    this.cosB = (this.a * this.a - this.b * this.b + this.c * this.c) / (2 * this.a * this.c);
    this.beta = Math.acos(this.cosB);


    this.texCoords = [
      0, 0,
      this.c / this.length_s, 0,
      (this.c - this.a * Math.cos(this.beta)) / this.length_s, (this.a * Math.sin(this.beta)) / this.length_t,
    ];


    this.updateTexCoordsGLBuffers();

  };
};

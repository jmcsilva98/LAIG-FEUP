/**
 * CylinderWithNoCover
 * @param scene CGFscene where the Cylinder will be displayed
 * @param slices ammount of slices the Cylinder will be divided into along it's perimeter
 * @param stacks ammount of stacks the Cylinder will be divided along it's height
 * @param base radius of the bottom base of the cylinder
 * @param top radius of the top base of the cylinder
 * @constructor
 */
class MyOpenCylinder extends  CGFobject {
	constructor(scene, base, top, height, slices, stacks){
    super(scene)
    this.slices = slices;
    this.stacks = stacks;
    this.base = base;
    this.top = top;

    this.initBuffers();
};



/**
 * Initializes the CylinderWithNoCover buffers (vertices, indices, normals and texCoords)
 */
	initBuffers () {
    this.vertices = [];
    this.normals = [];
    this.indices = [];
    this.originalTexCoords = [];

    var step_angle= 1 / this.slices;
    var step_stack = 1 / this.stacks;
    var xCoord = 0;
    var yCoord = 0;
    var ang = (2 * Math.PI) / this.slices;
    var zCoord = 0;
    var zLength = 1 / this.stacks;
    var deltaRadius = (this.top - this.base) / this.stacks;
	var i, j,delta;
    for (i = 0; i <= this.stacks; i++) {
        delta = (deltaRadius * i) + this.base;
        for (j = 0; j < this.slices; j++) {
            this.vertices.push(delta * Math.cos(ang * j), delta * Math.sin(ang * j), zCoord);
            this.normals.push(delta * Math.cos(ang * j), delta * Math.sin(ang * j), zCoord);
            this.originalTexCoords.push(xCoord, yCoord);
            xCoord +=step_angle;
        }
        xCoord = 0;
        yCoord += step_stack;
        zCoord += zLength;
    }

    for (i = 0; i < this.stacks; i++) {
        for (j = 0; j < this.slices - 1; j++) {
            this.indices.push(i * this.slices + j, i * this.slices + j + 1, (i + 1) * this.slices + j);
            this.indices.push(i * this.slices + j + 1, (i + 1) * this.slices + j + 1, (i + 1) * this.slices + j);
        }

        this.indices.push(i * this.slices + this.slices - 1, i * this.slices, (i + 1) * this.slices + this.slices - 1);
        this.indices.push(i * this.slices, i * this.slices + this.slices, (i + 1) * this.slices + this.slices - 1);
    }

    this.texCoords = this.originalTexCoords.slice();

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};


updateTexCoords (s,t) {
    this.updateTexCoordsGLBuffers();
};
}
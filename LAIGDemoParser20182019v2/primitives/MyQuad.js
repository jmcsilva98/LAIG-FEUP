/**
 * MyTable
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyQuad extends CGFobject
{
	constructor(scene, x1, x2, y1, y2, minS=0, maxS=1, minT=0, maxT=1)
	{
		super(scene);
		this.x1=x1;
		this.x2=x2;
		this.y2=y2;
		this.y1=y1;
		this.minS = minS;
		this.maxS = maxS;
		this.minT = minT;
		this.maxT = maxT;
		this.initBuffers();
	};

	initBuffers()
	{

		this.vertices = [
				this.x1, this.y1, 0,
				this.x2, this.y1, 0,
				this.x1, this.y2, 0,
				this.x2, this.y2, 0
			];

			this.indices = [
				0, 1, 2,
				3, 2, 1

			];

		this.primitiveType=this.scene.gl.TRIANGLES;

		this.normals = [
					0, 0, 1,
					0, 0, 1,
					0, 0, 1,
					0, 0, 1
					];


		this.texCoords = [
			this.minS, this.maxT,
			this.maxS, this.maxT,
			this.minS, this.minT,
			this.maxS, this.minT

		];

		this.initGLBuffers();
	};

	updateTexCoords(length_s,length_t){
	 var minS = 0;
     var minT = 0;
     var maxS = (this.maxS - this.minS) / length_s;
     var maxT = (this.maxT- this.minT) /length_t;

     this.texCoords = [
         minS, maxT,
         maxS, maxT,
         minS, minT,
         maxS, minT
     ];

     this.updateTexCoordsGLBuffers();
	};
};

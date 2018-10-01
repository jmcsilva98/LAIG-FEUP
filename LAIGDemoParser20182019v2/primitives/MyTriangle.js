/** 
 * MyTriangle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyTriangle extends CGFobject
{ 
	constructor(scene, minS, maxS, minT, maxT) 
	{
		super(scene);
		this.minS = minS;
		this.maxS = maxS;
		this.minT = minT;
		this.maxT = maxT;
		this.initBuffers();
	};

	initBuffers() 
	{
		
		this.vertices = [
				0,0,0,
				0,0,1,
				0,1,0
				];

		this.indices = [
				0, 1, 2, 
                0,2,1
			];
			
		this.texCoords = [
				1,1,
				0,1
		];
			
		this.primitiveType=this.scene.gl.TRIANGLES;

		this.normals = [
					1, 0, 0,
					1, 0, 0,
					1,0,0				
					];
		

		this.texCoords = [
			this.minS, this.maxT,
			this.maxS, this.maxT,
			this.minS, this.minT,
			this.maxS, this.minT,

		];
		
		this.initGLBuffers();
	};
};

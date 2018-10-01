

class MyClockHand extends CGFobject
{
    constructor (scene, scaleX, scaleY)
    {
        super(scene);
        this.angle = 0;
        this.hand = new MyUnitCubeQuad (scene,0,1,0,1);
        this.scaleX = scaleX;
        this.scaleY = scaleY;

        this.initBuffers();
    }

    display()
    {
        this.scene.pushMatrix();
        this.scene.translate (7,7.2,0.5);
        this.scene.rotate (-this.angle*Math.PI/180,0,0,1);
        this.scene.translate(0,this.scaleY/2,0);
        this.scene.scale (this.scaleX,this.scaleY,0.05);
       // this.scene.translate (7,7.4,0.5);
       
        this.hand.display();  
        this.scene.popMatrix();
    }

    addAngle (angle)
    {
        this.angle += angle;    
    }
    
    setAngle(angle)
    {
        this.angle = angle;
    }
} 
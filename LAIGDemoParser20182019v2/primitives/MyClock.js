

class MyClock extends CGFobject
{
    constructor (scene)
    {
        super(scene);
        this.cylinder = new MyCylinder (this.scene,12,1);
        this.cylinder.initBuffers();
        this.front = new MyDisc (this.scene,12);
        this.lastTime = 0;

        this.hoursHand = new MyClockHand (this.scene, 0.05, 0.3);
        this.hoursHand.setAngle (90);
        this.minsHand = new MyClockHand (this.scene, 0.035, 0.4);
        this.minsHand.setAngle(180);
        this.secHand = new MyClockHand (this.scene, 0.015, 0.4); 
        this.secHand.setAngle (270);

    }

    display()
    {
        	
        this.scene.pushMatrix();
        this.scene.translate (7,7.2,0);
        this.scene.scale (0.5,0.5,0.5);
        this.cylinder.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate (7,7.2,0);
        this.scene.scale (0.5,0.5,0.5);
        this.scene.clockAppearance.apply();
        this.front.display();
        this.scene.popMatrix();
        
        this.hoursHand.display();
        this.minsHand.display();
        this.secHand.display();
    }

    update (currTime)
    {
            var diff = (currTime - this.lastTime)/1000;
            this.lastTime = currTime;
 //       if ( ( (currTime/100) % 10 )  == 0)
   
 //               console.log (diff);
            this.secHand.addAngle (diff/60 * 360);
            this.minsHand.addAngle (diff/60/60 * 360);
            this.hoursHand.addAngle (diff/3600 * 360);
            this.lastTime = currTime;


     }
};
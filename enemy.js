class Enemy{
    constructor(pos, speed, rot){
        this.position = pos;
        this.speed = speed;
        this.rotation = rot;
    }

    updatePosition(targetpos){
        var vecdir = Victor(this.position.x,this.position.y);
        vecdir.subtract(targetpos).normalize();
        vecdir.multiply(Victor(this.speed, this.speed));
        this.position = this.position.subtract(vecdir);
        //console.log(this.position+ " "+ targetpos);
    }

    updateRotation(object){
        this.rotation = rot;
    }
}
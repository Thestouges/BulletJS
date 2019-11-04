class Enemy{
    constructor(pos, speed, vector, rot){
        this.position = pos;
        this.speed = speed;
        this.direction = vector;
        this.rotation = rot;
    }

    updatePosition(){
        var vecdir = this.direction;
        vecdir.multiply(Victor(this.speed, this.speed));
        this.position = this.position.add(vecdir);
        this.direction.normalize();
    }

    updateRotation(object){
        this.rotation = rot;
    }
}
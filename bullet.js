class Bullet{
    constructor(x, y, speed, vector){
        this.position = Victor(x, y);
        this.speed = speed;
        this.direction = Victor.fromObject(vector).normalize();
    }

    updatePosition(){
        var vecdir = this.direction;
        vecdir.multiply(Victor(this.speed, this.speed));
        this.position = this.position.add(vecdir);
        this.direction.normalize();
    }
}
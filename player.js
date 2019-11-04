class Player{
    constructor(pos, speed, deg){
        this.position = pos;
        this.speed = speed;
        this.rotation = deg;
    }

    movePlayerPos(movement){
        this.position.x += movement.x;
        this.position.y += movement.y;
    }

    updatePlayerPos(pos){
        this.position = pos;
    }

    updateRotation(deg){
        this.rotation = deg;
    }
}
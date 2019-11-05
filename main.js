var canvas;
var context;
var arenaSize = 150;
var bullets;
var centedsr;
var bulletspeed = 10;
var bulletsize = 5;

var lines;

var player;
var playersize = 50;

var enemies;
var enemySpawnDistance = 250;
var enemySpeed = 1;
var enemySize = 50;

var keyStack;

var mousePos;

function initialize(){
    canvas = document.getElementById('myCanvas');
    context = canvas.getContext("2d");
    context.lineWidth = 1;

    bullets = [];
    lines = [];
    enemies = [];

    mousePos = new Victor(0,0);

    SetMovementKeys();

    var linetofromcenter = Victor(0,0);
    lines.push(linetofromcenter);

    setInterval(redraw, 10);
    setInterval(spawnEnemy, 1000);

    getCurrentCenter();
    initializePlayer();

    window.addEventListener('resize', getCurrentCenter);
    canvas.addEventListener('mousemove', updatePlayer);
    window.addEventListener("keydown", keyboardDownEvent);
    window.addEventListener("keyup", keyboardUpEvent);
    canvas.addEventListener('click', FireBullet, false);
}

function SetMovementKeys(){
    keyStack = new Object();
    keyStack['a'] = false;
    keyStack['d'] = false;
    keyStack['s'] = false;
    keyStack['w'] = false;
}

function keyboardDownEvent(e){
    var keyCode = e.key;

    if(keyCode == 'a' || keyCode == 'A'){
        keyStack['a'] = true;
    }
    if(keyCode == 'd' || keyCode == 'D'){
        keyStack['d'] = true;
    }
    if(keyCode == 'w' || keyCode == 'W'){
        keyStack['w'] = true;
    }
    if(keyCode == 's' || keyCode == 'S'){
        keyStack['s'] = true;
    }
}

function keyboardUpEvent(e){
    var keyCode = e.key;

    if(keyCode == 'a' || keyCode == 'A'){
        keyStack['a'] = false;
    }
    if(keyCode == 'd' || keyCode == 'D'){
        keyStack['d'] = false;
    }
    if(keyCode == 'w' || keyCode == 'W'){
        keyStack['w'] = false;
    }
    if(keyCode == 's' || keyCode == 'S'){
        keyStack['s'] = false;
    }
}

function updatePlayerRotation(){
    var linetofromcenter = Victor(mousePos.x,mousePos.y);
    var playerRot = new Victor(linetofromcenter.x, linetofromcenter.y);
    playerRot.subtract(player.position);
    player.updateRotation(playerRot.horizontalAngleDeg()* Math.PI / 180);
}

function updatePlayer(e){
    
    var mousepos = getMousePos(canvas,e);
    mousePos.x = mousepos.x;
    mousePos.y = mousepos.y;

    var linetofromcenter = Victor(mousepos.x,mousepos.y);
    lines[0] = linetofromcenter;

    var playerRot = new Victor(linetofromcenter.x, linetofromcenter.y);
    playerRot.subtract(player.position);
    player.updateRotation(playerRot.horizontalAngleDeg()* Math.PI / 180);
    //console.log(playerRot.horizontalAngleDeg() + " : " + linetofromcenter.toString());
    
}

function initializePlayer(){
    player = new Player(new Victor(center.x,center.y),50,0);
    //alert(center.x+" " +player.position.x+" "+player.position.y);
}

function drawPlayer(){
    context.beginPath();
    context.save();
    //context.rect(player.position.x-playersize/2,player.position.y-playersize/2,playersize,playersize);
    context.translate(player.position.x,player.position.y);
    //console.log(player.rotation);
    context.rotate(player.rotation);
    context.translate(-player.position.x,-player.position.y);
    context.rect(player.position.x-playersize/2,player.position.y-playersize/2,playersize,playersize);
    context.stroke();
    context.restore();

    context.beginPath();
    context.arc(player.position.x,player.position.y,playersize/2,0,2*Math.PI);
    context.stroke();
}

function redraw(){
    getCurrentCenter();
    movePlayer();
    updatePlayerRotation();
    checkPlayerPositionInArena();
    clearCanvas();
    drawArena();
    drawPlayer();
    drawEnemies();
    DrawUpdateBullets();
    DestroyBullets();
    drawTestLine();
}

function drawTestLine(){
    context.beginPath();
    context.moveTo(canvas.width, 0);
    context.lineTo(0, canvas.height);
    context.stroke();

    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(canvas.width, canvas.height);
    context.stroke();
}

function movePlayer(){
    if(keyStack['a']){
        player.movePlayerPos(new Victor(-1,0));
    }
    if(keyStack['d']){
        player.movePlayerPos(new Victor(1,0));
    }
    if(keyStack['s']){
        player.movePlayerPos(new Victor(0,1));
    }
    if(keyStack['w']){
        player.movePlayerPos(new Victor(0,-1));
    }
}

function getCurrentCenter(){
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
    center = Victor(canvas.width/2,canvas.height/2);
}

function drawArena(){
    context.beginPath();
    context.arc(center.x,center.y,arenaSize,0,2*Math.PI);
    context.stroke();
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);

}

function FireBullet(e){
    var mousepos = getMousePos(canvas, e);
    var bullet = new Bullet(player.position.x,player.position.y,bulletspeed,Victor(-(player.position.x - mousepos.x), -(player.position.y - mousepos.y)));
    var index = bullets.push(bullet);
}

function DrawUpdateBullets(){
    bullets.forEach(element => {
        
        context.beginPath();
        context.arc(element.position.x,element.position.y,bulletsize,0,2*Math.PI);
        context.stroke();

        element.updatePosition();
    });

    lines.forEach(element =>{
        context.beginPath();
        context.moveTo(player.position.x, player.position.y);
        context.lineTo(element.x, element.y);
        context.stroke();
    });
}

function DestroyBullets(){
    for(var i = 0; i < bullets.length; i++){
        if(bullets[i].position.x < 0 || bullets[i].position.y < 0
            || bullets[i].position.x > canvas.width || bullets[i].position.y > canvas.height){
                bullets.splice(i,1);
        }
    }
}

function checkPlayerPositionInArena(){
    var radius = arenaSize - playersize/2;
    var centerPosition = new Victor(center.x, center.y); 
    var newLocation = new Victor(player.position.x,player.position.y);
    var distance = newLocation.distance(centerPosition);
    
    if (distance > radius)
    {
        var fromOriginToObject = newLocation.subtract(centerPosition);
        fromOriginToObject.x *= (radius / distance);
        fromOriginToObject.y *= (radius / distance);
        newLocation = centerPosition.add(fromOriginToObject);
        player.updatePlayerPos(newLocation);
    }
}

function spawnEnemy(){
    var posx = Math.random()*2 - 1;
    var posy = Math.random()*2 - 1;

    var normVec = new Victor(posx, posy);
    normVec.normalize();

    normVec.multiply(Victor(enemySpawnDistance, enemySpawnDistance))

    console.log(normVec.toString());

    enemies.push(new Enemy(normVec,enemySpeed,0,0));
}

function drawEnemies(){
    enemies.forEach(element => {
        context.beginPath();
        context.save();
        //context.rect(player.position.x-playersize/2,player.position.y-playersize/2,playersize,playersize);
        context.translate(canvas.width/2+enemySize/2,canvas.height/2+enemySize/2);
        //console.log(player.rotation);
        //context.rotate(player.rotation);
        //context.translate(-player.position.x,-player.position.y);
        context.arc(element.position.x-enemySize/2,element.position.y-enemySize/2,enemySize,0,2*Math.PI);
        context.stroke();
        context.restore();
    });
}
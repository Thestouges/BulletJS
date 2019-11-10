var canvas;
var context;
var arenaSize = 150;
var bullets;
var centedsr;
var bulletspeed = 8;
var bulletsize = 5;

var lines;

var player;
var playersize = 50;
var playerSpeed = 2;

var enemies;
var enemySpawnDistance;
var enemySpeed = 1;
var enemySize = 50;
var enemylimit = 30;

var keyStack;

var mousePos;

var timerInterval = [];

function initialize(){
    initializeGame();
    setTimerInvervals();
    setEventListeners()
}

function initializeGame(){
    canvas = document.getElementById('myCanvas');
    context = canvas.getContext("2d");
    context.translate(canvas.width/2, canvas.height/2);

    context.lineWidth = 1;

    bullets = [];
    lines = [];
    enemies = [];

    mousePos = new Victor(0,0);

    SetMovementKeys();

    var linetofromcenter = Victor(0,0);
    lines.push(linetofromcenter);

    getCurrentCenter();
    initializePlayer();

    enemySpawnDistance = Math.max(canvas.height, canvas.width);
    //spawnEnemy();
}

function setEventListeners(){
    window.addEventListener('resize', getCurrentCenter);
    canvas.addEventListener('mousemove', updatePlayer);
    window.addEventListener("keydown", keyboardDownEvent);
    window.addEventListener("keyup", keyboardUpEvent);
    canvas.addEventListener('click', FireBullet, false);
}

function setTimerInvervals(){
    setInterval(redraw, 10);
    setInterval(spawnEnemy, 1000);
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
    player = new Player(new Victor(0,0),playerSpeed,0);
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
    //console.log(player.position);
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
    updateEnemies();
    DrawUpdateBullets();
    DestroyBullets();
    checkPlayerCollision();
    //drawTestLine();
}

function drawTestLine(){
    context.beginPath();
    context.moveTo(-canvas.width, canvas.height);
    context.lineTo(canvas.width, -canvas.height);
    context.stroke();

    context.beginPath();
    context.moveTo(canvas.width, canvas.height);
    context.lineTo(-canvas.width, -canvas.height);
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

    context.translate(center.x, center.y);
}

function drawArena(){
    context.beginPath();
    context.arc(0,0,arenaSize,0,2*Math.PI);
    context.stroke();
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: ((evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width) - canvas.width/2,
        y: ((evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height) - canvas.height/2
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
        if(bullets[i].position.x < -canvas.width/2 || bullets[i].position.y < -canvas.height/2
            || bullets[i].position.x > canvas.width/2 || bullets[i].position.y > canvas.height/2){
                bullets.splice(i,1);
                i--;
                continue;
        }

        for(var j = 0; j < enemies.length; j++){
            if(CheckIntersection(bulletsize, bullets[i].position, enemySize, enemies[j].position)){
                bullets.splice(i,1);
                enemies.splice(j,1);
                i--;
                break;
            }
        }
    }
}

function CheckIntersection(object1Size, object1Pos, object2Size, object2Pos){
    var radius = object2Size/2 + object1Size/2;
    var centerPosition = new Victor(object1Pos.x, object1Pos.y); 
    var newLocation = new Victor(object2Pos.x,object2Pos.y);
    var distance = newLocation.distance(centerPosition);

    //console.log(distance+";"+radius);
    //console.log(object1Pos+";"+object2Pos);

    if(distance <= radius){
        return true;
    }
    else{
        return false;
    }
}

function checkPlayerPositionInArena(){
    var radius = arenaSize - playersize/2;
    var centerPosition = new Victor(0, 0); 
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
    if(enemies.length >= enemylimit){
        return;
    }
    
    var posx = Math.random()*2 - 1;
    var posy = Math.random()*2 - 1;
    
    var normVec = new Victor(posx, posy);
    normVec.normalize();

    normVec.multiply(Victor(enemySpawnDistance, enemySpawnDistance))

    //console.log(normVec.toString());

    enemies.push(new Enemy(normVec,enemySpeed,0));
    //console.log(enemies[0].position);
}

function drawEnemies(){
    //console.log(enemies[0].position);
    enemies.forEach(element => {
        //console.log(element.position);
        context.beginPath();
        context.arc(element.position.x,element.position.y,enemySize/2,0,2*Math.PI);
        context.stroke();
        
        //context.save();
        context.beginPath();
        context.moveTo(element.position.x, element.position.y);
        context.lineTo(player.position.x,player.position.y);
        context.stroke();
        
    });
}

function updateEnemies(){
    enemies.forEach(element => {
        //console.log("pos:"+element.position);
        element.updatePosition(new Victor(player.position.x, player.position.y));
    });
}

function checkPlayerCollision(){
    for(var j = 0; j < enemies.length; j++){
        //console.log(player.position + ";"+enemies[j].position)
        if(CheckIntersection(playersize, player.position, enemySize, enemies[j].position )){
            initializeGame();
            //enemies.splice(j,1);
        }
    }
}
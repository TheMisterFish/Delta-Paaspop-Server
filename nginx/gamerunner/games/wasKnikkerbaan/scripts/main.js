
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Common = Matter.Common,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Events = Matter.Events,
    Body = Matter.Body,
    Constraint = Matter.Constraint;


// create engine
var engine = Engine.create(),
    world = engine.world;

var gameWindow = document.getElementById("game");
var Width = gameWindow.clientWidth;
var Height = gameWindow.clientHeight;

// create renderer
var render = Render.create({
    element: document.getElementById("game"),
    engine: engine,
    options: {
        width: Width,
        height: Height,
        showAngleIndicator: false,
        wireframes: false,
        hasBounds: true,
        background: "#01014b"
    }
});

Render.run(render);

// create runner
var runner = Runner.create();


//Create world borders
// Screen X,Y is in the center.
// Matter.Bodies.rectangle( x, y, width, height,[options])
var bottom = Bodies.rectangle(0, Height, Width * 2 + 20, 20, { isStatic: true , render :{fillStyle: "#01014b"} });
World.add(world, [
    //Top
    Bodies.rectangle(0, -Height, Width * 2 + 20, 20, { isStatic: true , render :{fillStyle: "#01014b"}}),
    //Bottom
    bottom,
    //Left
    Bodies.rectangle(-Width, 0, 20, Height * 2, { isStatic: true , render :{fillStyle: "#01014b"} }),
    //Right
    Bodies.rectangle(Width, 0, 20, Height * 2, { isStatic: true , render :{fillStyle: "#01014b"} })
]);


// Create Starting Storage Unit
// Screen X,Y is in the center.
// Matter.Bodies.rectangle( x, y, width, height,[options])
var gate = Bodies.rectangle(0, -Height + 160, 200, 20, { isStatic: true, render: { fillStyle: "##FE0000" } });
World.add(world, [
    //Left Holder
    Bodies.rectangle(-150, -Height + 85, 200, 20, { isStatic: true, angle: Math.PI * 0.3 ,render: { fillStyle: "#FFFFFF" } }),
    //Right Holder
    Bodies.rectangle(150, -Height + 85, 200, 20, { isStatic: true, angle: -Math.PI * 0.3 ,render: { fillStyle: "#FFFFFF" } }),
    //Gate
    gate
]);


//Create Finish
var finish = Bodies.rectangle(0, Height - 195, 500, 20, { isStatic: true, isSensor: true, render: { sprite: { texture: "textures/finish.jpg", yScale: 0.2, xScale: 0.8 }} })
World.add(world, [
    //Left Holder
    Bodies.rectangle(-150, Height - 95, 250, 20, { isStatic: true, angle: Math.PI * 0.3 ,render: { fillStyle: "#FFFFFF" } }),
    //Right Holder
    Bodies.rectangle(150, Height - 95, 250, 20, { isStatic: true, angle: -Math.PI * 0.3 ,render: { fillStyle: "#FFFFFF" } }),
    //Gate
    finish,
    //Bottom catcher
    Bodies.rectangle(0, Height - 10, 200, 40, { isStatic: true ,render: { fillStyle: "#FFFFFF" } })
]);


//Creating track objects


//Upper divider
World.add(world, [
    Bodies.rectangle(-120, -Height + 400, 300, 20, { isStatic: true, angle: -Math.PI * 0.2 ,render: { fillStyle: "#FFFFFF" }}),
    Bodies.rectangle(120, -Height + 400, 300, 20, { isStatic: true, angle: Math.PI * 0.2 ,render: { fillStyle: "#FFFFFF" }}),
]);

//middle divider
World.add(world, [
    Bodies.rectangle(-300, -Height + 700, 260, 20, { isStatic: true, angle: -Math.PI * -0.2 ,render: { fillStyle: "#FFFFFF" }}),
    Bodies.rectangle(300, -Height + 700, 260, 20, { isStatic: true, angle: Math.PI * -0.2 ,render: { fillStyle: "#FFFFFF" }}),
]);

//rotating component

var rotatingbody = Bodies.rectangle(-400, -Height + 800, 333, 20, {render:{fillStyle:"#ffe600"}});

var constraint = Constraint.create({
    pointA: { x: 0, y: -Height + 800 },
    bodyB: rotatingbody,
        length: 0
    });
    
World.add(world, [rotatingbody, constraint]);

//Circle bottom
World.add(world, [
    Bodies.circle(-180, -Height + 1050, 50, { isStatic: true, render:{fillStyle:"#FF00FE"} }),
    Bodies.circle(0, -Height + 1050, 50, { isStatic: true, render:{fillStyle:"#FF00FE"} }),
    Bodies.circle(180, -Height + 1050, 50, { isStatic: true, render:{fillStyle:"#FF00FE"} }),
    // Bodies.circle(-150, -Height + 1100, 50, { isStatic: true }),
    // Bodies.circle(150, -Height + 1100, 50, { isStatic: true }),

])

// fit the render viewport to the scene
Render.lookAt(render, Composite.allBodies(world));


//Finish collision event detector.
//When an non static objects collides with a sensort object it checks which body is the finished object to determine which object collided with it.
Events.on(engine, 'collisionStart', function (event) {
    var pairs = event.pairs;

    for (var i = 0, j = pairs.length; i != j; ++i) {
        var pair = pairs[i];

        //Check if marble hit the finish object
        if (pair.bodyA === finish) {
            marbleFinished(pair.bodyB)
        } else if (pair.bodyB === finish) {
            marbleFinished(pair.bodyA);
        }
        //Check if marble hit the bottom object
        else if (pair.bodyA === bottom) {
            resetMarbleToOrignalPosition(pair.bodyB)
        }
        else if (pair.bodyB === bottom) {
            resetMarbleToOrignalPosition(pair.bodyB)
        }
    }
});


function startGameEngine()
{
    Runner.run(runner, engine);
}

function stopGameEngine()
{
    Runner.stop(runner, engine);
}
import css from '../css/styles.css';

import {World, Vec2, Edge, Box, DistanceJoint} from 'planck-js';

console.log("whatevs");
console.log("whatevs2");


const world = new World(Vec2(0, -10));


const ground = world.createBody();
ground.createFixture(Edge(Vec2(-40.0, 0.0), Vec2(40.0, 0.0)), 0.0);

const boxShape = Box(1, 1);

const bodyDef = {
    type: 'dynamic',
    position: Vec2(0, 5)
};

const box = world.createBody(bodyDef);
box.createFixture(boxShape, 5);


const jointDef = {
    frequencyHz: 2.0,
    dampingRatio: 0.2
};


const distanceJoint = DistanceJoint(jointDef,
    ground, Vec2(0, 10),
    box, box.getWorldPoint(Vec2(0, 0))
);

world.createJoint(distanceJoint);
distanceJoint.setLength(7);


var canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');


var camera = {
    pos: Vec2(0, 0),
    zoom: 10,
};

setInterval(() => {
    world.step(1 / 60);
    var p = box.getPosition();
    console.log(p);

    var bodyList = world.getBodyList();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    //ctx.translate(400, canvas.height);
    ctx.translate(canvas.width / 2 - (camera.pos.x * camera.zoom), canvas.height / 2 + (camera.pos.y * camera.zoom));
    ctx.scale(camera.zoom, -camera.zoom);


    drawRect(0, 0, 1, 1);
    drawRect(0, 30, 1, 1);
    drawRect(0, -30, 1, 1);
    drawRect(40, 0, 1, 1);
    drawRect(-40, 0, 1, 1);

    drawRect(p.x, p.y, 5, 5);

    var v = box.getFixtureList().getShape().m_vertices;

    ctx.restore();

}, 1000 / 30);

function drawRect(x, y, w, h) {
    ctx.fillRect(x - w / 2, y - h / 2, w, h);
}

document.getElementById('zoom').addEventListener('change', () => {
    camera.zoom = document.getElementById('zoom').value;
});
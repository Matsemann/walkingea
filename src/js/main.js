import css from '../css/styles.css';

import {World, Vec2, Edge, Box, DistanceJoint} from 'planck-js';
import Creature from './creature.js';

const world = new World(Vec2(0, -10));


var canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');


var camera = {
    pos: Vec2(5, 5.5),
    zoom: 50,
};

const grounds = [];
const creatures = [];

for (let i = 0; i < 4; i++) {
    let offset = (i % 4) * 3;
    creatures.push(new Creature('circle', world, getRandomColor(), offset));
}

for (let i = 0; i < 4; i++) {
    const g = world.createBody();
    g.createFixture(Edge(Vec2(-40.0, i * 3), Vec2(40.0, i * 3)), {density: 0, friction: 1.5});
    grounds.push(g);
}


var timePassed = 0;

setInterval(() => {

    creatures.forEach(c => c.update(timePassed));

    var max = 0;
    creatures.forEach(c => {
        const x = c.maxDst;
        if (x > max) {
            max = x;
        }
    });

    world.step(1 / 60);
    timePassed += 1 / 60;
    //var p = box.getPosition();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    //ctx.translate(400, canvas.height);
    ctx.translate(canvas.width / 2 - (camera.pos.x * camera.zoom), canvas.height / 2 + (camera.pos.y * camera.zoom));
    ctx.scale(camera.zoom, -camera.zoom);

    ctx.beginPath();
    ctx.lineWidth = .005;
    ctx.moveTo(0, -5);
    ctx.lineTo(0, 17);
    ctx.stroke();


    ctx.beginPath();
    ctx.lineWidth = .01;
    ctx.moveTo(max, -5);
    ctx.lineTo(max, 17);
    ctx.stroke();

    grounds.forEach((g, i) => {
        ctx.beginPath();
        ctx.lineWidth=.01;

        ctx.moveTo(-40, i * 3);
        ctx.lineTo(40, i * 3);
        ctx.stroke();
    });

    creatures.forEach(c => c.render(ctx));
    ctx.restore();

}, 1000 / 60);


function drawRect(x, y, w, h, a) {
    //ctx.fillRect(x - w / 2, y - h / 2, w, h);

    ctx.save();

    ctx.translate(x + w/2, y + h / 2);
    ctx.rotate(a);

    ctx.fillRect(0, - h, w, h);
    ctx.fillRect(- w / 2, - h / 2, w, h);

    ctx.restore();
}

document.getElementById('camerax').addEventListener('input', () => {
    camera.pos.x = document.getElementById('camerax').value;
});
/*
document.getElementById('length').addEventListener('input', () => {
    cr.update(document.getElementById('length').value);
});*/

function getRandomColor() {
    return {
        r: Math.floor(Math.random() * 255),
        g: Math.floor(Math.random() * 255),
        b: Math.floor(Math.random() * 255),
    }
}
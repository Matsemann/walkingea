import {World, Vec2, Edge, Box, DistanceJoint} from 'planck-js';
import Creature from './creature.js';

const nrGrounds = 4;
const groundsDistance = 3;
const simulationTime = 60000; // seconds
let finished = false;

const simFreq = 1 / 60;
let simulationIterations = 1;
let simulationTimeout = null;
let renderInterval = null;

let simulation = null;
let callback = null;


const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');

export function simulate(creatureType, phenotypes, cb) {
    simulation = new Simulation(creatureType, phenotypes);
    callback = cb;

    startSimulation();
    startRendering();
}

export function setSimulationIterations(nr) {
    simulationIterations = nr;
}

export function setCameraX(x) {
    simulation.camera.pos.x = x;
}

function startSimulation() {
    for (let i = 0; i < simulationIterations; i++) {
        if (!simulation.update()) {
            break;
        }
    }

    if (!finished) {
        simulationTimeout = setTimeout(startSimulation, 1000 * simFreq);
    }
}

function startRendering() {
    renderInterval = setInterval(() => {
        simulation.render();
    }, 1000 * simFreq);
}

function endSimulation() {
    finished = true;
    clearTimeout(simulationTimeout);
    clearInterval(renderInterval);

    callback("yoyo");
}

function simulationFinished() {
    endSimulation();
}


class Simulation {

    constructor(creatureType, phenotypes) {
        this.camera = {
            pos: Vec2(5, 5.5),
            zoom: 50,
        };

        this.world = new World(Vec2(0, -10));
        this.createGrounds();


        this.creatures = phenotypes.map((p, i) => {
            const offsett = (i % nrGrounds) * groundsDistance;
            // TODO use p
            return new Creature(creatureType, this.world, getRandomColor(), offsett);
        });
        this.timePassed = 0;

    }


    update() {
        this.timePassed += simFreq;

        if (this.timePassed >= simulationTime) {
         simulationFinished(); // TODO
         return false;
         }

        this.creatures.forEach(c => c.update(this.timePassed));

        this.world.step(simFreq);
        return true;
    }

    render() {
        const camera = this.camera;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillText(this.timePassed, 10, 10);

        ctx.save();

        ctx.translate(canvas.width / 2 - (camera.pos.x * camera.zoom),
            canvas.height / 2 + (camera.pos.y * camera.zoom));
        ctx.scale(camera.zoom, -camera.zoom);

        this.renderGrounds();
        this.renderMaxLine();

        this.creatures.forEach(c => c.render(ctx));


        ctx.restore();
    }

    renderGrounds() {
        this.grounds.forEach((g, i) => {
            ctx.beginPath();
            ctx.lineWidth = .01;

            ctx.moveTo(-40, i * groundsDistance);
            ctx.lineTo(100, i * groundsDistance);
            ctx.stroke();
        });
    }

    renderMaxLine() {
        var max = 0;
        this.creatures.forEach(c => {
            const x = c.maxDst;
            if (x > max) {
                max = x;
            }
        });

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
    }


    createGrounds() {
        this.grounds = [];
        for (let i = 0; i < nrGrounds; i++) {
            const g = this.world.createBody();
            g.createFixture(Edge(Vec2(-40.0, i * groundsDistance), Vec2(100.0, i * groundsDistance)),
                {density: 0, friction: 1.5});
            this.grounds.push(g);
        }

    }

}

function getRandomColor() {
    return {
        r: Math.floor(Math.random() * 255),
        g: Math.floor(Math.random() * 255),
        b: Math.floor(Math.random() * 255),
    }
}

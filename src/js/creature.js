import {World, Vec2, Edge, Box, DistanceJoint, Circle} from 'planck-js';

import defs from './creatureDefinitions.js';



export default class Creature {

    constructor(d, world, color, offset) {
        const definition = defs[d];

        this.color = color;
        this.bodies = [];
        this.joints = [];
        this.jointLengths = [];
        this.movements = [];

        this.maxDst = 0;


        const shape = Circle(.1);

        for (let i = 0; i < definition.points.length; i++) {
            const p = definition.points[i];
            const bodyDef = {
                type: 'dynamic',
                position: Vec2(p[0], p[1] + offset),
                linearDamping: .8,
                angularDamping: .5,
                fixedRotation: true
            };

            const fixtureDef = {
                density: 1,
                friction: 1000.5,
                restitution: 0,
                filterGroupIndex: -1
            };

            const body = world.createBody(bodyDef);
            body.createFixture(shape, fixtureDef);

            this.bodies.push(body);
        }

        const jointDef = {
            frequencyHz: 10.,
            dampingRatio: 8.8
        };

        for (let i = 0; i < definition.edges.length; i++) {
            const e = definition.edges[i];

            const joint = DistanceJoint(jointDef,
                this.bodies[e[0]], this.bodies[e[0]].getWorldPoint(Vec2(0, 0)),
                this.bodies[e[1]], this.bodies[e[1]].getWorldPoint(Vec2(0, 0))
            );
            world.createJoint(joint);
            this.joints.push(joint);
            this.jointLengths.push(joint.getLength());
            this.movements.push(Math.random());
            //this.movements.push(.2);
        }

        //this.movements[0] = 10;
    }

    update(time) {
        this.findMaxDst();

        for (let i = 0; i < this.joints.length; i++) {
            const j = this.joints[i];
            const l = this.jointLengths[i];
            const m = this.movements[i];

            var newL = (Math.sin(time * 10 * m + Math.PI / 2 + i*.7) + 1) / 4 + 0.5;

            j.setLength(l * newL);
        }

    }

    findMaxDst() {
        var dst = this.findDst();
        if (dst > this.maxDst) {
            this.maxDst = dst;
        }
    }

    findDst() {
        let max = 0;
        this.bodies.forEach(b => {
            const x = b.getPosition().x;
            if (x > max) {
                max = x;
            }
        });
        return max;
    }


    render(ctx) {
        this.bodies.forEach(b => {
            const c = this.color;
            ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, 0.8)`;

            const p = b.getPosition();
            const a = b.getAngle();
            ctx.beginPath();
            ctx.arc(p.x, p.y, .1, 0, 2 * Math.PI);
            ctx.fill();

            /*ctx.strokeStyle = 'blue';
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x * Math.cos(a) - (p.y + .1) * Math.sin(a), p.x * Math.sin(a) + (p.y + .1) * Math.cos(a));
            ctx.stroke();*/
        });

        this.joints.forEach(j => {
            const a = j.getBodyA().getPosition();
            const b = j.getBodyB().getPosition();

            const c = this.color;
            //ctx.strokeStyle = `rgba(${c.r}, ${c.g}, ${c.b}, 0.3)`;
            ctx.strokeStyle = `rgba(0, 0, 0, 0.6)`;
            ctx.lineWidth=.05;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
        })
    }


}

import css from '../css/styles.css';
import {simulate, setSimulationIterations, setCameraX} from './walkSimulator.js';



simulate('circle', [1, 2, 3, 4, 5], () => console.log("done"));
/*
document.getElementById('camerax').addEventListener('input', () => {
    camera.pos.x = document.getElementById('camerax').value;
});*/



document.getElementById('speedslider').addEventListener('input', () => {
    let value = document.getElementById('speedslider').value;
    setSimulationIterations(value);
    document.getElementById('speedslidervalue').value = value;
});
document.getElementById('cameraslider').addEventListener('input', () => {
    let value = document.getElementById('cameraslider').value;
    setCameraX(value);
    document.getElementById('cameraslidervalue').value = value;
});

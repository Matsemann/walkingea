import css from '../css/styles.css';
import {simulate, setSimulationIterations, setCameraX, endSimulation} from './walkSimulator.js';


function startSimulation() {
    endSimulation();
    const options = {
        mutationRate: parseFloat(document.getElementById('mutationslider').value),
        creatureType: document.getElementById('figure').value

    };
    console.log(options);
    simulate('circle', [1, 2, 3, 4, 5], () => console.log("done"));

}

startSimulation();

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
document.getElementById('mutationslider').addEventListener('input', () => {
    let value = document.getElementById('mutationslider').value;
    document.getElementById('mutationslidervalue').value = value;
});

document.getElementById('start').addEventListener('click', () => {
    startSimulation();
});

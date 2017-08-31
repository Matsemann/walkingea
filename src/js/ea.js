import Chart from 'chart.js';

let currentGeneration;
let chart;


export function runEa({generatePopulation, fitness, adultSelection, parentSelection, crossover, mutate}) {

    currentGeneration = 0;
    makeChart();
    debugInfo([{fitness: 0, genes: []}]);
    currentGeneration++;

    let population = generatePopulation();

    async function iteration() {
        await fitness(population);
        debugInfo(population);

        const parents = parentSelection(population);

        const children = [];

        for (let i = 0; i < parents.length; i += 2) {
            const parent1 = parents[i];
            const parent2 = parents[(i + 1) % parents.length];

            const child1 = copy(parent1);
            const child2 = copy(parent2);

            crossover(child1, child2);
            children.push(child1);
            children.push(child2);
        }

        children.forEach(c => mutate(c));

        population = adultSelection(population, children);
        currentGeneration++;
        setTimeout(iteration, 0);
    }

    iteration();
}

function copy(individual) {
    return {
        genes: individual.genes.slice(),
        fitness: 0
    };
}

function debugInfo(population) {
    let sum = 0;
    let max = -99999;
    let best = null;

    population
        .forEach(i => {
            const f = i.fitness;
            sum += f;
            if (f > max) {
                max = f;
                best = i;
            }
        });

    let avg = sum / population.length;


    document.getElementById("debugInfo").innerHTML = `<b>Generation: <b/>${currentGeneration}, <b>best fitness:</b>
        ${max.toFixed((2))}, <b>average:</b> ${avg.toFixed((2))}<br>
        Best: <input value="[${best.genes}]">`;

    chart.data.datasets[0].data.push(max);
    chart.data.datasets[1].data.push(avg);
    chart.data.labels.push(currentGeneration);
    chart.update();
}

var ctx = document.getElementById("graph");

function makeChart() {
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Max',
                    backgroundColor: '#7bff49',
                    borderColor: '#7bff49',
                    fill: false,
                    borderWidth: 2,
                    //data: [{x: 1, y:5}, {x: 2, y:5}, {x: 3, y:5}]
                    data: []
                }, {
                    label: 'Avg',
                    backgroundColor: '#6489ff',
                    borderColor: '#6489ff',
                    borderWidth: 2,
                    fill: false,
                    //data: [{x: 1, y:4}, {x: 1, y:3}, {x: 1, y:2}]
                    data: []
                }
            ]
        },
        options: {
            responsive: true,
            legend: {
                display: true,
                position: 'bottom'
            },
            scales: {
                xAxes: [
                    {
                        display: true,
                        ticks: {
                            suggestedMin: 50,
                            suggestedMax: 100
                        }
                    }
                ],
                yAxes: [
                    {
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Value'
                        }
                    }
                ]
            }

        }
    });

}


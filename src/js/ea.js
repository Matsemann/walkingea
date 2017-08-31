let currentGeneration = 1;


export function runEa({generatePopulation, fitness, adultSelection, parentSelection, crossover, mutate}) {

    currentGeneration = 1;
    debugInfo([0]);
    let population = generatePopulation();

    async function iteration() {
        await fitness(population);
        //console.log(fitnesses);
        //debugInfo(fitnesses);

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

function debugInfo(fitnesses) {
    let max = -99999;
    fitnesses.forEach(f => {
        if (f > max) {
            max = f;
        }
    });


    document.getElementById("debugInfo").innerHTML = `<b>Generation: <b/>${currentGeneration}, <b>Best fitness: </b>${max.toFixed(
        (2))}`;
}
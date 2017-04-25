let currentGeneration = 1;


export function runEa({generatePopulation, fitness, adultSelection, parentSelection, crossover, mutate}) {

    let population = generatePopulation();

    function iteration() {
        fitness(population, (fitnesses) => {
            console.log("finished fitness");
            console.log(fitnesses);
            const parents = parentSelection(population, fitnesses);

            const children = [];

            for (let i = 0; i < parents.length; i += 2) {
                const parent1 = parents[i];
                const parent2 = parents[i + 1];

                const child1 = copy(parent1);
                const child2 = copy(parent2);

                crossover(child1, child2);
                children.push(child1);
                children.push(child2);
            }

            children.forEach(c => mutate(c));

            population = children;

            iteration();
        });
    }

    iteration();


}

function copy(individual) {
    return individual.slice();
}
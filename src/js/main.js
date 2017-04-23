import { simulate } from './simulation.js';

/* Input parameters */
const populationSize = 20;
const numberOfGenes = 9; // 16 for circle, 9 for something
const mutationRate = 0.05;
const crossoverRate = 0.7;

let currentGeneration = 1;

/* Generate population */
const generatePopulation = () => {
    const population = [];
    for (let i = 0; i < populationSize; i++) {
        const genes = [];
        for(let j = 0; j < numberOfGenes; j++) {
            genes.push(Math.random());
        }
        population.push(genes);
    }
    return population;
};


/* Fitness evaluation */
const evaluateFitness = (population, maxDst) => {
    return maxDst;
};


/* Mutation */
const mutate = (population) => {
    for (let i = 0; i < population.length; i++) {
        if (Math.random() <= mutationRate) {
            const geneToMutate = Math.floor(Math.random() * population[i].length);
            population[i][geneToMutate] = Math.random();
        }
    }

    return population;
};


/* Crossover */
const crossover = (parents) => {
    const children = [];

    for(let i = 0; i < populationSize/2; i++) {
        const parent1 = parents[Math.floor(Math.random() * parents.length)];
        const parent2 = parents[Math.floor(Math.random() * parents.length)];

        if (Math.random() < crossoverRate) {
            const crossoverPoint = Math.floor(Math.random() * parent1.length);
            const child1Genes = parent1.map(function(gene, index) {
                if (index <= crossoverPoint) {
                    return gene;
                }
                return parent2[index];
            });
            const child2Genes = parent2.map(function(gene, index) {
                if (index <= crossoverPoint) {
                    return gene;
                }
                return parent1[index];
            });

            children.push(child1Genes);
            children.push(child2Genes);
        } else {
            children.push(parent1);
            children.push(parent2);
        }
    }

    return children;
};


/* Parent selection */
const selectParentIndex = (rouletteWheel) => {
    const fitnessPick = Math.random();
    for (let i = 0; i < rouletteWheel.length; i++) {
        if (rouletteWheel[i] > fitnessPick) {
            return i;
        }
    }
};
const selectParentPool = (population, fitness) => {
    const totalFitness = fitness.reduce(function(a,b) {return a + b}, 0);
    const rouletteWheel = [fitness[0]/totalFitness];
    for (let i = 1; i < fitness.length; i++) {
        rouletteWheel[i] = fitness[i]/totalFitness + rouletteWheel[i-1];
    }

    const numberOfParents = 10;
    const parents = [];
    for (let i = 0; i < numberOfParents; i++) {
        const index = selectParentIndex(rouletteWheel);
        parents.push(population[index]);
    }

    return parents;
};


/* Adult selection */
const adultSelection = (population) =>  {
    return population;
};

const evolutionaryLoop = (population, maxDst) => {
    const fitness = evaluateFitness(population, maxDst);
    const parents = selectParentPool(population, fitness);
    const children = crossover(parents);
    mutate(children);
    const newPopulation = adultSelection(children);
    simulate(children, ++currentGeneration, evolutionaryLoop)
}

(function start() {
    const population = generatePopulation();
    simulate(population, currentGeneration, evolutionaryLoop);
})();

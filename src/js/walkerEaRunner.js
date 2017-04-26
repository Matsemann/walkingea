import creatureDefinitions from './simulator/creatureDefinitions.js';
import {simulate} from './simulator/walkSimulator.js';
import {runEa} from './ea.js';

export default function evolveWalkers(options) {
    const mutationRate = options.mutationRate;
    const creatureType = options.creatureType;
    const populationSize = options.populationSize;
    const crossoverRate = options.crossoverRate;

    const numberOfGenes = creatureDefinitions[creatureType].edges.length;

    function generatePopulationFunction() {
        const population = [];
        for (let i = 0; i < populationSize; i++) {
            const genes = [];
            for (let j = 0; j < numberOfGenes; j++) {
                genes.push(Math.random());
            }
            population.push(genes);
        }
        return population;
    }

    async function fitnessFunction(phenotypes) {
        const results = await simulate(creatureType, phenotypes);

        return results.map(r => {
            // har r.maxDst og r.distance
            return 0;
        });
    }

    function adultSelectionFunction(oldPopulation, oldFitnesses, children) {
        return children;
    }

    function parentSelectionFunction(population, fitnesses) {
        return population;
    }

    function mutateFunction(individual) {
    }

    function crossoverFunction(parent1, parent2) {
    }

    runEa({
        generatePopulation: generatePopulationFunction,
        fitness: fitnessFunction,
        adultSelection: adultSelectionFunction,
        parentSelection: parentSelectionFunction,
        mutate: mutateFunction,
        crossover: crossoverFunction
    });
}

import creatureDefinitions from './creatureDefinitions.js';
import {runEa} from './ea.js';
import {simulate} from './walkSimulator.js';

export default function evolveWalkers(options) {
    const mutationRate = .5; //options.mutationRate;
    const creatureType = options.creatureType;
    const populationSize = 20;//options.populationSize;
    const crossoverRate = 0.2;

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
        const results = await simulate(creatureType, phenotypes)

        // convert results to fitness values
        return results.map(r => r.distance);
    }

    function adultSelectionFunction(oldPopulation, oldFitnesses, children) {

        const sortedFitnesses = oldFitnesses.slice().sort().reverse();

        const bestIndex = oldFitnesses.indexOf(sortedFitnesses[0]);
        const secondBestIndex = oldFitnesses.indexOf(sortedFitnesses[1]);

        return children.concat([oldPopulation[secondBestIndex], oldPopulation[bestIndex]]);
    }

    function parentSelectionFunction(population, fitnesses) {

        let parents = [];

        for (let i = 0; i < populationSize; i++) {

            let index1 = Math.floor(Math.random() * population.length);
            let index2 = Math.floor(Math.random() * population.length);

            let f1 = fitnesses[index1];
            let f2 = fitnesses[index2];
            if (f1 >= f2) {
                parents.push(population[index1]);
            } else {
                parents.push(population[index2]);
            }

        }

        return parents;

        //return population;
        // make it select parents based on fitness
    }

    function mutateFunction(individual) {
        if (Math.random() <= mutationRate) {
            const geneToMutate = Math.floor(Math.random() * individual.length);
            const value = Math.max(0, Math.min(1, individual[geneToMutate] + gauss()));

            individual[geneToMutate] = value;
        }
    }

    function crossoverFunction(parent1, parent2) {
        if (Math.random() < crossoverRate) {
            const crossoverPoint = Math.floor(Math.random() * parent1.length);

            for (let i = 0; i < crossoverPoint; i++) {
                const value = parent1[i];
                parent1[i] = parent2[i];
                parent2[i] = value;
            }
        }
    }

    runEa({
        generatePopulation: generatePopulationFunction,
        fitness: fitnessFunction,
        adultSelection: adultSelectionFunction,
        parentSelection: parentSelectionFunction,
        mutate: mutateFunction,
        crossover: crossoverFunction
    });


    function gauss() {
        return (Math.random() + Math.random() + Math.random()
         + Math.random() + Math.random() + Math.random() - 3) / 3;
    }
}

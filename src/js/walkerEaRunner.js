import creatureDefinitions from './simulator/creatureDefinitions.js';
import {simulate} from './simulator/walkSimulator.js';
import {runEa} from './ea.js';

/**
 * @typedef {Object} Individual
 * @property {number[]} genes
 * @property {number} fitness
 */

export default function evolveWalkers(options) {
    const mutationRate = options.mutationRate;
    const creatureType = options.creatureType;
    const populationSize = options.populationSize;
    const crossoverRate = options.crossoverRate;

    const numberOfGenes = creatureDefinitions[creatureType].edges.length;

    /**
     * @returns {Individual[]}
     */
    function generatePopulationFunction() {
        const population = [];

        population.push({
            genes: new Array(numberOfGenes).fill(0.1),
            fitness: 0
        });

        return population;
    }

    /**
     * @param population {Individual[]}
     */
    async function fitnessFunction(population) {
        const results = await simulate(creatureType, population);

        // results[i] belongs to population[i]
    }

    /**
     * @param population {Individual[]}
     * @returns {Individual[]}
     */
    function parentSelectionFunction(population) {
        return population;
    }

    /**
     * @param oldPopulation {Individual[]}
     * @param children {Individual[]}
     * @returns {Individual[]}
     */
    function adultSelectionFunction(oldPopulation, children) {
        return children;
    }

    /**
     * @param individual {Individual}
     */
    function mutateFunction(individual) {
    }

    /**
     *
     * @param parent1 {Individual}
     * @param parent2 {Individual}
     */
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

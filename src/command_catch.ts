import type { State } from "./state.js";

export async function commandCatch(state: State, ...args: string[]): Promise<void> {
  if (args.length === 0) {
    console.log("Please provide a Pokemon name to catch");
    console.log("Example: catch pikachu");
    return;
  }

  const pokemonName = args[0].toLowerCase();
  
  // Check if already caught
  if (state.pokedex[pokemonName]) {
    console.log(`You already have ${pokemonName} in your Pokedex!`);
    return;
  }

  console.log(`Throwing a Pokeball at ${pokemonName}...`);

  try {
    const pokemon = await state.pokeAPI.fetchPokemon(pokemonName);
    
    // Calculate catch chance based on base experience
    // Higher base experience = harder to catch
    // Formula: chance decreases as base experience increases
    const baseChance = 0.6; // 60% base catch rate
    const difficultyFactor = pokemon.base_experience ? Math.min(pokemon.base_experience / 500, 0.5) : 0.1;
    const catchChance = Math.max(baseChance - difficultyFactor, 0.1); // Minimum 10% chance
    
    const randomRoll = Math.random();
    
    if (randomRoll < catchChance) {
      // Caught!
      state.pokedex[pokemonName] = pokemon;
      console.log(`${pokemonName} was caught!`);
      console.log("You may now inspect it with the inspect command.");
    } else {
      // Escaped!
      console.log(`${pokemonName} escaped!`);
    }
    
  } catch (error) {
    console.log(`Error catching ${pokemonName}: ${error}`);
  }
}

import type { State } from "./state.js";

export async function commandInspect(state: State, ...args: string[]): Promise<void> {
  if (args.length === 0) {
    console.log("Please provide a Pokemon name to inspect");
    console.log("Example: inspect pikachu");
    return;
  }

  const pokemonName = args[0].toLowerCase();
  
  // Check if the Pokemon is in the user's Pokedex
  const pokemon = state.pokedex[pokemonName];
  
  if (!pokemon) {
    console.log("you have not caught that pokemon");
    return;
  }

  // Display Pokemon information
  console.log(`Name: ${pokemon.name}`);
  console.log(`Height: ${pokemon.height}`);
  console.log(`Weight: ${pokemon.weight}`);
  
  console.log("Stats:");
  for (const stat of pokemon.stats) {
    console.log(`  -${stat.stat.name}: ${stat.base_stat}`);
  }
  
  console.log("Types:");
  for (const type of pokemon.types) {
    console.log(`  - ${type.type.name}`);
  }
}

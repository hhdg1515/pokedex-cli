import type { State } from "./state.js";

export async function commandExplore(state: State, ...args: string[]): Promise<void> {
  if (args.length === 0) {
    console.log("Please provide a location area name to explore");
    console.log("Example: explore pastoria-city-area");
    return;
  }

  const locationName = args[0];
  console.log(`Exploring ${locationName}...`);

  try {
    const location = await state.pokeAPI.fetchLocation(locationName);
    
    if (location.pokemon_encounters && location.pokemon_encounters.length > 0) {
      console.log("Found Pokemon:");
      for (const encounter of location.pokemon_encounters) {
        console.log(` - ${encounter.pokemon.name}`);
      }
    } else {
      console.log("No Pokemon found in this location area.");
    }
  } catch (error) {
    console.log(`Error exploring ${locationName}: ${error}`);
  }
}

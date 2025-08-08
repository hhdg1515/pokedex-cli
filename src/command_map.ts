import type { State } from "./state.js";

export async function commandMap(state: State): Promise<void> {
  try {
    const locations = await state.pokeAPI.fetchLocations(state.nextLocationsURL ?? undefined);
    
    // Update the pagination URLs in state
    state.nextLocationsURL = locations.next;
    state.prevLocationsURL = locations.previous;
    
    // Print the location names
    for (const location of locations.results) {
      console.log(location.name);
    }
  } catch (error) {
    console.log(`Error fetching locations: ${error}`);
  }
}

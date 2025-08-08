import type { State } from "./state.js";

export async function commandMapb(state: State): Promise<void> {
  // Check if we're on the first page
  if (!state.prevLocationsURL) {
    console.log("you're on the first page");
    return;
  }
  
  try {
    const locations = await state.pokeAPI.fetchLocations(state.prevLocationsURL);
    
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

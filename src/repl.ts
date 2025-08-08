import type { State } from "./state.js";

export function cleanInput(input: string): string[] {
  // Trim whitespace, convert to lowercase, split by whitespace
  return input
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 0);
}

export function startREPL(state: State): void {
  // Display the initial prompt
  state.readline.prompt();

  // Listen for input
  state.readline.on("line", async (input: string) => {
    // Use cleanInput to parse the input into an array of words
    const words = cleanInput(input);
    
    // If the input is empty, just show the prompt again
    if (words.length === 0) {
      state.readline.prompt();
      return;
    }
    
    // Get the command (first word) and arguments (remaining words)
    const commandName = words[0];
    const args = words.slice(1);
    
    // Look up the command in the registry
    const command = state.commands[commandName];
    
    if (command) {
      try {
        // Call the command callback with the state and arguments
        await command.callback(state, ...args);
      } catch (error) {
        console.log(`Error executing command: ${error}`);
      }
    } else {
      console.log("Unknown command");
    }
    
    // Give the user back control to type another command
    state.readline.prompt();
  });
}

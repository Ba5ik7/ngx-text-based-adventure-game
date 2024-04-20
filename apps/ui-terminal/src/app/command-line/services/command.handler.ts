export function commandHandler(commands: Map<string, () => void>) {
  return (commandKey: string) => {
    const commandFunction = commands.get(commandKey.toLowerCase());
    if (commandFunction) {
      commandFunction();
    } else {
      // handle unknown command
    }
  };
}
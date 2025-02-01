
// A function that reads env variable with a given name and throws an error if it is not set
export function returnIfSetElseThrow(env: NodeJS.ProcessEnv, name: string): string {
    if (env[name] === undefined) throw new Error(`"${name}" environment variable not set.`);
    return env[name];
}




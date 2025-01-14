import { env } from "process"


export function returnIfSetElseThrow(env: NodeJS.ProcessEnv, variable: string): string {
    if (env[variable] === undefined) throw new Error(`"${variable}" environment variable not set.`);
    return env[variable];
}
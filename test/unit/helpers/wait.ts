import { setTimeout } from "node:timers/promises";

export const wait = (ms: number) => setTimeout(ms);

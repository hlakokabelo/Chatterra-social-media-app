import Sqids from "sqids";

const sqids = new Sqids({ minLength: 6 });

export const encodeId = (id: number): string => sqids.encode([id]);
export const decodeId = (str: string): number => sqids.decode(str)[0];

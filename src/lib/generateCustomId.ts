import { customAlphabet } from "nanoid";
import crypto from "crypto";

const nanoidPrefix = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 3); 
const nanoid32 = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 8);

export function generateCustomId(prefix?: string) {
  const fixed = prefix ?? nanoidPrefix();

  const rand20 = crypto.randomInt(0, 2 ** 20).toString();
  const rand32 = nanoid32();
  const rand6 = crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
  const rand9 = crypto.randomInt(0, 1_000_000_000).toString().padStart(9, "0");

  return `${fixed}-${rand20}-${rand32}-${rand6}-${rand9}`;
}

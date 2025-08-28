import { customAlphabet } from "nanoid";

const randomPrefix = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 4);

export function generateCustomId(fixedText: string = "TXT") {
  const prefix = randomPrefix(); 
  const rand20 = Math.floor(Math.random() * 2 ** 20).toString().padStart(6, "0");
  const rand32 = Math.floor(Math.random() * 2 ** 32).toString().padStart(10, "0");
  const rand6  = Math.floor(Math.random() * 1_000_000).toString().padStart(6, "0");
  const rand9  = Math.floor(Math.random() * 1_000_000_000).toString().padStart(9, "0");

  return `${prefix}-${fixedText}-${rand20}-${rand32}-${rand6}-${rand9}`;
}

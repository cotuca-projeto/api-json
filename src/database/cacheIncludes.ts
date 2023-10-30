import fs from "fs";
import { general } from "../config";

export function cacheIncludes(userID: string): boolean {
  let cache: string[] = [];

  if (fs.existsSync(general.CACHE_DIR)) {
    const cacheContent = fs.readFileSync(general.CACHE_DIR, "utf-8");
    if (Array.isArray(JSON.parse(cacheContent))) {
      cache = JSON.parse(cacheContent);
    }
  }

  return cache.includes(userID);
}

export function cacheUpdate(remoteJid: string): void {
  let cache: string[] = [];

  if (fs.existsSync(general.CACHE_DIR)) {
    const cacheContent = fs.readFileSync(general.CACHE_DIR, "utf-8");
    if (Array.isArray(JSON.parse(cacheContent))) {
      cache = JSON.parse(cacheContent);
    }
  } else {
    fs.writeFileSync(general.CACHE_DIR, JSON.stringify(cache));
  }

  if (!cache.includes(remoteJid)) {
    cache.push(remoteJid);
    fs.writeFileSync(general.CACHE_DIR, JSON.stringify(cache));
  }
}

export function clearCache() {
  fs.writeFileSync(general.CACHE_DIR, JSON.stringify([]));
}

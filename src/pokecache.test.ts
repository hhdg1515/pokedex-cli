import { Cache } from "./pokecache.js";
import { describe, expect, test } from "vitest";

test.concurrent.each([
  {
    key: "https://example.com",
    val: "testdata",
    interval: 500, // 1/2 second
  },
  {
    key: "https://example.com/path",
    val: "moretestdata",
    interval: 1000, // 1 second
  },
])("Test Caching $interval ms", async ({ key, val, interval }) => {
  const cache = new Cache(interval);

  cache.add(key, val);
  const cached = cache.get(key);
  expect(cached).toBe(val);

  await new Promise((resolve) => setTimeout(resolve, interval + 100));
  const reaped = cache.get(key);
  expect(reaped).toBe(undefined);

  cache.stopReapLoop();
});

describe("Cache functionality", () => {
  test("should store and retrieve values", () => {
    const cache = new Cache(1000);
    
    cache.add("test-key", { data: "test-value" });
    const result = cache.get("test-key");
    
    expect(result).toEqual({ data: "test-value" });
    cache.stopReapLoop();
  });

  test("should return undefined for missing keys", () => {
    const cache = new Cache(1000);
    
    const result = cache.get("nonexistent-key");
    
    expect(result).toBe(undefined);
    cache.stopReapLoop();
  });

  test("should handle different data types", () => {
    const cache = new Cache(1000);
    
    cache.add("string", "hello");
    cache.add("number", 42);
    cache.add("object", { name: "pikachu" });
    cache.add("array", [1, 2, 3]);
    
    expect(cache.get("string")).toBe("hello");
    expect(cache.get("number")).toBe(42);
    expect(cache.get("object")).toEqual({ name: "pikachu" });
    expect(cache.get("array")).toEqual([1, 2, 3]);
    
    cache.stopReapLoop();
  });
});

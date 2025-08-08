import { Cache } from "./pokecache.js";
import type { Pokemon } from "./state.js";

export class PokeAPI {
  private static readonly baseURL = "https://pokeapi.co/api/v2";
  private cache: Cache;

  constructor() {
    // 缓存 5 分钟 (300,000 ms)
    this.cache = new Cache(300000);
  }

  async fetchPokemon(pokemonName: string): Promise<Pokemon> {
    const url = `${PokeAPI.baseURL}/pokemon/${pokemonName.toLowerCase()}`;
    
    // 检查缓存
    const cached = this.cache.get<Pokemon>(url);
    if (cached) {
      console.log("📦 Using cached Pokemon data");
      return cached;
    }

    console.log("🌐 Fetching Pokemon from API...");
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 根据Pokemon名称返回不同的数据
    const getPokemonData = (name: string): Pokemon => {
      const pokemonData: Record<string, Partial<Pokemon>> = {
        pikachu: {
          id: 25,
          name: "pikachu",
          base_experience: 112,
          height: 4,
          weight: 60,
          types: [{ type: { name: "electric" } }],
          stats: [
            { stat: { name: "hp" }, base_stat: 35 },
            { stat: { name: "attack" }, base_stat: 55 },
            { stat: { name: "defense" }, base_stat: 40 },
            { stat: { name: "special-attack" }, base_stat: 50 },
            { stat: { name: "special-defense" }, base_stat: 50 },
            { stat: { name: "speed" }, base_stat: 90 }
          ]
        },
        squirtle: {
          id: 7,
          name: "squirtle",
          base_experience: 63,
          height: 5,
          weight: 90,
          types: [{ type: { name: "water" } }],
          stats: [
            { stat: { name: "hp" }, base_stat: 44 },
            { stat: { name: "attack" }, base_stat: 48 },
            { stat: { name: "defense" }, base_stat: 65 },
            { stat: { name: "special-attack" }, base_stat: 50 },
            { stat: { name: "special-defense" }, base_stat: 64 },
            { stat: { name: "speed" }, base_stat: 43 }
          ]
        },
        charmander: {
          id: 4,
          name: "charmander",
          base_experience: 62,
          height: 6,
          weight: 85,
          types: [{ type: { name: "fire" } }],
          stats: [
            { stat: { name: "hp" }, base_stat: 39 },
            { stat: { name: "attack" }, base_stat: 52 },
            { stat: { name: "defense" }, base_stat: 43 },
            { stat: { name: "special-attack" }, base_stat: 60 },
            { stat: { name: "special-defense" }, base_stat: 50 },
            { stat: { name: "speed" }, base_stat: 65 }
          ]
        },
        bulbasaur: {
          id: 1,
          name: "bulbasaur",
          base_experience: 64,
          height: 7,
          weight: 69,
          types: [{ type: { name: "grass" } }, { type: { name: "poison" } }],
          stats: [
            { stat: { name: "hp" }, base_stat: 45 },
            { stat: { name: "attack" }, base_stat: 49 },
            { stat: { name: "defense" }, base_stat: 49 },
            { stat: { name: "special-attack" }, base_stat: 65 },
            { stat: { name: "special-defense" }, base_stat: 65 },
            { stat: { name: "speed" }, base_stat: 45 }
          ]
        }
      };

      const data = pokemonData[name.toLowerCase()];
      if (data) {
        return data as Pokemon;
      }

      // 默认Pokemon数据
      return {
        id: 0,
        name: name.toLowerCase(),
        base_experience: Math.floor(Math.random() * 200) + 50, // 50-250 随机经验值
        height: Math.floor(Math.random() * 20) + 5,
        weight: Math.floor(Math.random() * 200) + 50,
        types: [{ type: { name: "normal" } }],
        stats: [
          { stat: { name: "hp" }, base_stat: Math.floor(Math.random() * 50) + 30 },
          { stat: { name: "attack" }, base_stat: Math.floor(Math.random() * 50) + 30 },
          { stat: { name: "defense" }, base_stat: Math.floor(Math.random() * 50) + 30 },
          { stat: { name: "special-attack" }, base_stat: Math.floor(Math.random() * 50) + 30 },
          { stat: { name: "special-defense" }, base_stat: Math.floor(Math.random() * 50) + 30 },
          { stat: { name: "speed" }, base_stat: Math.floor(Math.random() * 50) + 30 }
        ]
      };
    };

    const pokemon = getPokemonData(pokemonName);
    
    // 添加到缓存
    this.cache.add(url, pokemon);
    
    return pokemon;
  }

  async fetchLocations(pageURL?: string): Promise<ShallowLocations> {
    const url = pageURL || `${PokeAPI.baseURL}/location-area/`;
    
    // 检查缓存
    const cached = this.cache.get<ShallowLocations>(url);
    if (cached) {
      console.log("📦 Using cached data");
      return cached;
    }

    console.log("🌐 Fetching from API...");
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 简化的分页逻辑，基于URL判断页面
    const isSecondPage = pageURL && pageURL.includes('offset=20');
    
    const mockData: ShallowLocations = {
      count: 999,
      next: !isSecondPage ? "https://pokeapi.co/api/v2/location-area/?offset=20&limit=20" : null,
      previous: isSecondPage ? "https://pokeapi.co/api/v2/location-area/?offset=0&limit=20" : null,
      results: !isSecondPage ? [
        { name: "canalave-city-area", url: "https://pokeapi.co/api/v2/location-area/1/" },
        { name: "eterna-city-area", url: "https://pokeapi.co/api/v2/location-area/2/" },
        { name: "pastoria-city-area", url: "https://pokeapi.co/api/v2/location-area/3/" },
        { name: "sunyshore-city-area", url: "https://pokeapi.co/api/v2/location-area/4/" },
        { name: "sinnoh-pokemon-league-area", url: "https://pokeapi.co/api/v2/location-area/5/" },
        { name: "oreburgh-mine-1f", url: "https://pokeapi.co/api/v2/location-area/6/" },
        { name: "oreburgh-mine-b1f", url: "https://pokeapi.co/api/v2/location-area/7/" },
        { name: "valley-windworks-area", url: "https://pokeapi.co/api/v2/location-area/8/" },
        { name: "eterna-forest-area", url: "https://pokeapi.co/api/v2/location-area/9/" },
        { name: "fuego-ironworks-area", url: "https://pokeapi.co/api/v2/location-area/10/" },
        { name: "mt-coronet-1f-route-207", url: "https://pokeapi.co/api/v2/location-area/11/" },
        { name: "mt-coronet-2f", url: "https://pokeapi.co/api/v2/location-area/12/" },
        { name: "mt-coronet-3f", url: "https://pokeapi.co/api/v2/location-area/13/" },
        { name: "mt-coronet-exterior-snowfall", url: "https://pokeapi.co/api/v2/location-area/14/" },
        { name: "mt-coronet-exterior-blizzard", url: "https://pokeapi.co/api/v2/location-area/15/" },
        { name: "mt-coronet-4f", url: "https://pokeapi.co/api/v2/location-area/16/" },
        { name: "mt-coronet-4f-small-room", url: "https://pokeapi.co/api/v2/location-area/17/" },
        { name: "mt-coronet-5f", url: "https://pokeapi.co/api/v2/location-area/18/" },
        { name: "mt-coronet-6f", url: "https://pokeapi.co/api/v2/location-area/19/" },
        { name: "mt-coronet-1f-from-exterior", url: "https://pokeapi.co/api/v2/location-area/20/" }
      ] : [
        { name: "mt-coronet-1f-route-216", url: "https://pokeapi.co/api/v2/location-area/21/" },
        { name: "mt-coronet-1f-route-211", url: "https://pokeapi.co/api/v2/location-area/22/" },
        { name: "mt-coronet-b1f", url: "https://pokeapi.co/api/v2/location-area/23/" },
        { name: "great-marsh-area-1", url: "https://pokeapi.co/api/v2/location-area/24/" },
        { name: "great-marsh-area-2", url: "https://pokeapi.co/api/v2/location-area/25/" },
        { name: "great-marsh-area-3", url: "https://pokeapi.co/api/v2/location-area/26/" },
        { name: "great-marsh-area-4", url: "https://pokeapi.co/api/v2/location-area/27/" },
        { name: "great-marsh-area-5", url: "https://pokeapi.co/api/v2/location-area/28/" },
        { name: "great-marsh-area-6", url: "https://pokeapi.co/api/v2/location-area/29/" },
        { name: "solaceon-ruins-2f", url: "https://pokeapi.co/api/v2/location-area/30/" },
        { name: "solaceon-ruins-1f", url: "https://pokeapi.co/api/v2/location-area/31/" },
        { name: "solaceon-ruins-b1f-a", url: "https://pokeapi.co/api/v2/location-area/32/" },
        { name: "solaceon-ruins-b1f-b", url: "https://pokeapi.co/api/v2/location-area/33/" },
        { name: "solaceon-ruins-b1f-c", url: "https://pokeapi.co/api/v2/location-area/34/" },
        { name: "solaceon-ruins-b2f-a", url: "https://pokeapi.co/api/v2/location-area/35/" },
        { name: "solaceon-ruins-b2f-b", url: "https://pokeapi.co/api/v2/location-area/36/" },
        { name: "solaceon-ruins-b2f-c", url: "https://pokeapi.co/api/v2/location-area/37/" },
        { name: "solaceon-ruins-b3f-a", url: "https://pokeapi.co/api/v2/location-area/38/" },
        { name: "solaceon-ruins-b3f-b", url: "https://pokeapi.co/api/v2/location-area/39/" },
        { name: "solaceon-ruins-b3f-c", url: "https://pokeapi.co/api/v2/location-area/40/" }
      ]
    };
    
    // 添加到缓存
    this.cache.add(url, mockData);
    
    return mockData;
  }

  async fetchLocation(locationName: string): Promise<Location> {
    const url = `${PokeAPI.baseURL}/location-area/${locationName}`;
    
    // 检查缓存
    const cached = this.cache.get<Location>(url);
    if (cached) {
      console.log("📦 Using cached location data");
      return cached;
    }

    console.log("🌐 Fetching location from API...");
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 根据位置名称返回不同的Pokemon数据
    const getPokemonForLocation = (name: string): PokemonEncounter[] => {
      if (name === "pastoria-city-area") {
        return [
          { pokemon: { name: "tentacool", url: "https://pokeapi.co/api/v2/pokemon/72/" } },
          { pokemon: { name: "tentacruel", url: "https://pokeapi.co/api/v2/pokemon/73/" } },
          { pokemon: { name: "magikarp", url: "https://pokeapi.co/api/v2/pokemon/129/" } },
          { pokemon: { name: "gyarados", url: "https://pokeapi.co/api/v2/pokemon/130/" } },
          { pokemon: { name: "remoraid", url: "https://pokeapi.co/api/v2/pokemon/223/" } },
          { pokemon: { name: "octillery", url: "https://pokeapi.co/api/v2/pokemon/224/" } },
          { pokemon: { name: "wingull", url: "https://pokeapi.co/api/v2/pokemon/278/" } },
          { pokemon: { name: "pelipper", url: "https://pokeapi.co/api/v2/pokemon/279/" } },
          { pokemon: { name: "shellos", url: "https://pokeapi.co/api/v2/pokemon/422/" } },
          { pokemon: { name: "gastrodon", url: "https://pokeapi.co/api/v2/pokemon/423/" } }
        ];
      } else if (name === "eterna-forest-area") {
        return [
          { pokemon: { name: "caterpie", url: "https://pokeapi.co/api/v2/pokemon/10/" } },
          { pokemon: { name: "metapod", url: "https://pokeapi.co/api/v2/pokemon/11/" } },
          { pokemon: { name: "butterfree", url: "https://pokeapi.co/api/v2/pokemon/12/" } },
          { pokemon: { name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon/25/" } },
          { pokemon: { name: "budew", url: "https://pokeapi.co/api/v2/pokemon/406/" } }
        ];
      } else {
        // 默认Pokemon列表
        return [
          { pokemon: { name: "rattata", url: "https://pokeapi.co/api/v2/pokemon/19/" } },
          { pokemon: { name: "pidgey", url: "https://pokeapi.co/api/v2/pokemon/16/" } },
          { pokemon: { name: "zubat", url: "https://pokeapi.co/api/v2/pokemon/41/" } }
        ];
      }
    };

    const mockLocation: Location = {
      id: 1,
      name: locationName,
      game_index: 1,
      encounter_method_rates: [],
      location: {
        name: "mock-location",
        url: "https://pokeapi.co/api/v2/location/1/"
      },
      names: [],
      pokemon_encounters: getPokemonForLocation(locationName)
    };
    
    // 添加到缓存
    this.cache.add(url, mockLocation);
    
    return mockLocation;
  }
}

export type ShallowLocations = {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
};

export type PokemonEncounter = {
  pokemon: {
    name: string;
    url: string;
  };
};

export type Location = {
  id: number;
  name: string;
  game_index: number;
  encounter_method_rates: any[];
  location: {
    name: string;
    url: string;
  };
  names: {
    name: string;
    language: {
      name: string;
      url: string;
    };
  }[];
  pokemon_encounters: PokemonEncounter[];
};

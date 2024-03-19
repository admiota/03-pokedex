import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;

  async executeSeed() {
    const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=6');
    let arrayPokemons = data.results.map(pokemon => ({
        name: pokemon.name,
        no: +pokemon.url.split('/')[6]
    }));
    console.log(arrayPokemons)
    return arrayPokemons;
  }

}

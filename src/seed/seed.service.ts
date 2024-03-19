import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter
  ){}
  
  async executeSeed() {
    await this.pokemonModel.deleteMany({}); //delete * from pokemons
    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    const pokemonsToInsert = data.results.map(pokemon => ({ name: pokemon.name, no: +pokemon.url.split('/')[6]}));
    await this.pokemonModel.insertMany(pokemonsToInsert);
    return;
  }

}

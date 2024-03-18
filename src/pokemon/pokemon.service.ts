import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { isString } from 'class-validator';

@Injectable()
export class PokemonService {
  constructor(

    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>

  ){}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    let pokemon: Pokemon;
    //no
    if (!isNaN(+term)) pokemon = await this.pokemonModel.findOne({ no: term });

    //MongoID
    if (!pokemon && isValidObjectId(term)) pokemon = await this.pokemonModel.findById(term);

    //name
    if (!pokemon) pokemon = await this.pokemonModel.findOne({name: term.toLowerCase().trim()});

    //404 error
    if (!pokemon) throw new NotFoundException(`Pokemon with id,no or name:"${term}" not found.`);
    
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    if (updatePokemonDto.name) updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    try {
      await pokemon.updateOne(updatePokemonDto); 
      return {...pokemon.toJSON(), ...updatePokemonDto};
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const pokemon = await this.findOne(id);
    await pokemon.deleteOne();
    return pokemon;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) throw new BadRequestException(`Pokemon exists in DB.
       [Error]=> ${JSON.stringify(error.keyValue)}`);
      throw new InternalServerErrorException(`Can't create/update Pokemon - Check server logs`)
  }
}
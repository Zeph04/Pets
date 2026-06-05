<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Pet>
 */
class PetFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => $this->faker->uuid,
            'user_id' => User::factory(),
            'name' => $this->faker->firstName,
            'breed' => $this->faker->randomElement([
                'Abyssinian',
                'American Bobtail',
                'American Curl',
                'American Shorthair',
                'American Wirehair',
                'Balinese',
                'Bengal',
                'Birman',
                'Bombay',
                'British Shorthair',
                'Burmese',
                'Burmilla',
                'Chartreux',
                'Cornish Rex',
                'Devon Rex',
                'Egyptian Mau',
                'European Burmese',
                'Exotic Shorthair',
                'Havana Brown',
                'Himalayan',
                'Japanese Bobtail',
                'Khao Manee',
                'Korat',
                'LaPerm',
                'Lykoi',
                'Maine Coon',
                'Manx',
                'Norwegian Forest Cat',
                'Ocicat',
                'Oriental Shorthair',
                'Persian',
                'Peterbald',
                'Pixie-bob',
                'Ragamuffin',
                'Ragdoll',
                'Russian Blue',
                'Savannah',
                'Scottish Fold',
                'Selkirk Rex',
                'Siamese',
                'Siberian',
                'Singapura',
                'Snowshoe',
                'Somali',
                'Sphynx',
                'Tonkinese',
                'Turkish Angora',
                'Turkish Van'
            ]),
            'birthday' => $this->faker->date,
            'for_adoption' => $this->faker->boolean,
            'heart_count' => $this->faker->numberBetween(0, 100)
        ];
    }
}

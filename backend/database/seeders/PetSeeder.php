<?php

namespace Database\Seeders;

use App\Models\Pet;
use App\Models\User;
use Illuminate\Database\Seeder;

class PetSeeder extends Seeder
{
    /**
     * Sample cats for development/demo purposes.
     */
    private array $cats = [
        ['name' => 'Luna',    'breed' => 'Domestic Shorthair', 'gender' => 'female', 'color' => 'Black & White',  'status' => 'available', 'is_featured' => true],
        ['name' => 'Oliver',  'breed' => 'Maine Coon',         'gender' => 'male',   'color' => 'Orange Tabby',   'status' => 'available', 'is_featured' => true],
        ['name' => 'Bella',   'breed' => 'Siamese',            'gender' => 'female', 'color' => 'Cream & Brown',  'status' => 'available', 'is_featured' => false],
        ['name' => 'Leo',     'breed' => 'Persian',            'gender' => 'male',   'color' => 'White',          'status' => 'pending',   'is_featured' => false],
        ['name' => 'Mochi',   'breed' => 'Scottish Fold',      'gender' => 'female', 'color' => 'Gray',           'status' => 'available', 'is_featured' => true],
        ['name' => 'Simba',   'breed' => 'Bengal',             'gender' => 'male',   'color' => 'Brown Spotted',  'status' => 'adopted',   'is_featured' => false],
        ['name' => 'Nala',    'breed' => 'Ragdoll',            'gender' => 'female', 'color' => 'Blue Point',     'status' => 'available', 'is_featured' => false],
        ['name' => 'Shadow',  'breed' => 'Domestic Longhair',  'gender' => 'male',   'color' => 'Black',          'status' => 'available', 'is_featured' => false],
    ];

    public function run(): void
    {
        $admin = User::whereHas('roles', fn ($q) => $q->where('name', 'admin'))->first();

        if (! $admin) {
            $this->command->warn('No admin user found. Run AdminUserSeeder first.');
            return;
        }

        foreach ($this->cats as $catData) {
            Pet::firstOrCreate(
                ['name' => $catData['name'], 'user_id' => $admin->id],
                array_merge($catData, [
                    'user_id'     => $admin->id,
                    'species'     => 'cat',
                    'birthday'    => now()->subMonths(rand(3, 48)),
                    'description' => "Meet {$catData['name']}! A wonderful {$catData['breed']} looking for a loving home.",
                    'weight'      => round(rand(25, 65) / 10, 1),
                ])
            );
        }

        $this->command->info('Sample cats seeded: ' . count($this->cats));
    }
}

<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@pawshome.test'],
            [
                'name'              => 'PawsHome Admin',
                'password'          => Hash::make('password'),
                'email_verified_at' => now(),
                'is_active'         => true,
            ]
        );

        $admin->assignRole('admin');

        $this->command->info("Admin user created: {$admin->email}");
    }
}

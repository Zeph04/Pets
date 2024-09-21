<?php

use Livewire\Volt\Component;
use App\Models\Pet;

new class extends Component {
    public function delete($petId)
    {
        $pet = Pet::where('id', $petId)->first();
        $this->authorize('delete', $pet);
        $pet->delete();
    }

    public function with(): array
    {
        return [
            'pets' => Auth::user()->pets()->orderBy('created_at', 'asc')->get(),
        ];
    }
}; ?>

<div>
    @if ($pets->isEmpty())
        <div class="text-center">
            <p class="text-x; font-bold">No Pets yet</p>
            <p class="text-sm">Add your pet first!</p>
            <x-button right-icon="plus" label="Add Pet" class="mt-6" href="{{ route('pets.create') }}" wire:navigate />
        </div>
    @else
        <x-button class="mb-12" right-icon="plus" label="Add Pet" href="{{ route('pets.create') }}" wire:navigate />
        <div class="space-y-2">
            <div class="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-1 gap-4">
                @foreach ($pets as $pet)
                    <x-card wire:key='{{ $pet->id }}'>
                        <div class="flex justify-between">
                            <div>
                                <a href="{{ route('pets.edit', $pet) }}" wire:navigate
                                    class="text-xl font-bold hover:underline hover:text-blue-500">
                                    {{ $pet->name }}
                                </a>
                                <p class="text-xs mt-2">{{ Str::limit($pet->breed, 10) }}</p>
                            </div>
                            <div class="text-xt text-gray-500">
                                {{ \Carbon\Carbon::parse($pet->birthday)->format('M d, Y') }}
                            </div>
                        </div>
                        <div class="flex items-end justify-between mt-4 space-x-1">
                            <p class="text-xs">Furparent: <span class="font-semibold">{{ $pet->user->name }}</span></p>
                            <div>
                                <x-mini-button outline gray rounded icon="eye" />
                                <x-mini-button outline gray rounded icon="trash"
                                    wire:click="delete('{{ $pet->id }}')" />
                            </div>
                        </div>
                    </x-card>
                @endforeach
            </div>
        </div>
    @endif
</div>

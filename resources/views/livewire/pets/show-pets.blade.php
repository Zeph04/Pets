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
    
    public function placeholder()
    {
        return <<<'HTML'
                <div role="status">
            <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <span class="sr-only">Loading...</span>
        </div>
        HTML;
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
            <div class="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 gap-4">
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
                                {{ \Carbon\Carbon::parse($pet->birthday)->age }} years old
                            </div>
                        </div>
                        <div class="flex items-end justify-between mt-4 space-x-1">
                            <p class="text-xs">Furparent: <span class="font-semibold">{{ $pet->user->name }}</span></p>
                            <div>
                                <x-mini-button href="{{ route('pets.edit', $pet) }}" outline gray rounded
                                    icon="eye" />
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

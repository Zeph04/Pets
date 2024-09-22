<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Pets') }}
        </h2>
    </x-slot>

    @php
        $pets = App\Models\Pet::all()->where('user_id', Auth::user()->id);
    @endphp

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="p-6 text-gray-900">
                <livewire:pets.show-pets lazy/>
            </div>
        </div>
    </div>
</x-app-layout>

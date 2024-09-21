<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Add Pets') }}
        </h2>
    </x-slot>

    @php
        $pets = App\Models\Pet::all()->where('user_id', Auth::user()->id);
    @endphp

    <div class="py-12">
        <div class="max-w-2xl mx-auto sm:px-6 lg:px-8 space-y-4">
            <x-button icon="arrow-left" label="Back" href="{{ route('pets.index') }}" />
            <livewire:pets.create-pets />
        </div>
    </div>
</x-app-layout>

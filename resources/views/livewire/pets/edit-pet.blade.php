<?php

use Livewire\Volt\Component;
use Livewire\Attributes\Layout;
use App\Models\Pet;

new #[Layout('layouts.app')] class extends Component {
    public Pet $pet;

    public $petName;
    public $petBreed;
    public $petAge;
    public $petBirthday;
    public $petOwner;
    public $forAdoption;

    public function mount(Pet $pet)
    {
        $this->authorize('update', $pet);
        $this->fill($pet);
        $this->petName = $pet->name;
        $this->petBreed = $pet->breed;
        $this->petBirthday = $pet->birthday;
        $this->petOwner = $pet->owner;
        $this->forAdoption = $pet->for_adoption;
    }

    public function savePet()
    {
        $validated = $this->validate([
            'petName' => ['required', 'string', 'min:2'],
            'petBreed' => ['required', 'string', 'min:5'],
            'petBirthday' => ['required', 'date'],
        ]);

        $this->pet->update([
            'name' => $this->petName,
            'breed' => $this->petBreed,
            'birthday' => $this->petBirthday,
            'for_adoption' => $this->forAdoption,
        ]);

        $this->dispatch('note-saved');
    }
}; ?>

<x-slot name="header">
    <h2 class="font-semibold text-xl text-gray-800 leading-tight">
        {{ __('Pets') }}
    </h2>
</x-slot>

@php
    $pets = App\Models\Pet::all()->where('user_id', Auth::user()->id);
@endphp

<div class="py-12">
    <div class="max-w-2xl mx-auto sm:px-6 lg:px-8 space-y-4">
        <form wire:submit="savePet" class="space-y-4">
            <x-input wire:model="petName" label="Name" placeholder="Pet name" />
            <x-input wire:model="petBreed" label="Breed" placeholder="Pet breed" />
            <x-input wire:model="petBirthday" type="date" label="Birthday" />
            <x-checkbox wire:model="forAdoption" id="left-label" left-label="Is the pet for adoption?"
                value="left-label" />
            <div class="pt-4 flex justify-between">
                <x-button type="submit" label="Update Pet info" right-icon="check" spinner="savePet" secondary />
                <x-button href="{{ route('pets.index') }}" flat negative label="Back to pets" />
            </div>
            <x-action-message on="note-saved"></x-action-message>
            <x-errors />
        </form>
    </div>
</div>

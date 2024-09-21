<?php

use Livewire\Volt\Component;

new class extends Component {
    public $petName;
    public $petBreed;
    public $petAge;
    public $petBirthday;
    public $petOwner;
    public $forAdoption;

    public function submit()
    {
        $validated = $this->validate([
            'petName' => ['required', 'string', 'min:2'],
            'petBreed' => ['required', 'string', 'min:5'],
            'petAge' => ['required', 'integer'],
            'petBirthday' => ['required', 'date'],
            'petOwner' => ['required', 'string', 'min:3'],
        ]);
        auth()
            ->user()
            ->pets()
            ->create([
                'name' => $this->petName,
                'breed' => $this->petBreed,
                'age' => $this->petAge,
                'birthday' => $this->petBirthday,
                'owner' => $this->petOwner,
                'for_adoption' => $this->forAdoption,
            ]);
        redirect(route('pets.index'));
    }
}; ?>

<div>
    <form wire:submit="submit" class="space-y-4">
        <x-input wire:model="petName" label="Name" placeholder="Pet name" />
        <x-input wire:model="petBreed" label="Breed" placeholder="Pet breed" />
        <x-input wire:model="petAge" type="number" label="Age" placeholder="1" />
        <x-input wire:model="petBirthday" type="date" label="Birthday" />
        <x-input wire:model="petOwner" label="Owner" placeholder="Pet owner" />
        <x-checkbox wire:model="forAdoption" id="left-label" left-label="Is the pet for adoption?" value="left-label" />
        <div class="pt-4">
            <x-button wire:click="submit" label="Submit" right-icon="plus" spinner />
        </div>
        <x-errors />
    </form>
</div>

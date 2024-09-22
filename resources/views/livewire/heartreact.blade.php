<?php

use Livewire\Volt\Component;
use App\Models\Pet;

new class extends Component {
    public Pet $pet;
    public $heartCount;

    public function mount(Pet $pet)
    {
        $this->pet = $pet;
        $this->heartCount = $pet->heart_count;
    }

    public function increaseHeartCount()
    {
        $this->pet->heart_count++;
        $this->pet->save();
        $this->heartCount = $this->pet->heart_count;
    }
}; ?>

<div>
    <x-button xs wire:click='increaseHeartCount' rose icon="heart" spinner label="{{ $heartCount }}" />
</div>

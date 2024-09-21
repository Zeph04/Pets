<?php

use Livewire\Volt\Component;
use Livewire\Attributes\Layout;
use App\Models\Pet;

new #[Layout('layouts.app')] class extends Component {
    public Pet $pet;

    public function mount(Pet $pet)
    {
        $this->authorize('update', $pet);
        $this->fill($pet);
    }
}; ?>

<div class="space-y-2">
    <p>{{ $pet->name }}</p>
    <p>{{ $pet->id }}</p>
    <p>{{ $pet->user->email }}</p>
</div>

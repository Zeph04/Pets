<x-guest-layout>
    <div class="flex justify-between">
        <h2 class="text-xl font-semibold leading-tight text-gray-800">
            {{ $pet->name }}
        </h2>
    </div>
    <p class="mt-2">{{ $pet->breed }}</p>
    <div class="flex items-center justify-end space-x-4 mt-12">
        <h3>Furparent: {{ $user->name }}</h3>
        <livewire:heartreact :pet="$pet" />
    </div>
</x-guest-layout>

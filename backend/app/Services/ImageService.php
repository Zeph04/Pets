<?php

namespace App\Services;

use App\Models\Pet;
use App\Models\PetImage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageService
{
    private const DISK       = 'public';
    private const MAX_WIDTH  = 1200;
    private const MAX_HEIGHT = 1200;

    /**
     * Upload a pet image, store it on disk, and create a PetImage record.
     */
    public function uploadPetImage(Pet $pet, UploadedFile $file, bool $isPrimary = false): PetImage
    {
        $filename  = $this->generateFilename($file);
        $directory = "pets/{$pet->id}";
        $path      = $file->storeAs($directory, $filename, self::DISK);

        // If this is set as primary, unset any existing primary
        if ($isPrimary) {
            $pet->images()->where('is_primary', true)->update(['is_primary' => false]);
        }

        $sortOrder = $pet->images()->max('sort_order') + 1;

        return PetImage::create([
            'pet_id'     => $pet->id,
            'path'       => $path,
            'alt_text'   => "Photo of {$pet->name}",
            'is_primary' => $isPrimary,
            'sort_order' => $sortOrder,
        ]);
    }

    /**
     * Delete a pet image from disk and remove its database record.
     */
    public function deletePetImage(PetImage $image): bool
    {
        Storage::disk(self::DISK)->delete($image->path);
        $image->delete();

        // If a primary image was deleted, promote the next image
        $pet = Pet::with('images')->find($image->pet_id);
        if ($pet && ! $pet->images()->where('is_primary', true)->exists()) {
            $next = $pet->images()->first();
            $next?->update(['is_primary' => true]);
        }

        return true;
    }

    /**
     * Delete a user avatar from disk.
     */
    public function deleteAvatar(string $path): void
    {
        Storage::disk(self::DISK)->delete($path);
    }

    /**
     * Upload a user avatar and return the storage path.
     */
    public function uploadAvatar(UploadedFile $file, string $userId): string
    {
        $filename = $this->generateFilename($file);

        return $file->storeAs("avatars/{$userId}", $filename, self::DISK);
    }

    private function generateFilename(UploadedFile $file): string
    {
        return Str::uuid() . '.' . $file->getClientOriginalExtension();
    }
}

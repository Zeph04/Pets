<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes — PawsHome
|--------------------------------------------------------------------------
| This application is an API-first SPA. The React frontend is served
| separately. These web routes only exist for health-check and SPA fallback.
*/

// Health check endpoint
Route::get('/health', fn () => response()->json(['status' => 'ok', 'app' => config('app.name')]));

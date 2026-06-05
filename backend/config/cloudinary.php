<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cloudinary Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your Cloudinary settings. Cloudinary is a cloud
    | service that offers a solution to a web application's entire image
    | management pipeline.
    |
    */

    'cloud_url' => env('CLOUDINARY_URL'),

    /**
    |--------------------------------------------------------------------------
    | Upload Preset From Cloudinary Dashboard
    |--------------------------------------------------------------------------
    |
    | If you want to use a preset when uploading images, you can configure it
    | here. You can create a preset in your Cloudinary dashboard.
    |
    */

    'upload_preset' => env('CLOUDINARY_UPLOAD_PRESET'),

    /**
    |--------------------------------------------------------------------------
    | Upload API URL From Cloudinary Dashboard
    |--------------------------------------------------------------------------
    |
    | If you need to specify a custom upload API URL, you can do so here.
    |
    */
    
    'upload_api_url' => env('CLOUDINARY_UPLOAD_API_URL', 'https://api.cloudinary.com/v1_1'),

    /**
    |--------------------------------------------------------------------------
    | Notification URL From Cloudinary Dashboard
    |--------------------------------------------------------------------------
    |
    | If you need to specify a custom notification URL, you can do so here.
    |
    */

    'notification_url' => env('CLOUDINARY_NOTIFICATION_URL'),

];

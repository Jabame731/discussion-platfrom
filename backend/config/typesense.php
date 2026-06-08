<?php

return [
    'api_key'  => env('TYPESENSE_API_KEY'),
    'host'     => env('TYPESENSE_HOST'),
    'port'     => (int) env('TYPESENSE_PORT'),
    'protocol' => env('TYPESENSE_PROTOCOL', 'http'),

    'search_only_api_key' => env('TYPESENSE_SEARCH_ONLY_API_KEY', ''),

    // Connection timeout in seconds
    'connection_timeout_seconds' => 5,

    // Retry logic
    'num_retries'          => 3,
    'retry_interval_seconds' => 0.1,
];

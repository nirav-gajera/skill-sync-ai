<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" id="html-root">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        {{-- <link rel="icon" href="{{ asset('images/skillsync-title.png') }}" type="image/png" /> --}}
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 34 34'>
            <defs>
                <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
                <stop offset='0%' stop-color='%230ea5e9'/>
                <stop offset='100%' stop-color='%236366f1'/>
                </linearGradient>
            </defs>
            <rect x='0' y='0' width='34' height='34' rx='9' fill='url(%23g)'/>
            <path d='M17 6L27 11V23L17 28L7 23V11L17 6Z'
                    stroke='white'
                    stroke-width='1.5'
                    fill='none'/>

            <circle cx='17' cy='17' r='3' fill='white'/>
            </svg>" />
        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>

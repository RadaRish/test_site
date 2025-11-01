<?php
// Скрипт для автоматизации галереи портфолио
// Возвращает JSON: [{name, folder, images: [..]}]
header('Content-Type: application/json; charset=utf-8');
$portfolioDir = __DIR__ . '/../img/portfolio';
$series = [];
foreach (glob($portfolioDir . '/*', GLOB_ONLYDIR) as $dir) {
    $name = basename($dir);
    $images = [];
    foreach (glob($dir . '/*.{jpg,jpeg,png,gif}', GLOB_BRACE) as $img) {
        $images[] = basename($img);
    }
    sort($images); // Первая по имени — превью
    $series[] = [
        'name' => $name,
        'folder' => $name,
        'images' => $images
    ];
}
echo json_encode($series, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);

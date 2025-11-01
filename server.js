const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 8080;

// Маршрут-совместимость c прежним PHP-скриптом (должен быть до статики!)
app.get('/assets/php/portfolio-list.php', async (req, res) => {
  try {
    const portfolioRoot = path.join(__dirname, 'assets', 'img', 'portfolio');
    let dirents;
    try {
      dirents = await fs.readdir(portfolioRoot, { withFileTypes: true });
    } catch (e) {
      // Если папки нет — вернём пустой список
      console.log('Portfolio directory not found, returning empty array');
      return res.json([]);
    }
    
    const series = [];
    for (const dirent of dirents) {
      if (!dirent.isDirectory()) continue;
      const folder = dirent.name;
      const full = path.join(portfolioRoot, folder);
      
      try {
        let files = await fs.readdir(full);
        files = files.filter(fn => /\.(jpe?g|png|gif|webp)$/i.test(fn));
        files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
        
        // Добавляем серию только если есть изображения
        if (files.length > 0) {
          series.push({ 
            name: folder, 
            folder: folder, 
            images: files 
          });
        }
      } catch (folderError) {
        console.error(`Error reading folder ${folder}:`, folderError);
        // Пропускаем эту папку, если не можем прочитать
        continue;
      }
    }
    
    console.log('Portfolio series found:', series);
    
    // Убедимся, что отправляем правильный Content-Type и чистый JSON
    res.set('Content-Type', 'application/json; charset=utf-8');
    // Отправляем JSON без лишних символов
    res.send(JSON.stringify(series));
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Failed to read portfolio folders' });
  }
});

// Статика: раздаём сайт из корня (должна быть после маршрутов!)
app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`Server is running at http://127.0.0.1:${PORT}`);
});
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;

// Маршрут-совместимость c прежним PHP-скриптом (должен быть до статики!)
app.get('/assets/php/portfolio-list.php', async (req, res) => {
  try {
    const portfolioRoot = path.join(__dirname, 'assets', 'img', 'portfolio');
    let dirents;
    try {
      dirents = await fs.promises.readdir(portfolioRoot, { withFileTypes: true });
    } catch (e) {
      // Если папки нет — вернём пустой список
      return res.json([]);
    }
    const series = [];
    for (const dirent of dirents) {
      if (!dirent.isDirectory()) continue;
      const folder = dirent.name;
      const full = path.join(portfolioRoot, folder);
      let files = await fs.promises.readdir(full);
      files = files.filter(fn => /\.(jpe?g|png|gif|webp)$/i.test(fn));
      files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
      series.push({ 
        name: folder, 
        folder: folder, 
        images: files 
      });
    }
    res.set('Content-Type', 'application/json; charset=utf-8');
    res.json(series);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to read portfolio folders' });
  }
});

// Статика: раздаём сайт из корня (должна быть после маршрутов!)
app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`Server is running at http://127.0.0.1:${PORT}`);
});
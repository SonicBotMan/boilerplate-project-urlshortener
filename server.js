// URL Shortener Microservice - FCC project 3
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.urlencoded({ extended: false }));
app.use('/public', express.static(process.cwd() + '/public'));

const urls = {}; // in-memory store: short_id -> original_url
let counter = 1;
const urlPattern = /^https?:\/\/.+\..+/;

app.post('/api/shorturl', (req, res) => {
  const original = req.body.url;
  let hostname;
  try { hostname = new URL(original).hostname; } catch (e) {}
  require('dns').lookup(hostname, (err) => {
    if (err || !urlPattern.test(original)) {
      res.json({ error: 'invalid url' });
    } else {
      const short = counter++;
      urls[short] = original;
      res.json({ original_url: original, short_url: short });
    }
  });
});

app.get('/api/shorturl/:short', (req, res) => {
  const target = urls[req.params.short];
  if (target) res.redirect(target);
  else res.json({ error: 'invalid url' });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Listening on port ' + listener.address().port);
});
module.exports = app;

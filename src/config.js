const fs = require('fs');
const path = require('path');

const REQUIRED = ['name', 'githubLogin', 'titlePage', 'now', 'projects', 'colophon'];

function loadConfig(file = path.join(__dirname, '..', 'profile.config.json')) {
  const cfg = JSON.parse(fs.readFileSync(file, 'utf8'));
  const missing = REQUIRED.filter((k) => cfg[k] === undefined);
  if (missing.length) throw new Error(`Config missing required field(s): ${missing.join(', ')}`);

  const t = cfg.titlePage;
  if (!t.role || !t.fields) {
    throw new Error('Config missing required field: titlePage.role/fields');
  }
  if (!cfg.now.name || !Array.isArray(cfg.now.lines) || cfg.now.lines.length === 0) {
    throw new Error('Config missing required field: now.name/lines');
  }
  if (!Array.isArray(cfg.projects) || cfg.projects.length === 0) {
    throw new Error('Config missing required field: projects');
  }
  cfg.projects.forEach((p, i) => {
    for (const k of ['name', 'description', 'language', 'year', 'url']) {
      if (!p[k]) throw new Error(`Config missing required field: projects[${i}].${k}`);
    }
  });
  if (!cfg.colophon.note) {
    throw new Error('Config missing required field: colophon.note');
  }
  if (cfg.colophon.addresses !== undefined
    && (!Array.isArray(cfg.colophon.addresses) || cfg.colophon.addresses.some((address) => !address))) {
    throw new Error('Config field colophon.addresses must be an array of non-empty strings');
  }
  return cfg;
}

module.exports = { loadConfig };

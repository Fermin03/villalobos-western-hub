const b = require('bcryptjs');
b.hash('VillalobosAdmin2024', 10).then(h => {
  console.log('Nuevo hash:', h);
  // Verificar que funciona
  b.compare('VillalobosAdmin2024', h).then(r => console.log('Verificacion:', r));
});
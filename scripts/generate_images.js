const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const imgDir = path.join(__dirname, "..", "assets", "img");

// Helper to create an SVG and render to WebP
async function renderSVGToWebP(filename, svgString, width = 600, height = 450) {
  const filePath = path.join(imgDir, filename);
  const buffer = Buffer.from(svgString);
  await sharp(buffer)
    .resize(width, height)
    .webp({ quality: 90 })
    .toFile(filePath);
  console.log(`Generated ${filename} (${width}x${height})`);
}

async function generateAllImages() {
  // 1. Hilo Nylon (CE-5001) - Thread cones (Brown, Black, White) with needle and thread details
  const svgHiloNylon = `
  <svg width="600" height="450" viewBox="0 0 600 450" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#2D3748"/>
        <stop offset="100%" stop-color="#1A202C"/>
      </linearGradient>
      <linearGradient id="threadBrown" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#5C3A21"/>
        <stop offset="50%" stop-color="#8B5E34"/>
        <stop offset="100%" stop-color="#3D2614"/>
      </linearGradient>
      <linearGradient id="threadBlack" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#1A1A1A"/>
        <stop offset="50%" stop-color="#404040"/>
        <stop offset="100%" stop-color="#0F0F0F"/>
      </linearGradient>
      <linearGradient id="threadWhite" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#E2E8F0"/>
        <stop offset="50%" stop-color="#FFFFFF"/>
        <stop offset="100%" stop-color="#CBD5E0"/>
      </linearGradient>
      <linearGradient id="spoolCone" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#E2E8F0"/>
        <stop offset="100%" stop-color="#A0AEC0"/>
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="12" stdDeviation="10" flood-opacity="0.5"/>
      </filter>
    </defs>
    <rect width="600" height="450" fill="url(#bg)"/>

    <g filter="url(#shadow)">
      <!-- Main Cone (Brown) -->
      <path d="M 230 380 L 250 140 L 350 140 L 370 380 Z" fill="url(#threadBrown)"/>
      <ellipse cx="300" cy="140" rx="50" ry="12" fill="#8B5E34"/>
      <ellipse cx="300" cy="380" rx="70" ry="16" fill="#3D2614"/>
      <!-- Top Cone Tip -->
      <polygon points="285,140 315,140 310,110 290,110" fill="url(#spoolCone)"/>
      
      <!-- Second Cone (Black - left back) -->
      <path d="M 120 360 L 140 160 L 220 160 L 240 360 Z" fill="url(#threadBlack)"/>
      <ellipse cx="180" cy="160" rx="40" ry="10" fill="#404040"/>
      <ellipse cx="180" cy="360" rx="60" ry="14" fill="#0F0F0F"/>
      <polygon points="168,160 192,160 188,135 172,135" fill="url(#spoolCone)"/>

      <!-- Third Cone (White - right back) -->
      <path d="M 360 360 L 380 160 L 460 160 L 480 360 Z" fill="url(#threadWhite)"/>
      <ellipse cx="420" cy="160" rx="40" ry="10" fill="#FFFFFF"/>
      <ellipse cx="420" cy="360" rx="60" ry="14" fill="#CBD5E0"/>
      <polygon points="408,160 432,160 428,135 412,135" fill="url(#spoolCone)"/>

      <!-- Decorative Thread Strand -->
      <path d="M 300 140 C 250 100 180 220 100 240" fill="none" stroke="#D9A066" stroke-width="4" stroke-linecap="round"/>
      <!-- Needle -->
      <path d="M 100 240 L 60 250 L 105 235 Z" fill="#E2E8F0"/>
      <line x1="100" y1="240" x2="45" y2="255" stroke="#CBD5E0" stroke-width="3" stroke-linecap="round"/>
    </g>
  </svg>`;

  // 2. Hilo Poliéster (CE-5002) - Polyester Thread Cones
  const svgHiloPoliester = `
  <svg width="600" height="450" viewBox="0 0 600 450" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1E293B"/>
        <stop offset="100%" stop-color="#0F172A"/>
      </linearGradient>
      <linearGradient id="pBlack" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#111827"/>
        <stop offset="50%" stop-color="#374151"/>
        <stop offset="100%" stop-color="#030712"/>
      </linearGradient>
      <linearGradient id="pWhite" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#F1F5F9"/>
        <stop offset="50%" stop-color="#FFFFFF"/>
        <stop offset="100%" stop-color="#E2E8F0"/>
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="12" stdDeviation="10" flood-opacity="0.5"/>
      </filter>
    </defs>
    <rect width="600" height="450" fill="url(#bg)"/>

    <g filter="url(#shadow)">
      <!-- Large Black Cone -->
      <path d="M 170 380 L 200 130 L 300 130 L 330 380 Z" fill="url(#pBlack)"/>
      <ellipse cx="250" cy="130" rx="50" ry="12" fill="#374151"/>
      <ellipse cx="250" cy="380" rx="80" ry="18" fill="#030712"/>
      <polygon points="235,130 265,130 260,95 240,95" fill="#94A3B8"/>

      <!-- Large White Cone -->
      <path d="M 310 380 L 340 130 L 440 130 L 470 380 Z" fill="url(#pWhite)"/>
      <ellipse cx="390" cy="130" rx="50" ry="12" fill="#FFFFFF"/>
      <ellipse cx="390" cy="380" rx="80" ry="18" fill="#CBD5E0"/>
      <polygon points="375,130 405,130 400,95 380,95" fill="#94A3B8"/>
    </g>
  </svg>`;

  // 3. Adhesivo de Contacto (CE-6001) - Can of contact adhesive with amber glue stroke
  const svgAdhesivoContacto = `
  <svg width="600" height="450" viewBox="0 0 600 450" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#334155"/>
        <stop offset="100%" stop-color="#0F172A"/>
      </linearGradient>
      <linearGradient id="canMetal" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#94A3B8"/>
        <stop offset="30%" stop-color="#F8FAFC"/>
        <stop offset="70%" stop-color="#CBD5E0"/>
        <stop offset="100%" stop-color="#64748B"/>
      </linearGradient>
      <linearGradient id="amberGlue" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#F59E0B"/>
        <stop offset="50%" stop-color="#D97706"/>
        <stop offset="100%" stop-color="#92400E"/>
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="12" stdDeviation="12" flood-opacity="0.5"/>
      </filter>
    </defs>
    <rect width="600" height="450" fill="url(#bg)"/>

    <g filter="url(#shadow)">
      <!-- Can Body -->
      <rect x="200" y="140" width="200" height="240" rx="12" fill="url(#canMetal)"/>
      <ellipse cx="300" cy="140" rx="100" ry="18" fill="#E2E8F0" stroke="#94A3B8" stroke-width="4"/>
      <ellipse cx="300" cy="140" rx="80" ry="14" fill="#CBD5E0"/>
      
      <!-- Label -->
      <rect x="200" y="180" width="200" height="150" fill="#4E6E1C"/>
      <rect x="200" y="195" width="200" height="36" fill="#93DC1D"/>
      <text x="300" y="218" text-anchor="middle" fill="#14170F" font-family="Arial, sans-serif" font-weight="bold" font-size="16">COMERCIAL ELITE</text>
      <text x="300" y="255" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-weight="bold" font-size="15">ADHESIVO DE CONTACTO</text>
      <text x="300" y="278" text-anchor="middle" fill="#E9F4D7" font-family="Arial, sans-serif" font-size="12">Base Solvente Industrial — 3.7 L</text>

      <!-- Glue Spill/Spatula -->
      <path d="M 400 320 C 440 330 460 370 510 370 C 530 370 510 390 470 390 C 420 390 400 370 380 360 Z" fill="url(#amberGlue)"/>
      <ellipse cx="490" cy="375" rx="25" ry="8" fill="#FBBF24" opacity="0.6"/>
    </g>
  </svg>`;

  // 4. Cemento PU (CE-6002) - Polyurethane Cement Kit
  const svgCementoPU = `
  <svg width="600" height="450" viewBox="0 0 600 450" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1E293B"/>
        <stop offset="100%" stop-color="#0F172A"/>
      </linearGradient>
      <linearGradient id="container" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#E2E8F0"/>
        <stop offset="50%" stop-color="#FFFFFF"/>
        <stop offset="100%" stop-color="#CBD5E0"/>
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="12" stdDeviation="12" flood-opacity="0.5"/>
      </filter>
    </defs>
    <rect width="600" height="450" fill="url(#bg)"/>

    <g filter="url(#shadow)">
      <!-- Main Container -->
      <rect x="160" y="150" width="180" height="230" rx="10" fill="url(#container)"/>
      <ellipse cx="250" cy="150" rx="90" ry="16" fill="#94A3B8"/>
      <rect x="160" y="190" width="180" height="130" fill="#2563EB"/>
      <text x="250" y="230" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-weight="bold" font-size="16">CEMENTO PU</text>
      <text x="250" y="255" text-anchor="middle" fill="#93C5FD" font-family="Arial, sans-serif" font-weight="bold" font-size="12">BICOMPONENTE</text>
      <text x="250" y="285" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="11">Alta Exigencia - Kit 1kg</text>

      <!-- Catalyst Bottle (Smaller) -->
      <rect x="370" y="220" width="90" height="160" rx="8" fill="url(#container)"/>
      <ellipse cx="415" cy="220" rx="45" ry="10" fill="#94A3B8"/>
      <rect x="370" y="250" width="90" height="90" fill="#D97706"/>
      <text x="415" y="295" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-weight="bold" font-size="11">CATALIZADOR</text>
    </g>
  </svg>`;

  // 5. Ojalillo Metálico (CE-7001) - Metallic Eyelets
  const svgOjalillo = `
  <svg width="600" height="450" viewBox="0 0 600 450" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#334155"/>
        <stop offset="100%" stop-color="#0F172A"/>
      </linearGradient>
      <radialGradient id="silverEyelet" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="40%" stop-color="#E2E8F0"/>
        <stop offset="80%" stop-color="#64748B"/>
        <stop offset="100%" stop-color="#334155"/>
      </radialGradient>
      <radialGradient id="goldEyelet" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stop-color="#FEF08A"/>
        <stop offset="40%" stop-color="#EAB308"/>
        <stop offset="80%" stop-color="#CA8A04"/>
        <stop offset="100%" stop-color="#854D0E"/>
      </radialGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="6" flood-opacity="0.4"/>
      </filter>
    </defs>
    <rect width="600" height="450" fill="url(#bg)"/>

    <!-- Leather Surface Background -->
    <rect x="80" y="60" width="440" height="330" rx="16" fill="#8B5E34"/>
    <rect x="95" y="75" width="410" height="300" rx="12" fill="none" stroke="#D9A066" stroke-width="2" stroke-dasharray="8 6"/>

    <g filter="url(#shadow)">
      <!-- Silver Eyelets in Row -->
      <circle cx="180" cy="170" r="32" fill="url(#silverEyelet)"/>
      <circle cx="180" cy="170" r="18" fill="#1E293B"/>

      <circle cx="280" cy="170" r="32" fill="url(#silverEyelet)"/>
      <circle cx="280" cy="170" r="18" fill="#1E293B"/>

      <circle cx="380" cy="170" r="32" fill="url(#silverEyelet)"/>
      <circle cx="380" cy="170" r="18" fill="#1E293B"/>

      <!-- Gold Eyelets in Row -->
      <circle cx="180" cy="270" r="32" fill="url(#goldEyelet)"/>
      <circle cx="180" cy="270" r="18" fill="#1E293B"/>

      <circle cx="280" cy="270" r="32" fill="url(#goldEyelet)"/>
      <circle cx="280" cy="270" r="18" fill="#1E293B"/>

      <circle cx="380" cy="270" r="32" fill="url(#goldEyelet)"/>
      <circle cx="380" cy="270" r="18" fill="#1E293B"/>
    </g>
  </svg>`;

  // 6. Hebilla (CE-7002) - Metallic Buckles
  const svgHebilla = `
  <svg width="600" height="450" viewBox="0 0 600 450" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1E293B"/>
        <stop offset="100%" stop-color="#0F172A"/>
      </linearGradient>
      <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#FEF08A"/>
        <stop offset="50%" stop-color="#EAB308"/>
        <stop offset="100%" stop-color="#A16207"/>
      </linearGradient>
      <linearGradient id="silver" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="50%" stop-color="#CBD5E0"/>
        <stop offset="100%" stop-color="#475569"/>
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="10" stdDeviation="8" flood-opacity="0.5"/>
      </filter>
    </defs>
    <rect width="600" height="450" fill="url(#bg)"/>

    <g filter="url(#shadow)">
      <!-- Gold Buckle -->
      <rect x="100" y="140" width="170" height="170" rx="20" fill="url(#gold)"/>
      <rect x="130" y="170" width="110" height="110" rx="10" fill="#0F172A"/>
      <rect x="180" y="130" width="10" height="190" fill="url(#gold)"/>

      <!-- Silver Buckle -->
      <rect x="330" y="140" width="170" height="170" rx="20" fill="url(#silver)"/>
      <rect x="360" y="170" width="110" height="110" rx="10" fill="#0F172A"/>
      <rect x="410" y="130" width="10" height="190" fill="url(#silver)"/>
    </g>
  </svg>`;

  // 7. Cuchilla de Desbastar (CE-8001) - Leather Skiving Knife
  const svgCuchilla = `
  <svg width="600" height="450" viewBox="0 0 600 450" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#334155"/>
        <stop offset="100%" stop-color="#0F172A"/>
      </linearGradient>
      <linearGradient id="blade" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#F8FAFC"/>
        <stop offset="40%" stop-color="#E2E8F0"/>
        <stop offset="80%" stop-color="#94A3B8"/>
        <stop offset="100%" stop-color="#475569"/>
      </linearGradient>
      <linearGradient id="woodHandle" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#78350F"/>
        <stop offset="50%" stop-color="#B45309"/>
        <stop offset="100%" stop-color="#451A03"/>
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="12" stdDeviation="10" flood-opacity="0.5"/>
      </filter>
    </defs>
    <rect width="600" height="450" fill="url(#bg)"/>

    <g filter="url(#shadow)">
      <!-- Blade -->
      <path d="M 120 280 L 360 120 L 400 160 L 160 320 Z" fill="url(#blade)"/>
      <line x1="120" y1="280" x2="360" y2="120" stroke="#FFFFFF" stroke-width="4"/>

      <!-- Wooden Handle -->
      <path d="M 360 120 L 480 40 L 520 80 L 400 160 Z" fill="url(#woodHandle)"/>
      <circle cx="430" cy="110" r="5" fill="#D97706"/>
      <circle cx="470" cy="70" r="5" fill="#D97706"/>
    </g>
  </svg>`;

  // 8. Martillo de Zapatero (CE-8002) - Cobbler Hammer
  const svgMartillo = `
  <svg width="600" height="450" viewBox="0 0 600 450" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1E293B"/>
        <stop offset="100%" stop-color="#0F172A"/>
      </linearGradient>
      <linearGradient id="steelHead" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#F1F5F9"/>
        <stop offset="50%" stop-color="#94A3B8"/>
        <stop offset="100%" stop-color="#334155"/>
      </linearGradient>
      <linearGradient id="handleWood" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#D97706"/>
        <stop offset="50%" stop-color="#92400E"/>
        <stop offset="100%" stop-color="#451A03"/>
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="12" stdDeviation="10" flood-opacity="0.5"/>
      </filter>
    </defs>
    <rect width="600" height="450" fill="url(#bg)"/>

    <g filter="url(#shadow)">
      <!-- Wood Handle -->
      <rect x="280" y="160" width="40" height="250" rx="10" fill="url(#handleWood)"/>

      <!-- Steel Double Hammer Head -->
      <path d="M 140 140 C 140 120 200 120 300 120 C 400 120 460 110 460 140 C 460 170 400 160 300 160 C 200 160 140 160 140 140 Z" fill="url(#steelHead)"/>
      <ellipse cx="140" cy="140" rx="20" ry="25" fill="#CBD5E0"/>
      <ellipse cx="460" cy="140" rx="15" ry="20" fill="#94A3B8"/>
    </g>
  </svg>`;

  // 9. Sintético Serpiente (CE-2011) - Snake Pattern Synthetic
  const svgSinteticoSerpiente = `
  <svg width="600" height="450" viewBox="0 0 600 450" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#78350F"/>
        <stop offset="50%" stop-color="#D97706"/>
        <stop offset="100%" stop-color="#451A03"/>
      </linearGradient>
      <pattern id="scales" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 0 20 Q 20 0 40 20 Q 20 40 0 20 Z" fill="none" stroke="#FEF3C7" stroke-width="2" opacity="0.6"/>
        <path d="M 20 0 Q 40 20 20 40 Q 0 20 20 0 Z" fill="#92400E" opacity="0.4"/>
      </pattern>
    </defs>
    <rect width="600" height="450" fill="url(#bg)"/>
    <rect width="600" height="450" fill="url(#scales)"/>
  </svg>`;

  // 10. Plantilla Látex (CE-4002) - Latex Insoles
  const svgPlantillaLatex = `
  <svg width="600" height="450" viewBox="0 0 600 450" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#334155"/>
        <stop offset="100%" stop-color="#0F172A"/>
      </linearGradient>
      <linearGradient id="insoleBeige" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#FEF3C7"/>
        <stop offset="50%" stop-color="#FDE68A"/>
        <stop offset="100%" stop-color="#D97706"/>
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="12" stdDeviation="10" flood-opacity="0.5"/>
      </filter>
    </defs>
    <rect width="600" height="450" fill="url(#bg)"/>

    <g filter="url(#shadow)">
      <!-- Left Insole -->
      <path d="M 200 80 C 260 80 270 180 250 280 C 240 330 220 380 180 380 C 140 380 130 320 140 250 C 150 180 140 80 200 80 Z" fill="url(#insoleBeige)"/>
      <path d="M 200 100 C 240 100 250 180 235 270" fill="none" stroke="#B45309" stroke-width="3" stroke-dasharray="6 4"/>

      <!-- Right Insole -->
      <path d="M 400 80 C 340 80 330 180 350 280 C 360 330 380 380 420 380 C 460 380 470 320 460 250 C 450 180 460 80 400 80 Z" fill="url(#insoleBeige)"/>
      <path d="M 400 100 C 360 100 350 180 365 270" fill="none" stroke="#B45309" stroke-width="3" stroke-dasharray="6 4"/>
    </g>
  </svg>`;

  await renderSVGToWebP("ce-5001-hilo-nylon.webp", svgHiloNylon);
  await renderSVGToWebP("ce-5002-hilo-poliester.webp", svgHiloPoliester);
  await renderSVGToWebP("ce-6001-adhesivo-contacto.webp", svgAdhesivoContacto);
  await renderSVGToWebP("ce-6002-cemento-pu.webp", svgCementoPU);
  await renderSVGToWebP("ce-7001-ojalillo.webp", svgOjalillo);
  await renderSVGToWebP("ce-7002-hebilla.webp", svgHebilla);
  await renderSVGToWebP("ce-8001-cuchilla.webp", svgCuchilla);
  await renderSVGToWebP("ce-8002-martillo.webp", svgMartillo);
  await renderSVGToWebP("ce-2011-sintetico-serpiente.webp", svgSinteticoSerpiente);
  await renderSVGToWebP("ce-4002-plantilla-latex.webp", svgPlantillaLatex);

  console.log("All product images generated successfully!");
}

generateAllImages().catch(console.error);

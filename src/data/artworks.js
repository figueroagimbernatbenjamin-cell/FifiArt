export const CATEGORIES = ["Todos", "Abstracto", "Botánico", "Textura Minimalista"];

export function hashSeed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function placeholderArt(seed, w = 700, h = 900) {
  const hue1 = hashSeed(seed) % 360;
  const hue2 = (hue1 + 35) % 360;
  const hue3 = (hue1 + 200) % 360;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}'>
    <rect width='100%' height='100%' fill='hsl(${hue1},22%,90%)'/>
    <circle cx='${w * 0.28}' cy='${h * 0.32}' r='${w * 0.42}' fill='hsl(${hue2},40%,74%)' opacity='0.6'/>
    <circle cx='${w * 0.78}' cy='${h * 0.68}' r='${w * 0.36}' fill='hsl(${hue3},35%,66%)' opacity='0.55'/>
    <circle cx='${w * 0.55}' cy='${h * 0.5}' r='${w * 0.22}' fill='hsl(${hue1},30%,80%)' opacity='0.5'/>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const REAL_ART_IMAGES = {
  1: new URL("../../Cuadro 1.JPG", import.meta.url).href,
  2: new URL("../../Cuadro 2.JPG", import.meta.url).href,
  3: new URL("../../Cuadro 3.JPG", import.meta.url).href,
  4: new URL("../../Cuadro 4.JPG", import.meta.url).href,
  5: new URL("../../Cuadro 5.JPG", import.meta.url).href,
  6: new URL("../../Cuadro 6 Mejorado.jpg", import.meta.url).href,
  7: new URL("../../Cuadro 7 Mejorado.jpg", import.meta.url).href,
  8: new URL("../../Cuadro 8.JPG", import.meta.url).href,
  9: new URL("../../Cuadro 9.JPG", import.meta.url).href,
  10: new URL("../../Cuadro 10.JPG", import.meta.url).href,
  11: new URL("../../Cuadro 11.JPG", import.meta.url).href,
  12: new URL("../../Cuadro 12.JPG", import.meta.url).href,
  13: new URL("../../Cuadro 13.JPG", import.meta.url).href,
  14: new URL("../../Cuadro 14.JPG", import.meta.url).href,
  15: new URL("../../Cuadro 15.png", import.meta.url).href,
  17: new URL("../../Cuadro 17.jpg", import.meta.url).href,
};

export const ARTWORKS = [
  { id: 1, title: "Cuadro 1", category: "Abstracto", size: "", price: "Vendido", seed: "cuadro-1", tall: true, image: REAL_ART_IMAGES[1], imagePosition: "50% 36%", sold: true },
  { id: 2, title: "Cuadro 2", category: "Botánico", size: "90x80 cm", previousPrice: "$300.000", price: "$250.000", seed: "cuadro-2", image: REAL_ART_IMAGES[2], imagePosition: "50% 52%", sold: false },
  { id: 3, title: "Cuadro 3", category: "Abstracto", size: "", price: "Vendido", seed: "cuadro-3", tall: true, image: REAL_ART_IMAGES[3], imagePosition: "50% 44%", sold: true },
  { id: 4, title: "Cuadro 4", category: "Textura Minimalista", size: "90x70 cm", previousPrice: "$320.000", price: "$280.000", seed: "cuadro-4", image: REAL_ART_IMAGES[4], imagePosition: "50% 50%", sold: false },
  { id: 5, title: "Cuadro 5", category: "Abstracto", size: "1,10 x 90 cm", previousPrice: "$400.000", price: "$350.000", seed: "cuadro-5", image: REAL_ART_IMAGES[5], imagePosition: "50% 52%", sold: false },
  { id: 6, title: "Cuadro 6", category: "Botánico", size: "", price: "Vendido", seed: "cuadro-6", tall: true, image: REAL_ART_IMAGES[6], imagePosition: "50% 38%", sold: true },
  { id: 7, title: "Cuadro 7", category: "Abstracto", size: "", price: "Vendido", seed: "cuadro-7", image: REAL_ART_IMAGES[7], imagePosition: "50% 50%", sold: true },
  { id: 8, title: "Cuadro 8", category: "Textura Minimalista", size: "", price: "Vendido", seed: "cuadro-8", image: REAL_ART_IMAGES[8], imagePosition: "50% 50%", sold: true },
  { id: 9, title: "Cuadro 9", category: "Abstracto", size: "1,30 x 90 cm", price: "Vendido", seed: "cuadro-9", tall: true, image: REAL_ART_IMAGES[9], imagePosition: "50% 40%", sold: true },
  { id: 10, title: "Cuadro 10", category: "Botánico", size: "70x90 cm", previousPrice: "$300.000", price: "$260.000", seed: "cuadro-10", tall: true, image: REAL_ART_IMAGES[10], imagePosition: "50% 48%", sold: false },
  { id: 11, title: "Cuadro 11", category: "Abstracto", size: "", price: "Vendido", seed: "cuadro-11", tall: true, image: REAL_ART_IMAGES[11], imagePosition: "50% 40%", sold: true },
  { id: 12, title: "Cuadro 12", category: "Botánico", size: "50x60 cm", previousPrice: "$300.000", price: "$260.000", seed: "cuadro-12", tall: true, image: REAL_ART_IMAGES[12], imagePosition: "50% 50%", sold: false },
  { id: 13, title: "Cuadro 13", category: "Abstracto", size: "50x65 cm", previousPrice: "$230.000", price: "$200.000", seed: "cuadro-13", tall: true, image: REAL_ART_IMAGES[13], imagePosition: "50% 50%", sold: false },
  { id: 14, title: "Cuadro 14", category: "Abstracto", size: "60x90 cm", previousPrice: "$310.000", price: "$280.000", seed: "cuadro-14", image: REAL_ART_IMAGES[14], imagePosition: "50% 50%", sold: true },
  { id: 15, title: "Cuadro 15", category: "Abstracto", size: "100x100 cm", previousPrice: "$320.000", price: "$300.000", seed: "cuadro-15", image: REAL_ART_IMAGES[15], imagePosition: "50% 50%", sold: false },
  { id: 17, title: "Cuadro 17", category: "Abstracto", size: "", price: "", seed: "cuadro-17", tall: true, image: REAL_ART_IMAGES[17], imagePosition: "50% 50%", sold: false },
];

export const WHATSAPP_NUMBER = "5492645059194";

export function buildWhatsAppUrl(text = "") {
  const query = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${WHATSAPP_NUMBER}${query}`;
}

import productIntercom from "@/assets/product-intercom.jpg";
import productMonitor from "@/assets/product-monitor.jpg";
import productStarlink from "@/assets/product-starlink.jpg";

export interface Product {
  id: string;
  name: string;
  price: number;
  priceFormatted: string;
  category: string;
  description: string;
  image: string;
  specs?: string[];
}

export const products: Product[] = [
  {
    id: "hikvision-intercom",
    name: 'Hikvision Video Intercom Indoor Station WiFi 7" Touch DS-KH6320-WTE1',
    price: 339900,
    priceFormatted: "339,900₮",
    category: "Аюулгүй байдлын цогц үйлчилгээ",
    description:
      "7 инчийн мэдрэгчтэй дэлгэцтэй, WiFi холболттой видео интерком дотоод станц. Өндөр нягтралтай камертай, хоёр талын аудио дэмжлэгтэй.",
    image: productIntercom,
    specs: [
      "7 инч мэдрэгч дэлгэц",
      "WiFi холболт",
      "HD видео чанар",
      "Хоёр талын аудио",
      "SIP протокол дэмжлэг",
      "Micro SD карт слот",
    ],
  },
  {
    id: "led-monitor-24",
    name: "24 инчийн LED дэлгэц",
    price: 267325,
    priceFormatted: "267,325₮",
    category: "Технологи ба электрон бүтээгдэхүүн",
    description:
      "24 инчийн Full HD LED дэлгэц. Өндөр тод байдал, бага эрчим хүч зарцуулалттай, тохиромжтой ажлын орчинд.",
    image: productMonitor,
    specs: [
      "24 инч Full HD (1920x1080)",
      "IPS панел",
      "75Hz шинэчлэлтийн хурд",
      "HDMI, VGA оролт",
      "VESA уулзвар дэмжлэг",
      "Нүдний хамгаалалт",
    ],
  },
  {
    id: "starlink-device",
    name: "StarLink Интернэт төхөөрөмж",
    price: 1870000,
    priceFormatted: "1,870,000₮",
    category: "Шилэн кабелийн сүлжээ ба интернэт",
    description:
      "Starlink хиймэл дагуулын интернэт төхөөрөмж. Алслагдсан газар нутагт өндөр хурдны интернэт хүргэнэ.",
    image: productStarlink,
    specs: [
      "Хиймэл дагуулын интернэт",
      "50-200 Mbps хурд",
      "Автомат чиглүүлэлт",
      "IP54 тэсвэрлэл",
      "WiFi 6 дэмжлэг",
      "Хялбар суурилуулалт",
    ],
  },
];

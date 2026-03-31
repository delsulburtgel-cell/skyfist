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


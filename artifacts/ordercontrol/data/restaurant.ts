export const RESTAURANT = {
  name: "OrderControl Restaurant",
  tagline: "Sabor que você vai amar",
  whatsapp: "5511999999999",
  phone: "(11) 9999-9999",
  address: "Av. Paulista, 1000",
  city: "São Paulo, SP",
  openingHours: [
    { day: "Seg - Sex", hours: "11h às 23h" },
    { day: "Sábado", hours: "11h às 00h" },
    { day: "Domingo", hours: "12h às 22h" },
  ],
  isOpen: true,
  deliveryFee: 5.0,
  minOrder: 20.0,
  estimatedTime: 30,
  instagram: "@ordercontrol",
  facebook: "OrderControl",
};

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  promoPrice?: number;
  categoryId: string;
  image?: string;
  available: boolean;
  isPromo?: boolean;
  extras?: string[];
}

export const CATEGORIES: Category[] = [
  { id: "1", name: "Lanches", icon: "🍔" },
  { id: "2", name: "Pratos", icon: "🍽️" },
  { id: "3", name: "Pizzas", icon: "🍕" },
  { id: "4", name: "Sobremesas", icon: "🍰" },
  { id: "5", name: "Bebidas", icon: "🥤" },
  { id: "6", name: "Combos", icon: "🎁" },
];

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "X-Burguer Premium",
    description: "Hambúrguer artesanal 200g, queijo cheddar, alface, tomate, bacon crocante e molho especial da casa",
    price: 32.9,
    promoPrice: 28.9,
    categoryId: "1",
    available: true,
    isPromo: true,
    extras: ["Bacon extra", "Queijo extra", "Ovo", "Cebola caramelizada"],
  },
  {
    id: "2",
    name: "X-Salada",
    description: "Hambúrguer 150g, queijo, alface, tomate e maionese",
    price: 24.9,
    categoryId: "1",
    available: true,
    extras: ["Bacon", "Queijo extra", "Ovo"],
  },
  {
    id: "3",
    name: "Frango Grelhado",
    description: "Filé de frango grelhado com arroz, feijão, salada e farofa",
    price: 28.9,
    categoryId: "2",
    available: true,
    extras: ["Purê de batata", "Macarrão", "Batata frita"],
  },
  {
    id: "4",
    name: "Picanha na Brasa",
    description: "Picanha grelhada 300g com arroz, feijão, vinagrete e farofa",
    price: 52.9,
    categoryId: "2",
    available: true,
    extras: ["Banana grelhada", "Queijo coalho", "Mandioca"],
  },
  {
    id: "5",
    name: "Pizza Margherita",
    description: "Molho de tomate, mussarela, manjericão fresco e azeite extra virgem",
    price: 42.9,
    categoryId: "3",
    available: true,
    extras: ["Borda recheada", "Tomate extra", "Azeitonas"],
  },
  {
    id: "6",
    name: "Pizza Calabresa",
    description: "Molho de tomate, mussarela e calabresa fatiada com cebola",
    price: 39.9,
    categoryId: "3",
    available: true,
    extras: ["Borda recheada", "Pimentão"],
  },
  {
    id: "7",
    name: "Petit Gateau",
    description: "Bolo quente de chocolate com sorvete de creme e calda de caramelo",
    price: 18.9,
    categoryId: "4",
    available: true,
  },
  {
    id: "8",
    name: "Pudim de Leite",
    description: "Pudim tradicional com calda de caramelo",
    price: 12.9,
    categoryId: "4",
    available: true,
  },
  {
    id: "9",
    name: "Refrigerante Lata",
    description: "Coca-Cola, Guaraná, Sprite ou Fanta 350ml",
    price: 6.0,
    categoryId: "5",
    available: true,
  },
  {
    id: "10",
    name: "Suco Natural",
    description: "Laranja, limão, maracujá ou abacaxi 400ml",
    price: 9.9,
    categoryId: "5",
    available: true,
  },
  {
    id: "11",
    name: "Combo Família",
    description: "2 X-Burguer Premium + 2 Refrigerantes + 1 Batata Grande",
    price: 79.9,
    promoPrice: 69.9,
    categoryId: "6",
    available: true,
    isPromo: true,
  },
  {
    id: "12",
    name: "Combo Casal",
    description: "2 Pratos do dia + 2 Sucos Naturais",
    price: 58.9,
    promoPrice: 52.9,
    categoryId: "6",
    available: true,
    isPromo: true,
  },
];

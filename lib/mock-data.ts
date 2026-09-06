import type { Category, Product, Testimonial } from "@/types/woocommerce";

const INR = (amount: string) => ({
  amount,
  currencyCode: "INR",
  currencySymbol: "₹",
});

export const categories: Category[] = [
  {
    id: "cat_21",
    databaseId: 21,
    name: "Demi Fine",
    slug: "demi-fine",
    description: "",
    image: {
      id: "img_cat_21",
      sourceUrl:
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop",
      altText: "Demi Fine",
    },
    count: 30,
  },
  {
    id: "cat_18",
    databaseId: 18,
    name: "Earring",
    slug: "earring",
    description: "",
    image: {
      id: "img_cat_18",
      sourceUrl:
        "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?q=80&w=800&auto=format&fit=crop",
      altText: "Earring",
    },
    count: 13,
  },
  {
    id: "cat_44",
    databaseId: 44,
    name: "Ethnic",
    slug: "ethnic",
    description: "",
    image: {
      id: "img_cat_44",
      sourceUrl:
        "https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?q=80&w=800&auto=format&fit=crop",
      altText: "Ethnic",
    },
    count: 1,
  },
  {
    id: "cat_20",
    databaseId: 20,
    name: "New Launch",
    slug: "new-launch",
    description: "",
    image: {
      id: "img_cat_20",
      sourceUrl:
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
      altText: "New Launch",
    },
    count: 9,
  },
  {
    id: "cat_31",
    databaseId: 31,
    name: "Our-Collection",
    slug: "our-collection",
    description: "",
    image: {
      id: "img_cat_31",
      sourceUrl:
        "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop",
      altText: "Our-Collection",
    },
    count: 5,
  },
  {
    id: "cat_16",
    databaseId: 16,
    name: "Pendant",
    slug: "pendant",
    description: "",
    image: {
      id: "img_cat_16",
      sourceUrl:
        "https://images.unsplash.com/photo-1608042314453-ae338d80c427?q=80&w=800&auto=format&fit=crop",
      altText: "Pendant",
    },
    count: 34,
  },
  {
    id: "cat_19",
    databaseId: 19,
    name: "Western",
    slug: "western",
    description: "",
    image: {
      id: "img_cat_19",
      sourceUrl:
        "https://images.unsplash.com/photo-1629224316810-9d8805b95e76?q=80&w=800&auto=format&fit=crop",
      altText: "Western",
    },
    count: 35,
  },
];

export const products: Product[] = [
  {
    id: "prod_1",
    databaseId: 201,
    name: "Aria Solitaire Ring",
    slug: "aria-solitaire-ring",
    type: "VARIABLE",
    sku: "RG-AR-001",
    shortDescription: "A single round-cut stone set high on a knife-edge band.",
    price: INR("48500"),
    regularPrice: INR("54000"),
    salePrice: INR("48500"),
    onSale: true,
    averageRating: 4.8,
    reviewCount: 32,
    stockStatus: "IN_STOCK",
    images: [
      {
        id: "img_1a",
        sourceUrl:
          "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop",
        altText: "Aria solitaire ring, front view",
      },
      {
        id: "img_1b",
        sourceUrl:
          "https://images.unsplash.com/photo-1603561596112-0a132b757442?q=80&w=1000&auto=format&fit=crop",
        altText: "Aria solitaire ring, worn on hand",
      },
    ],
    categories: [{ id: "cat_21", name: "Demi Fine", slug: "demi-fine" }],
    attributes: [
      {
        id: "attr_size",
        name: "Ring Size",
        slug: "ring-size",
        options: ["12", "13", "14", "15", "16"],
        variation: true,
      },
    ],
  },
  {
    id: "prod_2",
    databaseId: 202,
    name: "Veyra Chain Necklace",
    slug: "veyra-chain-necklace",
    type: "SIMPLE",
    sku: "NK-VY-002",
    shortDescription: "18kt gold rope chain with a matte-finish clasp.",
    price: INR("32000"),
    regularPrice: INR("32000"),
    onSale: false,
    isNew: true,
    averageRating: 4.6,
    reviewCount: 18,
    stockStatus: "IN_STOCK",
    images: [
      {
        id: "img_2a",
        sourceUrl:
          "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop",
        altText: "Veyra chain necklace laid flat",
      },
      {
        id: "img_2b",
        sourceUrl:
          "https://images.unsplash.com/photo-1611085583191-a3b181a88401?q=80&w=1000&auto=format&fit=crop",
        altText: "Veyra chain necklace worn",
      },
    ],
    categories: [{ id: "cat_16", name: "Pendant", slug: "pendant" }],
    attributes: [],
  },
  {
    id: "prod_3",
    databaseId: 203,
    name: "Ophelia Drop Earrings",
    slug: "ophelia-drop-earrings",
    type: "SIMPLE",
    sku: "ER-OP-003",
    shortDescription: "Freshwater pearl drops on a hinged gold hoop.",
    price: INR("21500"),
    regularPrice: INR("24000"),
    salePrice: INR("21500"),
    onSale: true,
    averageRating: 4.9,
    reviewCount: 41,
    stockStatus: "IN_STOCK",
    images: [
      {
        id: "img_3a",
        sourceUrl:
          "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?q=80&w=1000&auto=format&fit=crop",
        altText: "Ophelia drop earrings on a dish",
      },
      {
        id: "img_3b",
        sourceUrl:
          "https://images.unsplash.com/photo-1587467512961-120760940315?q=80&w=1000&auto=format&fit=crop",
        altText: "Ophelia drop earrings worn",
      },
    ],
    categories: [{ id: "cat_18", name: "Earring", slug: "earring" }],
    attributes: [],
  },
  {
    id: "prod_4",
    databaseId: 204,
    name: "Ines Tennis Bracelet",
    slug: "ines-tennis-bracelet",
    type: "SIMPLE",
    sku: "BR-IN-004",
    shortDescription: "A continuous line of lab-grown stones in a rub-over setting.",
    price: INR("67500"),
    regularPrice: INR("67500"),
    onSale: false,
    averageRating: 4.7,
    reviewCount: 12,
    stockStatus: "IN_STOCK",
    images: [
      {
        id: "img_4a",
        sourceUrl:
          "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000&auto=format&fit=crop",
        altText: "Ines tennis bracelet on a wrist",
      },
      {
        id: "img_4b",
        sourceUrl:
          "https://images.unsplash.com/photo-1599459183200-59c7687a0947?q=80&w=1000&auto=format&fit=crop",
        altText: "Ines tennis bracelet detail",
      },
    ],
    categories: [{ id: "cat_19", name: "Western", slug: "western" }],
    attributes: [],
  },
  {
    id: "prod_5",
    databaseId: 205,
    name: "Solene Signet Ring",
    slug: "solene-signet-ring",
    type: "VARIABLE",
    sku: "RG-SL-005",
    shortDescription: "A hand-engraved signet in brushed 18kt gold.",
    price: INR("39000"),
    regularPrice: INR("39000"),
    onSale: false,
    isNew: true,
    averageRating: 4.5,
    reviewCount: 9,
    stockStatus: "IN_STOCK",
    images: [
      {
        id: "img_5a",
        sourceUrl:
          "https://images.unsplash.com/photo-1622398925373-3f91b1e275f5?q=80&w=1000&auto=format&fit=crop",
        altText: "Solene signet ring, front view",
      },
      {
        id: "img_5b",
        sourceUrl:
          "https://images.unsplash.com/photo-1601121141461-9d6e400ca70b?q=80&w=1000&auto=format&fit=crop",
        altText: "Solene signet ring worn",
      },
    ],
    categories: [{ id: "cat_20", name: "New Launch", slug: "new-launch" }],
    attributes: [
      {
        id: "attr_size2",
        name: "Ring Size",
        slug: "ring-size",
        options: ["14", "15", "16", "17"],
        variation: true,
      },
    ],
  },
  {
    id: "prod_6",
    databaseId: 206,
    name: "Marguerite Pendant",
    slug: "marguerite-pendant",
    type: "SIMPLE",
    sku: "NK-MG-006",
    shortDescription: "A floral pendant set with a bezel-cut emerald.",
    price: INR("28900"),
    regularPrice: INR("32000"),
    salePrice: INR("28900"),
    onSale: true,
    averageRating: 4.8,
    reviewCount: 27,
    stockStatus: "IN_STOCK",
    images: [
      {
        id: "img_6a",
        sourceUrl:
          "https://images.unsplash.com/photo-1608042314453-ae338d80c427?q=80&w=1000&auto=format&fit=crop",
        altText: "Marguerite pendant on a chain",
      },
      {
        id: "img_6b",
        sourceUrl:
          "https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=1000&auto=format&fit=crop",
        altText: "Marguerite pendant detail",
      },
    ],
    categories: [{ id: "cat_16", name: "Pendant", slug: "pendant" }],
    attributes: [],
  },
  {
    id: "prod_7",
    databaseId: 207,
    name: "Celestine Hoop Earrings",
    slug: "celestine-hoop-earrings",
    type: "SIMPLE",
    sku: "ER-CL-007",
    shortDescription: "Lightweight gold hoops with a hammered finish.",
    price: INR("16800"),
    regularPrice: INR("16800"),
    onSale: false,
    averageRating: 4.6,
    reviewCount: 22,
    stockStatus: "IN_STOCK",
    images: [
      {
        id: "img_7a",
        sourceUrl:
          "https://images.unsplash.com/photo-1629224316810-9d8805b95e76?q=80&w=1000&auto=format&fit=crop",
        altText: "Celestine hoop earrings on a dish",
      },
      {
        id: "img_7b",
        sourceUrl:
          "https://images.unsplash.com/photo-1610694955371-d4a3e0bf5b9d?q=80&w=1000&auto=format&fit=crop",
        altText: "Celestine hoop earrings worn",
      },
    ],
    categories: [{ id: "cat_18", name: "Earring", slug: "earring" }],
    attributes: [],
  },
  {
    id: "prod_8",
    databaseId: 208,
    name: "Bellamy Cuff Bracelet",
    slug: "bellamy-cuff-bracelet",
    type: "SIMPLE",
    sku: "BR-BL-008",
    shortDescription: "An open cuff in oxidised sterling silver.",
    price: INR("19500"),
    regularPrice: INR("21000"),
    salePrice: INR("19500"),
    onSale: true,
    averageRating: 4.4,
    reviewCount: 15,
    stockStatus: "IN_STOCK",
    images: [
      {
        id: "img_8a",
        sourceUrl:
          "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=1000&auto=format&fit=crop",
        altText: "Bellamy cuff bracelet",
      },
      {
        id: "img_8b",
        sourceUrl:
          "https://images.unsplash.com/photo-1620656798579-1984d9e87df7?q=80&w=1000&auto=format&fit=crop",
        altText: "Bellamy cuff bracelet worn",
      },
    ],
    categories: [{ id: "cat_19", name: "Western", slug: "western" }],
    attributes: [],
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    author: "Ananya R.",
    location: "Mumbai",
    rating: 5,
    quote:
      "The Aria ring photographs beautifully but it's better in person — the setting catches light from every angle. Packaging felt like unwrapping a small ceremony.",
    productName: "Aria Solitaire Ring",
  },
  {
    id: "t2",
    author: "Kabir M.",
    location: "Delhi",
    rating: 5,
    quote:
      "Bought the Solene signet for my father. The engraving detail held up under a loupe, which is more than I can say for two other stores I tried first.",
    productName: "Solene Signet Ring",
  },
  {
    id: "t3",
    author: "Priya S.",
    location: "Bengaluru",
    rating: 4,
    quote:
      "Sizing exchange was handled without a single follow-up email needed on my end. The Ophelia earrings are now in daily rotation.",
    productName: "Ophelia Drop Earrings",
  },
  {
    id: "t4",
    author: "Rohan D.",
    location: "Pune",
    rating: 5,
    quote:
      "The tennis bracelet clasp is the small detail nobody mentions until it fails elsewhere — this one hasn't budged in eight months.",
    productName: "Ines Tennis Bracelet",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
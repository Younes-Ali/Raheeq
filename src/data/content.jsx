import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Camera,
} from "lucide-react";

export const STATS = [
  {
    pre: "We partner with",
    value: 1000,
    suffix: "+",
    label: "Bee Colonies",
    post: "across a single forest region",
  },
  {
    pre: "Grew to",
    value: 3,
    suffix: "",
    label: "Harvest Seasons",
    post: "without a single shortcut",
  },
  {
    pre: "Became",
    value: 100,
    suffix: "%",
    label: "Raw",
    post: "trusted honey, hive to jar",
  },
  {
    pre: "Crafted with",
    value: 100,
    suffix: "%",
    label: "Natural Goodness",
    post: "nothing artificial, just nature",
  },
];

export const ESSENTIALS = [
  {
    title: "Wildflower Honey",
    tag: "Bestseller",
    img: "/images/honey-drip-jar.jpg",
    body: "Slow-poured, harvested from a single wildflower bloom season.",
  },
  {
    title: "Bee Pollen",
    tag: "Raw",
    img: "/images/wildflower-sunset.jpg",
    body: "Hand-collected granules, packed with everything the hive gathers from the forest.",
  },
  {
    title: "Royal Jelly",
    tag: "Limited",
    img: "/images/royal-jelly.jpg",
    body: "The rarest harvest of the season — reserved for the queen, now in your jar.",
  },
  {
    title: "Honeycomb",
    tag: "Whole Cut",
    img: "/images/honeycomb-chunks.jpg",
    body: "Straight from the frame, wax and all — honey exactly as the bees made it.",
  },
];

export const GALLERY = [
  {
    img: "/images/bee-on-lavender.jpg",
    caption: "Golden hour, lavender fields",
  },
  {
    img: "/images/bee-on-red-flower.jpg",
    caption: "Every visit, a little more nectar",
  },
  {
    img: "/images/bee-on-yellow-flower.jpg",
    caption: "The forest never rushes",
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "The richest honey I have ever tasted. You can taste the season in it.",
    name: "Nourhan K.",
  },
  {
    quote:
      "Raheeq changed how I think about honey — it is a completely different product.",
    name: "Omar S.",
  },
  {
    quote:
      "Traceable, raw, and it actually crystallizes like real honey should.",
    name: "Laila M.",
  },
  {
    quote:
      "Every jar tastes a little different depending on the season — that alone tells you it is real.",
    name: "Youssef A.",
  },
  {
    quote:
      "I keep a jar just for tea and one just for eating with bread. Worth it.",
    name: "Salma R.",
  },
  {
    quote: "Finally a honey brand that tells you exactly where it came from.",
    name: "Karim H.",
  },
];

export const NAV_SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "mission", label: "Story" },
  { id: "essential", label: "Products" },
  { id: "gallery", label: "Hive" },
  { id: "contact", label: "Contact" },
];

export const CONTACT_INFO = [
  {
    id: 1,
    title: "Visit Our Store",
    description: "Come and explore our natural honey products.",
    value: "Toukh, Qaliobia, Egypt",
    icon: MapPin,
    link: "https://maps.app.goo.gl/szyVs63bguP5aHgJA",
    action: "Get Directions",
  },
  {
    id: 2,
    title: "Call Us",
    description: "We are happy to help with your questions.",
    value: "+20 101 736 7065",
    icon: Phone,
    link: "tel:+201017367065",
    action: "Call Now",
  },
  {
    id: 3,
    title: "Email Us",
    description: "Send us your questions or suggestions.",
    value: "info@raheeq.com",
    icon: Mail,
    link: "mailto:info@raheeq.com",
    action: "Send Email",
  },
  {
    id: 4,
    title: "WhatsApp",
    description: "Chat with us directly for quick assistance.",
    value: "Chat With Our Team",
    icon: MessageCircle,
    link: "https://wa.me/201017367065",
    action: "Start Chat",
  },
  {
    id: 5,
    title: "Working Hours",
    description: "We are available to serve you.",
    value: "Sat - Fri | 9 AM - 10 PM",
    icon: Clock,
    link: null,
    action: null,
  },
  {
    id: 6,
    title: "Follow Us",
    description: "Discover our latest honey products and updates.",
    value: "@raheeq",
    icon: Camera,
    link: "https://instagram.com/",
    action: "Follow Us",
  },
];

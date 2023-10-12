import { ProductType } from "../components/ProductCart";
import image1 from "../assets/img/product/11.png";
import image2 from "../assets/img/product/12.png";
import image3 from "../assets/img/product/13.png";
import image4 from "../assets/img/product/14.png";
import image5 from "../assets/img/product/15.png";
import slider1 from "../assets/img/slider1.jpg";
import slider2 from "../assets/img/slider2.jpg";
import slider3 from "../assets/img/slider3.jpg";
import slider4 from "../assets/img/slider4.jpg";
import slider5 from "../assets/img/slider5.jpg";

import dis from "../assets/img/team/4.jpg";
import dinuk from "../assets/img/team/3.jpg";
import sansi from "../assets/img/team/2.jpg";
import thari from "../assets/img/team/1.jpg";

export type CategoryType = {
  id: string | number;
  name: string;
  desc?: string;
  description?: string;
};

export type Slide = {
  id: number;
  image: string;
  text: string;
};

export const apiSlidesInfo = [
  {
    url: slider1,
    alt: "Banner 1",
    text: "Hi! , Welocome to lavara clothings.....",
  },
  {
    url: slider2,
    alt: "Banner 2",
    text: "Hi! , Welocome to lavara clothings.....",
  },
  {
    url: slider3,
    alt: "Banner 3",
    text: "Hi! , Welocome to lavara clothings.....",
  },
  {
    url: slider4,
    alt: "Banner 3",
    text: "Hi! , Welocome to lavara clothings.....",
  },
  {
    url: slider5,
    alt: "Banner 3",
    text: "Hi! , Welocome to lavara clothings.....",
  },
];

export const blogInfo = [
  {
    blod_id: 1,
    date: "21 Dec 2023",
    img: "/img/blog/1.jpg",
    title: "How to manage your e-commerce shopify account ?",
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit ...",
    authorName: "Elfried KIDJE",
    authorImg: "/img/author.jpg",
  },
  {
    blod_id: 2,
    date: "21 Dec 2023",
    img: "/img/blog/2.jpg",
    title: "How to manage your e-commerce shopify account ?",
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit ...",
    authorName: "Elfried KIDJE",
    authorImg: "/img/author.jpg",
  },
  {
    blod_id: 3,
    date: "21 Dec 2023",
    img: "/img/blog/3.jpg",
    title: "How to manage your e-commerce shopify account ?",
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit ...",
    authorName: "Elfried KIDJE",
    authorImg: "/img/author.jpg",
  },
];

export const testimonialInfo = [
  {
    authorImg: "/img/1.png",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed earum nemo, officia maiores corporis eveniet ...",
    authorName: "Elfried KIDJE",
    rating: 5,
  },
  {
    authorImg: "/img/1.png",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed earum nemo, officia maiores corporis eveniet ...",
    authorName: "Elfried Karl",
    rating: 5,
  },
];

export const productsTest = [
  {
    id: 1,
    img: "/img/product/1.png",
    reviews: 4,
    name: "Product Name 1",
    price: 90,
    oldPrice: 100,
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos sequi magnam nisi earum, nihil consequuntur harum hic molestias nulla quasi voluptas quae dolor soluta, iusto explicabo, voluptatibus est exercitationem sit.",
  },
  {
    id: 2,
    img: "/img/product/2.png",
    reviews: 4,
    name: "Product Name 2",
    price: 100,
    oldPrice: 150,
    reduction: "-33%",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos sequi magnam nisi earum, nihil consequuntur harum hic molestias nulla quasi voluptas quae dolor soluta, iusto explicabo, voluptatibus est exercitationem sit.",
  },
  {
    id: 3,
    img: "/img/product/3.png",
    reviews: 4,
    name: "Product Name 3",
    price: 120,
    oldPrice: 200,
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos sequi magnam nisi earum, nihil consequuntur harum hic molestias nulla quasi voluptas quae dolor soluta, iusto explicabo, voluptatibus est exercitationem sit.",
  },
  {
    id: 4,
    img: "/img/product/4.png",
    reviews: 4,
    name: "Product Name 4",
    price: 120,
    oldPrice: 200,
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos sequi magnam nisi earum, nihil consequuntur harum hic molestias nulla quasi voluptas quae dolor soluta, iusto explicabo, voluptatibus est exercitationem sit.",
  },
  {
    id: 5,
    img: "/img/product/5.png",
    reviews: 4,
    name: "Product Name 5",
    price: 120,
    oldPrice: 200,
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos sequi magnam nisi earum, nihil consequuntur harum hic molestias nulla quasi voluptas quae dolor soluta, iusto explicabo, voluptatibus est exercitationem sit.",
  },
  {
    id: 6,
    img: "/img/product/6.png",
    reviews: 4,
    name: "Product Name 6",
    price: 120,
    oldPrice: 200,
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos sequi magnam nisi earum, nihil consequuntur harum hic molestias nulla quasi voluptas quae dolor soluta, iusto explicabo, voluptatibus est exercitationem sit.",
  },
  {
    id: 7,
    img: "/img/product/7.png",
    reviews: 4,
    name: "Product Name 7",
    price: 120,
    oldPrice: 200,
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos sequi magnam nisi earum, nihil consequuntur harum hic molestias nulla quasi voluptas quae dolor soluta, iusto explicabo, voluptatibus est exercitationem sit.",
  },
  {
    id: 8,
    img: "/img/product/8.png",
    reviews: 4,
    name: "Product Name 8",
    price: 120,
    oldPrice: 200,
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos sequi magnam nisi earum, nihil consequuntur harum hic molestias nulla quasi voluptas quae dolor soluta, iusto explicabo, voluptatibus est exercitationem sit.",
  },
];

export const dailyTest = {
  id: 1,
  img: "/img/product/1.png",
  reviews: 4,
  name: "Product Name 1",
  price: 90,
  old_price: 100,
  desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed earum nemo, officia maiores corporis eveniet ratione magnam facere voluptates consequuntur cumque.",
  total_quantity: 3,
};

export const sortProduct = [
  {
    id: 1,
    img: "/img/product/8.png",
    reviews: 4,
    name: "Fresh Red Seedless 1",
    price: 90,
    oldPrice: 100,
  },
  {
    id: 2,
    img: "/img/product/2.png",
    reviews: 4,
    name: "Fresh Red Seedless 2",
    price: 100,
    oldPrice: 150,
    reduction: "-33%",
  },
  {
    id: 3,
    img: "/img/product/7.png",
    reviews: 4,
    name: "Fresh Red Seedless 3",
    price: 120,
    oldPrice: 200,
  },
  {
    id: 4,
    img: "/img/product/4.png",
    reviews: 4,
    name: "Fresh Red Seedless 4",
    price: 120,
    oldPrice: 200,
  },
  {
    id: 5,
    img: "/img/product/5.png",
    reviews: 4,
    name: "Fresh Red Seedless 5",
    price: 120,
    oldPrice: 200,
  },
];

export const sortProducts = [
  {
    id: 7,
    img: image2,
    reviews: 4,
    name: "Swaggy Top",
    price: 800,
    old_price: 1600,
    reduction: "Sale",
    type: "string",
    desc: "Desc",
    quantity: 1,
    total_quantity: 10,
    categorie_id: 3,
  },
  {
    id: 8,
    img: image1,
    reviews: 5,
    name: "Black Frock",
    price: 2900,
    old_price: 3600,
    reduction: "Sale",
    type: "string",
    desc: "Desc",
    quantity: 1,
    total_quantity: 10,
    categorie_id: 3,
  },
  {
    id: 9,
    img: image3,
    reviews: 5,
    name: "Red",
    price: 800,
    old_price: 1600,
    reduction: "Sale",
    type: "string",
    desc: "Desc",
    quantity: 1,
    total_quantity: 10,
    categorie_id: 3,
  },
  {
    id: 10,
    img: image4,
    reviews: 5,
    name: "Red",
    price: 800,
    old_price: 1600,
    reduction: "Sale",
    type: "string",
    desc: "Desc",
    quantity: 1,
    total_quantity: 10,
    categorie_id: 3,
  },
  {
    id: 11,
    img: image4,
    reviews: 5,
    name: "Red top",
    price: 800,
    old_price: 1600,
    reduction: "Sale",
    type: "string",
    desc: "Desc",
    quantity: 1,
    total_quantity: 10,
    categorie_id: 3,
  },
  {
    id: 12,
    img: image5,
    reviews: 5,
    name: "Red",
    price: 800,
    old_price: 1600,
    reduction: "Sale",
    type: "string",
    desc: "Desc",
    quantity: 1,
    total_quantity: 10,
    categorie_id: 3,
  },
  {
    id: 13,
    img: image4,
    reviews: 5,
    name: "Red",
    price: 800,
    old_price: 1600,
    reduction: "Sale",
    type: "string",
    desc: "Desc",
    quantity: 1,
    total_quantity: 10,
    categorie_id: 3,
  },
];

export const apiCategory = [
  { id: 1, name: "TShirts", description: "lorem" },
  { id: 2, name: "Frogs", description: "lorem" },
  { id: 3, name: "Shorts", description: "lorem" },
  { id: 4, name: "Shirts", description: "lorem" },
  { id: 5, name: "Trousers", description: "lorem" },
  { id: 6, name: "Denim", description: "lorem" },
  { id: 7, name: "Caps", description: "lorem" },
];

export const archives = [
  { archive_id: 1, date: "September 2023" },
  { archive_id: 2, date: "October 2023" },
  { archive_id: 3, date: "July 2022" },
  { archive_id: 4, date: "September 2022" },
  { archive_id: 5, date: "October 2023" },
  { archive_id: 6, date: "July 2023" },
];

export const tags = [
  { tag_id: 1, name: "WOMAN" },
  { tag_id: 2, name: "MEN" },
  { tag_id: 3, name: "SLIM" },
  { tag_id: 4, name: "REGULAR" },
  { tag_id: 5, name: "SHORTS" },
  { tag_id: 6, name: "TROUSERS" },
  { tag_id: 7, name: "LINEN" },
  { tag_id: 8, name: "COTTON" },
];

export const teams = [
  {
    team_id: 1,
    img: dis,
    name: "Disira Thihan",
    role: "Product Managment System",
  },
  {
    team_id: 2,
    img: thari,
    name: "Thrindu Gunasekara",
    role: "User Recomendation Algorithm",
  },
  {
    team_id: 3,
    img: sansi,
    name: "Sansika Kodithuwakku",
    role: "User Managment System",
  },
  {
    team_id: 4,
    img: dinuk,
    name: "Dinuka Dissanayake",
    role: "Order Managment System",
  },


];

export const searchData = [
  { search_id: 1, name: "Men" },
  { search_id: 2, name: "Top" },
  { search_id: 3, name: "Trending" },
  { search_id: 4, name: "Women" },
  { search_id: 5, name: "Populer" },
  { search_id: 6, name: "Shopping" },
  { search_id: 7, name: "Cheap" },
];

export const customers = [
  {
    lastname: "John",
    firstname: "Doe",
    email: "john@doe.com",
    address: "123 Main Street",
  },
  {
    lastname: "John",
    firstname: "Doe",
    email: "john@doe.com",
    address: "123 Main Street",
  },
  {
    lastname: "John",
    firstname: "Doe",
    email: "john@doe.com",
    address: "123 Main Street",
  },
  {
    lastname: "John",
    firstname: "Doe",
    email: "john@doe.com",
    address: "123 Main Street",
  },
  {
    lastname: "John",
    firstname: "Doe",
    email: "john@doe.com",
    address: "123 Main Street",
  },
];

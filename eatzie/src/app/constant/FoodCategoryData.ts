import { FoodCategory } from "@/types/foodCategory";

export const foodCategoryData: FoodCategory[] = [
  {
    id: "1",
    nameFood: "Phở Nguyệt Trang Dương",
    title: "Bún, Mì, Phở",
    image: require("../../assets/images/pho1.jpg"),
    imageClick: require("../../assets/images/PhoTaiNamGau-857x571.png"),
    type: "pho",
    rating: 4.5,
    views: 500,
    path: "/loading",
    location: "Sảnh Penrose",
    comment: "20+",
    items: [
      {
        id: "1-1",
        name: "Phở Tái",
        price: 45000,
        salePrice: 40,
        likes: 120,
        path: "loading",
        image: require("../../assets/images/boo.jpg"),
        categoryId: "1",
        decription:
          "Miếng thịt nạm mềm béo, xen chút gân giòn sần sật, kết hợp với lát thịt tái mỏng, vừa chín tới trong làn nước sôi, mang lại cảm giác tan chảy nơi đầu lưỡi. ",
        feedbacks: [
          {
            userName: "Duy Hùng",
            comment: "Ngon tuyệt, nước lèo rất đậm đà",
            rating: 5,
          },
          {
            userName: "Mỹ Anh",
            comment: "Thịt hơi ít nhưng ok",

            rating: 4,
          },
        ],
      },
      {
        id: "1-2",
        name: "Phở Bò Viên",
        price: 48000,
        salePrice: 4,
        likes: 95,
        image: require("../../assets/images/bodien.jpg"),
        path: "loading",
        categoryId: "2",
        feedbacks: [
          {
            userName: "Ản Danh",
            comment: "Ngon tuyệt, nước lèo rất đậm đà",

            rating: 5,
          },
          {
            userName: "Ẩn Danh",
            comment: "Thịt hơi ít nhưng ok",
            rating: 4,
          },
        ],
      },
      // {
      //   id: "1-3",
      //   name: "Phở Tái",
      //   price: 45000,
      //   salePrice: 40,
      //   likes: 120,
      //   path: "loading",
      //   image: require("../../assets/images/boo.jpg"),
      //   categoryId: "1",
      //   decription:
      //     "Miếng thịt nạm mềm béo, xen chút gân giòn sần sật, kết hợp với lát thịt tái mỏng, vừa chín tới trong làn nước sôi, mang lại cảm giác tan chảy nơi đầu lưỡi. ",
      //   feedbacks: [
      //     {
      //       userName: "Duy Hùng",
      //       comment: "Ngon tuyệt, nước lèo rất đậm đà",
      //       rating: 5,
      //     },
      //     {
      //       userName: "Mỹ Anh",
      //       comment: "Thịt hơi ít nhưng ok",

      //       rating: 4,
      //     },
      //   ],
      // },
    ],
  },
  {
    id: "2",
    nameFood: "Bún Trang Nguyệt Dương",
    title: "Bún",
    image: require("../../assets/images/pho.png"),
    type: "bun",
    rating: 4.5,
    comment: "10+",
    views: 500,
    path: "/loading",
    imageClick: require("../../assets/images/bunbothapcam.jpg"),

    items: [
      {
        id: "2-1",
        name: "Bún Chả",
        price: 40000,
        likes: 80,
        path: "loading",
        image: require("../../assets/images/bunbo2.jpg"),
        categoryId: "1",
      },
      {
        id: "2-2",
        name: "Bún Mọc",
        price: 42000,
        salePrice: 39000,
        likes: 60,
        path: "loading",
        image: require("../../assets/images/bunbothapcam.jpg"),
        categoryId: "1",
      },
    ],
  },
];

export const foodCategoryData1: FoodCategory[] = [
  {
    id: "5",
    nameFood: "Đồ chay Duy Hùng",
    title: "Bún, Mì, Phở",
    image: require("../../assets/images/mam-590k.jpg"),
    imageClick: require("../../assets/images/mam-590k.jpg"),
    type: "bunchay",
    rating: 2.5,
    views: 100,
    path: "/loading",
    location: "Sảnh Penrose",
    comment: "10+",
    items: [
      {
        id: "5-1",
        name: "Bún chay",
        price: 45000,
        salePrice: 40,
        likes: 120,
        path: "loading",
        image: require("../../assets/images/bunchay1.jpg"),
        categoryId: "6",
        decription: "Bún chay thanh đạm, nước dùng nấu từ rau củ.",
        feedbacks: [
          {
            userName: "Duy Hùng",
            comment: "Ngon tuyệt, nước lèo rất đậm đà",
            rating: 5,
          },
          {
            userName: "Ẩn danh",
            comment: "Thịt hơi ít nhưng ok",
            rating: 4,
          },
        ],
      },
      {
        id: "5-2",
        name: "Chả giò chay",
        price: 48000,
        salePrice: 4,
        likes: 95,
        image: require("../../assets/images/images.jpg"),
        path: "loading",
        categoryId: "4",
        decription: "Phở chay đậm đà với nấm và rau củ thanh mát.",
        feedbacks: [
          {
            userName: "Ẩn Danh",
            comment: "",
            rating: 4,
          },
          {
            userName: "Ẩn Danh",
            comment: "Ngonnnn",
            rating: 5,
          },
        ],
      },
    ],
  },
];

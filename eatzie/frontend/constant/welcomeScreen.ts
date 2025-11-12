import { SizableProps } from "@/types/survey";

export const welcomeScreenData = {
  titleLines: ["eatzie là ứng dụng", "giúp bạn ăn ngon", "mỗi ngày!"],
  description: "bún bò, bánh tráng trộn, và \nnhiều hơn nữa...",
  languageLabel: "Vietnamese",
};

export const Step0Data: SizableProps = {
  step: 0,
  item: {
    title: ["Chào mừng bạn", "đến với eatzie!"],
    image: require("../assets/images/party 1.png"),
    buttonContent: {
      haveContent: false,
      path: "/loading",
    },
  },
};

export const Step1Data: SizableProps = {
  step: 1,
  item: {
    title: ["Hãy để chúng tôi", "hiểu bạn hơn"],
    image: require("../assets/images/hãy để chúng tôi hiểu bạn hơn 1.png"),
    buttonContent: {
      haveContent: false,
      path: "/loading",
    },
  },
};

export const Step2Data: SizableProps = {
  step: 2,
  item: {
    title: ["Chế độ ăn của bạn là gì?"],

    buttonContent: {
      haveContent: true,
      path: "/loading",
      content: [
        {
          title: "Ăn chay",
          data: "an_chay",
        },
        {
          title: "Ăn mặn",
          data: "an_man",
        },
        {
          title: "Chỉ ăn chay vào các ngày cụ thể",
          data: "an_theo_ngay",
        },
      ],
    },
  },
};

export const Step3Data: SizableProps = {
  step: 3,
  item: {
    title: ["Bạn dị ứng với món nào?"],

    buttonContent: {
      haveContent: false,
      path: "/loading",
      content: [],
    },
  },
  bodyContent: [
    { data: "seafood", content: "Hải sản" },
    { data: "shellfish", content: "Hải sản có vỏ" },
    { data: "squid", content: "Mực, bạch tuộc" },
    { data: "shrimp_crab", content: "Tôm, cua" },
    { data: "peanut", content: "Đậu phộng" },
    { data: "sesame", content: "Mè (vừng)" },
    { data: "soybean", content: "Đậu nành (lạc)" },
    { data: "wheat", content: "Lúa mì" },
    { data: "egg", content: "Trứng" },
    { data: "milk", content: "Sữa bò" },
    { data: "nuts", content: "Hạt (hạnh nhân, hạt điều, óc chó)" },
  ],
};

export const Step4Data: SizableProps = {
  step: 4,
  item: {
    title: ["Bạn thích món nào?"],

    buttonContent: {
      haveContent: false,
      path: "/loading",
      content: [],
    },
  },
  bodyContent: [
    { data: "banh_mi", content: "Bánh mì" },
    { data: "com_tam", content: "Cơm tấm" },
    { data: "mi_cay", content: "Mì cay" },
    { data: "lau", content: "Lẩu" },
    { data: "pizza", content: "Pizza" },
    { data: "hai_san", content: "Hải sản" },
    { data: "mi_quang", content: "Mì Quảng" },
    { data: "oc", content: "Ốc" },
    { data: "pho", content: "Phở" },
    { data: "nhau", content: "Nhậu" },
    { data: "banh_cuon", content: "Bánh cuốn" },
    { data: "hu_tieu", content: "Hủ tiếu" },
    { data: "ga_ran", content: "Gà rán" },
    { data: "an_vat", content: "Ăn vặt" },
    { data: "chao_long", content: "Cháo lòng" },
    { data: "banh_xeo", content: "Bánh xèo" },
    { data: "bun_bo", content: "Bún bò" },
    { data: "bun_kho", content: "Bún khô" },
  ],
};

export const Step5Data: SizableProps = {
  step: 5,
  item: {
    title: ["Bạn thường chi bao nhiêu tiền cho mỗi bữa ăn?"],
    buttonContent: {
      haveContent: false,
      path: "/loading",
    },
  },
  bodyContent: [
    {
      expense: {
        input: {
          title: "Tối thiểu",
          required: true,
          minValue: 10000,
        },
        out: {
          title: "Tối đa",
          required: true,
          maxValue: 1000000,
        },
      },
    },
  ],
};

export const Step6Data: SizableProps = {
  step: 6,
  item: {
    title: ["Đợi một lát, chúng tôi", "đang tìm cho bạn", "nhà hàng phù hợp"],
    image: require("../assets/images/chúng tôi đang tìm kiếm 1.png"),
    buttonContent: {
      haveContent: false,
      path: "/loading",
    },
  },
};

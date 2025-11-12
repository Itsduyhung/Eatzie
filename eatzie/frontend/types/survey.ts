import { ImageSourcePropType } from "react-native";

export type StepButtonContent = {
  haveContent: boolean;
  path: string;
  content?: {
    title: string;
    data: string;
  }[];
};

export type StepItem = {
  title: string[];
  image?: ImageSourcePropType;
  buttonContent: StepButtonContent;
};

export type StepBodyContent = {
  data?: string;
  content?: string;
  isSelected?: boolean;
  expense?: PayMoney;
}[];

export type SizableProps = {
  step: number;
  item?: StepItem;
  bodyContent?: StepBodyContent;
};

export type PayMoney = {
  input: {
    inputMoney?: number;
    title: string;
    required?: boolean;
    minValue?: number;
  };
  out: {
    outputMoney?: number;
    title: string;
    required?: boolean;
    maxValue?: number;
  };
};

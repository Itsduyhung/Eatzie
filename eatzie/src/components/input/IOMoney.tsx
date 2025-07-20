import { Formik, FormikProps } from "formik";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { XStack } from "tamagui";
import * as Yup from "yup";

import { PayMoney } from "@/types/survey";
import { MoneyInput } from "../formik/FormikFields";

type IOMoneyProps = {
  payMoney: PayMoney;
  onSubmit?: (values: { inputMoney?: number; outputMoney?: number }) => void;
};

export type IOMoneyRef = {
  submit: () => void;
};

export const IOMoney = forwardRef<IOMoneyRef, IOMoneyProps>((props, ref) => {
  const formikRef = useRef<FormikProps<any>>(null);
  const { payMoney, onSubmit } = props;

  useImperativeHandle(ref, () => ({
    submit: () => {
      formikRef.current?.setTouched({
        inputMoney: true,
        outputMoney: true,
      });
      formikRef.current?.handleSubmit();
    },
  }));

  const initialValues = {
    inputMoney:
      typeof payMoney.input.inputMoney === "number"
        ? payMoney.input.inputMoney
        : undefined,
    outputMoney:
      typeof payMoney.out.outputMoney === "number"
        ? payMoney.out.outputMoney
        : undefined,
  };

  const transformToNumber = (value: any, originalValue: any) => {
    if (typeof originalValue === "string") {
      const parsed = parseFloat(originalValue.replace(/,/g, ""));
      return isNaN(parsed) ? undefined : parsed;
    }
    return value;
  };

  const validationSchema = Yup.object().shape({
    inputMoney: payMoney.input.required
      ? Yup.number()
          .transform(transformToNumber)
          .typeError("Vui lòng nhập số hợp lệ")
          .min(
            payMoney.input.minValue ?? 0,
            `Tối thiểu là ${payMoney.input.minValue}`
          )
          .required("Không được bỏ trống")
      : Yup.number().transform(transformToNumber).nullable(),
    outputMoney: payMoney.out.required
      ? Yup.number()
          .transform(transformToNumber)
          .typeError("Vui lòng nhập số hợp lệ")
          .max(
            payMoney.out.maxValue ?? Infinity,
            `Tối đa là ${payMoney.out.maxValue}`
          )
          .required("Không được bỏ trống")
      : Yup.number().transform(transformToNumber).nullable(),
  });

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        const safeToNumber = (val: any): number | undefined => {
          const num = Number(val);
          return isNaN(num) ? undefined : Math.round(num);
        };

        const safeValues = {
          outputMoney: safeToNumber(values.outputMoney),
          inputMoney: safeToNumber(values.inputMoney),
        };

        console.log("✅ IOMoney form submitted", safeValues);
        onSubmit?.(safeValues);
      }}
    >
      {() => (
        <XStack justifyContent="center" gap="$4" marginTop={30}>
          <MoneyInput
            name="inputMoney"
            label={payMoney.out.title}
            keyboardType="numeric"
            backgroundColor="transparent"
          />
          <MoneyInput
            name="outputMoney"
            label={payMoney.input.title}
            keyboardType="numeric"
            backgroundColor="transparent"
          />
        </XStack>
      )}
    </Formik>
  );
});

IOMoney.displayName = "IOMoney";

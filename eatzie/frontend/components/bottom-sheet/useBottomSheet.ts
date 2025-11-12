import { useCallback, useState } from "react";

export const useBottomSheet = () => {
  const [visible, setVisible] = useState(false);

  const open = useCallback(() => setVisible(true), []);
  const close = useCallback(() => setVisible(false), []);
  const toggle = useCallback(() => setVisible((prev) => !prev), []);

  return { visible, open, close, toggle };
};

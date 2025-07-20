import { config as tamaguiDefaultConfig } from "@tamagui/config/v2";
import { createTamagui } from "tamagui";

const config = createTamagui({
  ...tamaguiDefaultConfig,
  tokens: {
    ...tamaguiDefaultConfig.tokens,
  },
  size: {
    ...tamaguiDefaultConfig.tokens.size,
    $5_5: 52,
    $inputLg: 56,
  },
});

export type Conf = typeof config;

declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}

export default config;

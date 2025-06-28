// tamagui.config.ts
import { config as tamaguiDefaultConfig } from "@tamagui/config/v2";
import { createTamagui } from "tamagui";

const config = createTamagui({
  ...tamaguiDefaultConfig,
});

export type Conf = typeof config;

declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}

export default config;

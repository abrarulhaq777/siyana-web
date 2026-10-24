import { Amiri } from "next/font/google";

// Arabic calligraphic accents only, so it is not preloaded on every page.
export const amiri = Amiri({ subsets: ["arabic"], weight: "400", preload: false });

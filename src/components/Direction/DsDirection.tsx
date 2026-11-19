"use client";

import { Direction } from "radix-ui";
import * as React from "react";

function DsDirectionProvider({
  dir,
  children,
}: {
  dir: "ltr" | "rtl";
  children: React.ReactNode;
}) {
  return <Direction.Provider dir={dir}>{children}</Direction.Provider>;
}

export { DsDirectionProvider };

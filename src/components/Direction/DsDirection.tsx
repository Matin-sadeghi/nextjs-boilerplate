"use client"

import * as React from "react"
import { Direction } from "radix-ui"

function DsDirectionProvider({
  dir,
  children,
}: {
  dir: "ltr" | "rtl"
  children: React.ReactNode
}) {
  return <Direction.Provider dir={dir}>{children}</Direction.Provider>
}

export { DsDirectionProvider }

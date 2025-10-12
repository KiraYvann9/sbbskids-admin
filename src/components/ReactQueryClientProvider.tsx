'use client'
import {ReactQueryDevtools} from "@tanstack/react-query-devtools"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import React from "react";


const queryClient = new QueryClient();

export const ReactQueryClientProvider = ({children}:React.PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

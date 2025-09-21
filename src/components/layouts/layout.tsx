import Header from "./header"
import Footer from "./footer"
import '../../dist/output.css';

import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#263b49] text-white">
      <Header />
      <main className="flex flex-grow flex-col items-center justify-center">
        {children}
      </main>
      <Footer />
    </div>
  )
}
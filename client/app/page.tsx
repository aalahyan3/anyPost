import Footer from "@/components/Footer"
import Functionality from "@/components/Functionality"
import Header from "@/components/Header"
import Hero from "@/components/Hero"
import Testimonials from "@/components/Testimonials"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">

      <main className="flex-1 w-full max mx-auto md:px-4 max-w-7xl">
        <Header />
        <Hero />

        <Testimonials />

        <Functionality />
        <Footer />
      </main>

    </div>
  )
}

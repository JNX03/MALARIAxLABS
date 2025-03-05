import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function Hero() {
  return (
    <section className="container flex min-h-[calc(100vh-3.5rem)] max-w-screen-2xl flex-col items-center justify-center space-y-8 py-24 text-center md:py-32">
      <div className="space-y-4">
        <h1 className="bg-gradient-to-br from-foreground from-30% via-foreground/90 to-foreground/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
          Skipidi Malaria
          <br />
          <span className="text-red-500">One Cell at a Time</span>
        </h1>
        <p className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          I going to yap about the malaria rural labs that i using less than 1 horu to build this website i mean coidng is so easy but let get in to the projec this is the one-shot analysis of malaria from cell image na 
        </p>
      </div>
      <div className="flex gap-4">
        <Link href="/auth/signup">
          <Button size="lg">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <Link href="#heatmap">
          <Button variant="outline" size="lg">
            Contect @Jnx03 for a Skipidi
          </Button>
        </Link>
      </div>
    </section>
  )
}


import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CTA() {
  return (
    <section className="border-t">
      <div className="container flex flex-col items-center gap-4 py-24 text-center md:py-32">
        <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">Join the fight against malaria</h2>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Our platform is helping healthcare workers across Thailand diagnose and treat malaria faster and more
          accurately than ever before.
        </p>
        <Link href="/auth/signup">
          <Button size="lg" className="mt-4">
            Sign Up Now
          </Button>
        </Link>
      </div>
    </section>
  )
}


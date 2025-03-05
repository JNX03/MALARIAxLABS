import { Microscope, Smartphone, CloudLightning, Activity } from "lucide-react"

const features = [
  {
    name: "Eye Sud",
    description: "bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra .",
    icon: Microscope,
  },
  {
    name: "Mobile Accessibility",
    description: "bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra ",
    icon: Smartphone,
  },
  {
    name: "Cloud Yap",
    description: "bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra ",
    icon: CloudLightning,
  },
  {
    name: "Yapping so much diagnostics",
    description: "bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra bra ",
    icon: Activity,
  },
]

export default function Features() {
  return (
    <section id="features" className="container space-y-16 py-24 md:py-32">
      <div className="mx-auto max-w-[58rem] text-center">
        <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl"> Malaria Rural labs features! 💀💀💀</h2>
        <p className="mt-4 text-muted-foreground sm:text-lg">
          Our technology brings laboratory-grade diagnostics to rural healthcare settings.
        </p>
      </div>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
        {features.map((feature) => (
          <div key={feature.name} className="relative overflow-hidden rounded-lg border bg-background p-8">
            <div className="flex items-center gap-4">
              <feature.icon className="h-8 w-8 text-red-500" />
              <h3 className="font-bold">{feature.name}</h3>
            </div>
            <p className="mt-2 text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}


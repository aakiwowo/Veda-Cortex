'use client'

import { useApp } from '@/lib/app-context'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  Droplets,
  Heart,
  Sparkles,
  Wind,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const stepIconMap: Record<string, typeof Droplets> = {
  droplets: Droplets,
  heart: Heart,
  sparkles: Sparkles,
  wind: Wind,
}

export function ResultsPage() {
  const {
    hairProfile,
    routineSteps,
    recommendedProducts,
    savedProducts,
    toggleSaveProduct,
    setCurrentPage,
    setIsLoggedIn,
  } = useApp()

  if (!hairProfile) {
    return (
      <main className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-16 text-center">
        <h2 className="font-serif text-2xl text-foreground">No Results Yet</h2>
        <p className="text-muted-foreground">
          Please take the quiz first to see your personalized results.
        </p>
        <Button onClick={() => setCurrentPage('quiz')}>Take the Quiz</Button>
      </main>
    )
  }

  const handleSaveAndContinue = () => {
    setIsLoggedIn(true)
    setCurrentPage('dashboard')
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 md:py-16">
      {/* Hair Profile Summary */}
      <section className="mb-12 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          <Sparkles className="h-4 w-4" />
          Your Hair Profile
        </div>
        <h1 className="font-serif text-3xl text-foreground md:text-4xl">
          {hairProfile.hairType}
        </h1>
        <div className="mx-auto mt-6 flex max-w-lg flex-wrap justify-center gap-3">
          <span className="rounded-full border border-border bg-card px-4 py-1.5 text-sm text-foreground">
            {hairProfile.porosity} porosity
          </span>
          <span className="rounded-full border border-border bg-card px-4 py-1.5 text-sm text-foreground">
            {hairProfile.scalpCondition} scalp
          </span>
          <span className="rounded-full border border-border bg-card px-4 py-1.5 text-sm text-foreground">
            {hairProfile.thickness} strands
          </span>
          <span className="rounded-full border border-border bg-card px-4 py-1.5 text-sm text-foreground">
            {hairProfile.density} density
          </span>
          <span className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Goal: {hairProfile.goal}
          </span>
        </div>
      </section>

      {/* Recommended Routine */}
      <section className="mb-12">
        <h2 className="mb-6 font-serif text-2xl text-foreground md:text-3xl">
          Your Recommended Routine
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {routineSteps.map((step) => {
            const IconComponent = stepIconMap[step.icon] || Sparkles
            return (
              <Card
                key={step.id}
                className="border-border transition-shadow hover:shadow-md"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        Step {step.step}: {step.name}
                      </CardTitle>
                      <CardDescription>{step.frequency}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Recommended Products */}
      <section className="mb-12">
        <h2 className="mb-6 font-serif text-2xl text-foreground md:text-3xl">
          Recommended Products
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {recommendedProducts.map((product) => {
            const isSaved = savedProducts.some((p) => p.id === product.id)
            return (
              <Card
                key={product.id}
                className="border-border transition-shadow hover:shadow-md"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardDescription className="text-xs font-medium uppercase tracking-wider">
                        {product.category}
                      </CardDescription>
                      <CardTitle className="mt-1 text-lg">
                        {product.name}
                      </CardTitle>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        by {product.brand}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleSaveProduct(product)}
                      className={cn(
                        'rounded-lg p-2 transition-colors',
                        isSaved
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                      aria-label={
                        isSaved ? 'Remove from saved' : 'Save product'
                      }
                    >
                      {isSaved ? (
                        <BookmarkCheck className="h-5 w-5" />
                      ) : (
                        <Bookmark className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {product.description}
                  </p>
                  <p className="mt-3 text-lg font-semibold text-foreground">
                    {product.price}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Save & Dashboard CTA */}
      <section className="rounded-2xl border border-border bg-card p-6 text-center md:p-8">
        <h3 className="font-serif text-xl text-foreground md:text-2xl">
          Save Your Results
        </h3>
        <p className="mt-2 text-muted-foreground">
          Create an account to save your hair profile, track your routine, and revisit your product recommendations anytime.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button onClick={handleSaveAndContinue} className="gap-2">
            Save & Go to Dashboard
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => setCurrentPage('quiz')}>
            Retake Quiz
          </Button>
        </div>
      </section>
    </main>
  )
}

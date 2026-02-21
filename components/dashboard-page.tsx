'use client'

import { useApp } from '@/lib/app-context'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
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
  RefreshCw,
  Bookmark,
  User,
  CheckCircle2,
  Circle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const stepIconMap: Record<string, typeof Droplets> = {
  droplets: Droplets,
  heart: Heart,
  sparkles: Sparkles,
  wind: Wind,
}

export function DashboardPage() {
  const {
    hairProfile,
    routineSteps,
    routineChecks,
    toggleRoutineCheck,
    savedProducts,
    toggleSaveProduct,
    setCurrentPage,
    resetQuiz,
  } = useApp()

  if (!hairProfile) {
    return (
      <main className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-16 text-center">
        <User className="h-12 w-12 text-muted-foreground" />
        <h2 className="font-serif text-2xl text-foreground">
          Welcome to Your Dashboard
        </h2>
        <p className="text-muted-foreground">
          Take the hair quiz first to see your personalized profile and routine here.
        </p>
        <Button onClick={() => setCurrentPage('quiz')}>Take the Quiz</Button>
      </main>
    )
  }

  const completedSteps = Object.values(routineChecks).filter(Boolean).length
  const totalSteps = routineSteps.length
  const progressPercent =
    totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0

  const handleRetakeQuiz = () => {
    resetQuiz()
    setCurrentPage('quiz')
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 md:py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl text-foreground md:text-3xl">
            Your Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">
            Track your routine and manage your hair care journey.
          </p>
        </div>
        <Button variant="outline" onClick={handleRetakeQuiz} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Retake Quiz
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: Profile + Routine */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Hair Profile Card */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif text-xl">
                <Sparkles className="h-5 w-5 text-primary" />
                Hair Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-2xl font-semibold text-foreground">
                  {hairProfile.hairType}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-border bg-muted px-3 py-1 text-sm text-foreground">
                  {hairProfile.porosity} porosity
                </span>
                <span className="rounded-full border border-border bg-muted px-3 py-1 text-sm text-foreground">
                  {hairProfile.scalpCondition} scalp
                </span>
                <span className="rounded-full border border-border bg-muted px-3 py-1 text-sm text-foreground">
                  {hairProfile.thickness} strands
                </span>
                <span className="rounded-full border border-border bg-muted px-3 py-1 text-sm text-foreground">
                  {hairProfile.density} density
                </span>
                <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  Goal: {hairProfile.goal}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Routine Checklist */}
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-serif text-xl">
                  Daily Routine
                </CardTitle>
                <span
                  className={cn(
                    'rounded-full px-3 py-1 text-sm font-medium',
                    progressPercent === 100
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {completedSteps}/{totalSteps} done
                </span>
              </div>
              <CardDescription>
                Toggle each step as you complete your routine.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {routineSteps.map((step) => {
                const IconComponent = stepIconMap[step.icon] || Sparkles
                const isChecked = routineChecks[step.id] ?? false
                return (
                  <div
                    key={step.id}
                    className={cn(
                      'flex items-center gap-4 rounded-xl border p-4 transition-all',
                      isChecked
                        ? 'border-primary/30 bg-primary/5'
                        : 'border-border bg-background'
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors',
                        isChecked
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {isChecked ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <IconComponent className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p
                        className={cn(
                          'font-medium',
                          isChecked
                            ? 'text-primary line-through'
                            : 'text-foreground'
                        )}
                      >
                        {step.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {step.frequency}
                      </p>
                    </div>
                    <Switch
                      checked={isChecked}
                      onCheckedChange={() => toggleRoutineCheck(step.id)}
                      aria-label={`Mark ${step.name} as ${isChecked ? 'incomplete' : 'complete'}`}
                    />
                  </div>
                )
              })}

              {/* Progress bar */}
              <div className="mt-2 rounded-xl bg-muted p-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Today&apos;s progress
                  </span>
                  <span className="font-medium text-foreground">
                    {progressPercent}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column: Saved Products */}
        <div className="flex flex-col gap-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif text-xl">
                <Bookmark className="h-5 w-5 text-primary" />
                Saved Products
              </CardTitle>
              <CardDescription>
                {savedProducts.length === 0
                  ? 'No products saved yet.'
                  : `${savedProducts.length} product${savedProducts.length > 1 ? 's' : ''} saved`}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {savedProducts.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-xl bg-muted p-6 text-center">
                  <Circle className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Visit the results page to save your favorite products.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage('results')}
                  >
                    View Results
                  </Button>
                </div>
              ) : (
                savedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-start justify-between rounded-xl border border-border bg-background p-4"
                  >
                    <div className="flex-1">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {product.category}
                      </p>
                      <p className="mt-0.5 font-medium text-foreground">
                        {product.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {product.brand} &middot; {product.price}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleSaveProduct(product)}
                      className="rounded-lg p-1.5 text-destructive transition-colors hover:bg-destructive/10"
                      aria-label={`Remove ${product.name}`}
                    >
                      <Bookmark className="h-4 w-4 fill-current" />
                    </button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

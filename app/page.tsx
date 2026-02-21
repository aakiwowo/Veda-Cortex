'use client'

import { AppProvider, useApp } from '@/lib/app-context'
import { Navbar } from '@/components/navbar'
import { LandingPage } from '@/components/landing-page'
import { QuizPage } from '@/components/quiz-page'
import { ResultsPage } from '@/components/results-page'
import { DashboardPage } from '@/components/dashboard-page'
import { LoginPage } from '@/components/login-page'

function PageRouter() {
  const { currentPage } = useApp()

  switch (currentPage) {
    case 'quiz':
      return <QuizPage />
    case 'results':
      return <ResultsPage />
    case 'dashboard':
      return <DashboardPage />
    case 'login':
      return <LoginPage />
    default:
      return <LandingPage />
  }
}

export default function Page() {
  return (
    <AppProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex-1">
          <PageRouter />
        </div>
      </div>
    </AppProvider>
  )
}

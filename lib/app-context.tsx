'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import {
  type HairProfile,
  type Product,
  type RoutineStep,
  getHairType,
  getRoutineSteps,
  getRecommendedProducts,
} from '@/lib/quiz-data'

type Page = 'landing' | 'quiz' | 'results' | 'dashboard' | 'login'

interface QuizAnswers {
  [questionId: string]: string
}

interface AppContextType {
  currentPage: Page
  setCurrentPage: (page: Page) => void
  quizAnswers: QuizAnswers
  setQuizAnswer: (questionId: string, value: string) => void
  resetQuiz: () => void
  isLoggedIn: boolean
  setIsLoggedIn: (v: boolean) => void
  hairProfile: HairProfile | null
  routineSteps: RoutineStep[]
  recommendedProducts: Product[]
  computeResults: () => void
  savedProducts: Product[]
  toggleSaveProduct: (product: Product) => void
  routineChecks: Record<string, boolean>
  toggleRoutineCheck: (stepId: string) => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>('landing')
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>({})
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [hairProfile, setHairProfile] = useState<HairProfile | null>(null)
  const [routineSteps, setRoutineSteps] = useState<RoutineStep[]>([])
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([])
  const [savedProducts, setSavedProducts] = useState<Product[]>([])
  const [routineChecks, setRoutineChecks] = useState<Record<string, boolean>>(
    {}
  )

  const setQuizAnswer = useCallback((questionId: string, value: string) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: value }))
  }, [])

  const resetQuiz = useCallback(() => {
    setQuizAnswers({})
    setHairProfile(null)
    setRoutineSteps([])
    setRecommendedProducts([])
    setRoutineChecks({})
  }, [])

  const computeResults = useCallback(() => {
    const profile: HairProfile = {
      hairType: getHairType(
        quizAnswers.curl_pattern || '2',
        quizAnswers.curl_subtype || 'A'
      ),
      porosity: quizAnswers.porosity || 'medium',
      scalpCondition: quizAnswers.scalp_condition || 'balanced',
      thickness: quizAnswers.thickness || 'medium',
      density: quizAnswers.density || 'medium',
      goal: quizAnswers.goals || 'moisture',
    }
    setHairProfile(profile)
    setRoutineSteps(getRoutineSteps(profile))
    setRecommendedProducts(getRecommendedProducts(profile))

    const checks: Record<string, boolean> = {}
    getRoutineSteps(profile).forEach((step) => {
      checks[step.id] = false
    })
    setRoutineChecks(checks)
  }, [quizAnswers])

  const toggleSaveProduct = useCallback((product: Product) => {
    setSavedProducts((prev) => {
      const exists = prev.find((p) => p.id === product.id)
      if (exists) return prev.filter((p) => p.id !== product.id)
      return [...prev, product]
    })
  }, [])

  const toggleRoutineCheck = useCallback((stepId: string) => {
    setRoutineChecks((prev) => ({ ...prev, [stepId]: !prev[stepId] }))
  }, [])

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        quizAnswers,
        setQuizAnswer,
        resetQuiz,
        isLoggedIn,
        setIsLoggedIn,
        hairProfile,
        routineSteps,
        recommendedProducts,
        computeResults,
        savedProducts,
        toggleSaveProduct,
        routineChecks,
        toggleRoutineCheck,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}

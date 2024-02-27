import React, { createContext, useContext, useMemo, useState } from "react"
import { TourProvider, useTour } from "@reactour/tour"
import useLocalStorage from "@rehooks/local-storage"
import { ONBOARDING_STEPS, ONBOARDING_STORAGE_KEY } from "utils/constants"
import OnboardingStage from "enums/OnboardingStage"

const OnboardingRootContext = createContext<OnboardingRootProviderValue | undefined>(undefined)

type OnboardingRootProviderValue = {
  completedOnboardingStages: OnboardingStage[]
  setCompletedOnboardingStages: (stages: OnboardingStage[]) => void
  currentOnboardingStage: OnboardingStage
  setCurrentOnboardingStage: React.Dispatch<React.SetStateAction<OnboardingStage>>
}

export function OnboardingRootProvider({ children }) {
  const [completedOnboardingStages, setCompletedOnboardingStages] = useLocalStorage<OnboardingStage[]>(
    ONBOARDING_STORAGE_KEY,
    []
  )
  const [currentOnboardingStage, setCurrentOnboardingStage] = useState<OnboardingStage>(OnboardingStage.Table)

  const providerValue = useMemo(
    () => ({
      completedOnboardingStages,
      setCompletedOnboardingStages,
      currentOnboardingStage,
      setCurrentOnboardingStage,
    }),
    [completedOnboardingStages, currentOnboardingStage, setCompletedOnboardingStages]
  )

  return (
    <TourProvider
      steps={[]}
      showBadge={false}
      showDots={ONBOARDING_STEPS[currentOnboardingStage].length > 1}
      showPrevNextButtons={ONBOARDING_STEPS[currentOnboardingStage].length > 1}
      showNavigation={ONBOARDING_STEPS[currentOnboardingStage].length > 1}
      padding={currentOnboardingStage === OnboardingStage.MultipleCards ? 50 : undefined}
      beforeClose={() => {
        setCompletedOnboardingStages([...completedOnboardingStages, currentOnboardingStage])
      }}
      onClickHighlighted={(e, clickProps) => {
        if (clickProps.currentStep === clickProps.steps!.length - 1) {
          clickProps.setIsOpen(false)
        }
      }}
      onClickMask={({ setCurrentStep, currentStep, steps, setIsOpen }) => {
        if (steps) {
          if (currentStep === steps.length - 1) {
            setIsOpen(false)
          }
          setCurrentStep((s) => (s === steps.length - 1 ? 0 : s + 1))
        }
      }}
      styles={{
        arrow: (base, state) => ({ ...base, color: state!.disabled ? "grey" : "inherit" }),
        dot: (base) => ({ ...base, borderRadius: 0 }),
      }}
    >
      <OnboardingRootContext.Provider value={providerValue}>
        <OnboardingProvider>{children}</OnboardingProvider>
      </OnboardingRootContext.Provider>
    </TourProvider>
  )
}

const OnboardingContext = createContext<OnboardingProviderValue | undefined>(undefined)

type OnboardingProviderValue = {
  currentOnboardingStage: OnboardingStage
  startOnboardingStage: (stage: OnboardingStage) => void
  setIsOnboardingOpen: React.Dispatch<React.SetStateAction<Boolean>>
  isOnboardingOpen: Boolean
  completedOnboardingStages: OnboardingStage[]
}

function OnboardingProvider({ children }) {
  const { currentOnboardingStage, setCurrentOnboardingStage, completedOnboardingStages } =
    useContext(OnboardingRootContext)!
  const { setIsOpen: setIsOnboardingOpen, isOpen: isOnboardingOpen, setCurrentStep, setSteps } = useTour()

  const providerValue = useMemo(
    () => ({
      currentOnboardingStage,
      startOnboardingStage: (stage: OnboardingStage) => {
        setCurrentOnboardingStage(stage)
        setSteps!(ONBOARDING_STEPS[stage])
        setCurrentStep(0)
        setIsOnboardingOpen(true)
      },
      setIsOnboardingOpen,
      isOnboardingOpen,
      completedOnboardingStages,
    }),
    [
      currentOnboardingStage,
      setIsOnboardingOpen,
      isOnboardingOpen,
      completedOnboardingStages,
      setCurrentOnboardingStage,
      setSteps,
      setCurrentStep,
    ]
  )

  return <OnboardingContext.Provider value={providerValue}>{children}</OnboardingContext.Provider>
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a OnboardingProvider")
  }
  return context
}

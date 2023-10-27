import { ReactNode, createContext, useState, useReducer } from 'react'

interface CreateCycleData {
  task: string
  minutesAmount: number
}

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface CyclesContextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  createNewCycle: (data: CreateCycleData) => void
  interruptCurrentCycle: () => void
  markCurrentCycleAsFinished: () => void
  setSecondsPast: (amount: number) => void
}

interface CyclesContextProviderProps {
  children: ReactNode
}

interface CyclesState {
  cycles: Cycle[]
  activeCycleId: string | null
}

export const CyclesContext = createContext({} as CyclesContextType)

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(
    (state: CyclesState, action: any) => {
      const { type, payload } = action

      if (!type || !payload) return state

      switch (type) {
        case 'ADD':
          return {
            ...state,
            cycles: [...state.cycles, payload.newCycle],
            activeCycleId: payload.newCycle.id,
          }

        case 'INTERRUPT':
          return {
            ...state,
            cycles: [
              state.cycles.map((cycle) => {
                if (cycle.id === state.activeCycleId) {
                  return { ...cycle, interruptedDate: new Date() }
                }

                return cycle
              }),
            ],
            activeCycleId: null,
          }

        case 'FINISH':
          return {
            ...state,
            cycles: [
              state.cycles.map((cycle) => {
                if (cycle.id === state.activeCycleId) {
                  return { ...cycle, finishedDate: new Date() }
                }

                return cycle
              }),
            ],
            activeCycleId: null,
          }

        default:
          return state
      }
    },
    { cycles: [], activeCycleId: null },
  )
  // const [cycles, setCycles] = useState<Cycle[]>([])
  // const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const { cycles, activeCycleId } = cyclesState

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    dispatch({ type: 'ADD', payload: { newCycle } })
    // setCycles((state) => [...state, newCycle])
    // setActiveCycleId(id)
    setAmountSecondsPassed(0)
  }

  function interruptCurrentCycle() {
    dispatch({ type: 'INTERRUPT', payload: {} })
    // setCycles((state) =>
    //   state.map((cycle) => {
    //     if (cycle.id === activeCycleId) {
    //       return { ...cycle, interruptedDate: new Date() }
    //     }

    //     return cycle
    //   }),
    // )

    // setActiveCycleId(null)
  }

  function markCurrentCycleAsFinished() {
    dispatch({ type: 'FINISH', payload: {} })
    // setCycles((state) =>
    //   state.map((cycle) => {
    //     if (cycle.id === activeCycleId) {
    //       return { ...cycle, finishedDate: new Date() }
    //     }

    //     return cycle
    //   }),
    // )
  }

  function setSecondsPast(amount: number) {
    setAmountSecondsPassed(amount)
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        amountSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
        markCurrentCycleAsFinished,
        setSecondsPast,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}

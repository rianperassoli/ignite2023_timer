import { ActionTypes } from './actions'

export interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface CyclesState {
  cycles: Cycle[]
  activeCycleId: string | null
}

export function cyclesReducer(state: CyclesState, action: any) {
  const { type, payload } = action

  if (!type) return state

  switch (type) {
    case ActionTypes.ADD: {
      if (!payload) return state

      return {
        ...state,
        cycles: [...state.cycles, payload.newCycle],
        activeCycleId: payload.newCycle.id,
      }
    }

    case ActionTypes.INTERRUPT:
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

    case ActionTypes.FINISH:
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
}

import { produce } from 'immer'
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

      // WITHOUT IMMER
      // return {
      //   ...state,
      //   cycles: [...state.cycles, payload.newCycle],
      //   activeCycleId: payload.newCycle.id,
      // }
      return produce(state, (draft) => {
        draft.cycles.push(payload.newCycle)
        draft.activeCycleId = payload.newCycle.id
      })
    }

    case ActionTypes.INTERRUPT: {
      // return {// WITHOUT IMMER
      //   ...state,
      //   cycles: [
      //     state.cycles.map((cycle) => {
      //       if (cycle.id === state.activeCycleId) {
      //         return { ...cycle, interruptedDate: new Date() }
      //       }

      //       return cycle
      //     }),
      //   ],
      //   activeCycleId: null,
      // }

      const currentCycleIndex = state.cycles.findIndex(
        (cycle) => cycle.id === state.activeCycleId,
      )

      if (currentCycleIndex < 0) return state

      return produce(state, (draft) => {
        draft.cycles[currentCycleIndex].interruptedDate = new Date()
        draft.activeCycleId = null
      })
    }

    case ActionTypes.FINISH: {
      // return {
      //   // WITHOUT IMMER
      //   ...state,
      //   cycles: [
      //     state.cycles.map((cycle) => {
      //       if (cycle.id === state.activeCycleId) {
      //         return { ...cycle, finishedDate: new Date() }
      //       }

      //       return cycle
      //     }),
      //   ],
      //   activeCycleId: null,
      // }
      const currentCycleIndex = state.cycles.findIndex(
        (cycle) => cycle.id === state.activeCycleId,
      )

      if (currentCycleIndex < 0) return state

      return produce(state, (draft) => {
        draft.cycles[currentCycleIndex].finishedDate = new Date()
        draft.activeCycleId = null
      })
    }

    default:
      return state
  }
}

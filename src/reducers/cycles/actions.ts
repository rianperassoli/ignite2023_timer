import { Cycle } from './reducer'

export enum ActionTypes {
  ADD = 'ADD',
  INTERRUPT = 'INTERRUPT',
  FINISH = 'FINISH',
}

export interface ActionProps {
  type: ActionTypes
  payload?: { newCycle: Cycle }
}

export function addAction(newCycle: Cycle): ActionProps {
  return {
    type: ActionTypes.ADD,
    payload: { newCycle },
  }
}

export function interruptAction(): ActionProps {
  return {
    type: ActionTypes.INTERRUPT,
  }
}

export function finishAction(): ActionProps {
  return {
    type: ActionTypes.FINISH,
  }
}

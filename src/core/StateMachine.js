class StateMachine {
  constructor(initialState, states) {
    this.currentState = initialState;
    this.states = states;
  }

  update(action) {
    const currentEdges = this.states[this.currentState];
    const isValidAction = currentEdges && currentEdges[action];

    if (!isValidAction) {
      console.warn("StateMachine update(): invalid state transition: ", action);
      return null;
    }

    const nextState = currentEdges[action];
    this.currentState = nextState;
    return this.currentState;
  }

  reset(state) {
    const isValidState = Object.hasOwn(this.states, state);
    if (!isValidState) {
      console.warn("StateMachine rest(): invalid state: ", state);
      return false;
    }

    this.currentState = state; 
    return true; 
  }

  getCurrentState() {
    return this.currentState;
  }

  getStates() {
    return this.states;
  }
}


// const exampleStateGraph = {
//   state1: {
//     action1: "state2",
//     action2: "state3",
//   },
//   state2: {
//     action1: "state1",
//     action2: "state3"
//   },
//   state3: {
//     action1: "state1",
//     action2: "state2"
//   }
// }

// action is the transition condition
// states are the nodes
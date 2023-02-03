/**
 * Each state is a ... state
 * Transitions are represented by a function. This function decides
 * what edge you take, how to get to the new state, and finally what state
 * you end up in.
 */
export default class StateMachine {

    private statesAndTransitions: {[key: string]: () => Promise<string>} = {};
    private currentState: string = null;
    private terminalStates: string[]  = [];

    setStateToEdges(state: string, transitionFn: () => Promise<string>) {
        this.statesAndTransitions[state] = transitionFn;
    }

    setState(state: string) {
        this.currentState = state;
    }

    setTerminalState(state: string) {
        this.terminalStates.push(state);
    }

    isTerminated() {
        return this.terminalStates.includes(this.currentState);
    }

    async tick() {
        if (this.currentState) {
            this.currentState = await this.statesAndTransitions[this.currentState]();
        }
    }





}
class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (!config) {
            throw new Error("Config is failed.");
        }
        this._config = config;
        this._states = this._config.states;
        this.reset();
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this._state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (!this._config.states[state]) {
            throw new Error("State does not exist.")
        }
        else {
            this._state = state;
            this.logStateInHistory(state);
        }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        var transitions = this._states[this._state].transitions;
        var newState = transitions[event];

        this.changeState(newState);
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this._state = this._config.initial;
        this._isAvailableRedo = false;
        this.clearHistory();
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */

    getStates(event) {
        var array = [];
        if (event) {
            for (var state in this._states) {
                for (var transition in this._states[state].transitions) {
                    if (transition === event) {
                        array.push(state);
                    }
                }
            }
        }
        else {
            for (var state in this._states) {
                array.push(state);
            }
        }

        return array;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
         if (!this._movesIndex) {
             return false;
         }

         this._movesIndex--;
         this._state = this._moves[this._movesIndex];
         this._isAvailableRedo = true;

         return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if ((!this._movesIndex && (this._moves.length === 1)) ||
            (!this._moves[this._movesIndex + 1]) ||
            !this._isAvailableRedo ) {
            return false;
        }

        this._movesIndex++;
        this._state = this._moves[this._movesIndex];


        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this._movesIndex = 0;
        this._moves = [];
        this._moves.push(this._state);
    }

    logStateInHistory(state) {
        this._movesIndex++;
        this._moves.push(state);
        this._isAvailableRedo = false;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/

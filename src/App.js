import { useReducer } from "react";
import "./styles.css";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};

const DEFAULT_STATE = {
  currentOperand: "",
  previousOperand: "",
};

function evaluate({ currentOperand, previousOperand, operation }) {
  const previous = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(previous) || isNaN(current)) return "";
  let computation = "";
  switch (operation) {
    case "+":
      computation = previous + current;
      break;
    case "-":
      computation = previous - current;
      break;
    case "*":
      computation = previous * current;
      break;
    case "÷":
      computation = previous / current;
      break;
    default:
      computation = "";
  }
  return computation.toString();
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.CLEAR:
      return DEFAULT_STATE;
    case ACTIONS.ADD_DIGIT:
      if (payload.digit === "0" && state.currentOperand === "0") return state;
      if (payload.digit === "." && state.currentOperand.includes("."))
        return state;
      if (state.currentOperand[0] === "0" && state.currentOperand.length >= 1) {
        state.currentOperand = state.currentOperand.slice(
          1,
          state.currentOperand.length
        );
      }

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand === "" && state.previousOperand === "")
        return state;
      if (state.currentOperand === "") {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      if (state.previousOperand === "") {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: "",
        };
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: "",
      };
    case ACTIONS.EVALUATE:
      if (
        state.previousOperand === "" ||
        state.currentOperand === "" ||
        state.operation === ""
      ) {
        return state;
      }
      return {
        ...state,
        currentOperand: evaluate(state),
        operation: "",
        previousOperand: "",
      };
    case ACTIONS.DELETE_DIGIT:
      if (state.currentOperand === "") {
        return {
          ...state,
          currentOperand: state.previousOperand,
          previousOperand: "",
          operation: "",
        };
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
    default:
      throw new Error("Action not recognized!");
  }
}
function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    DEFAULT_STATE
  );
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {previousOperand} {operation}
        </div>
        <div className="current-operand">{currentOperand}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>
      <OperationButton dispatch={dispatch} operation="÷" />

      <DigitButton dispatch={dispatch} digit="1" />
      <DigitButton dispatch={dispatch} digit="2" />
      <DigitButton dispatch={dispatch} digit="3" />

      <OperationButton dispatch={dispatch} operation="*" />

      <DigitButton dispatch={dispatch} digit="4" />
      <DigitButton dispatch={dispatch} digit="5" />
      <DigitButton dispatch={dispatch} digit="6" />

      <OperationButton dispatch={dispatch} operation="+" />

      <DigitButton dispatch={dispatch} digit="7" />
      <DigitButton dispatch={dispatch} digit="8" />
      <DigitButton dispatch={dispatch} digit="9" />

      <OperationButton dispatch={dispatch} operation="-" />

      <DigitButton dispatch={dispatch} digit="." />
      <DigitButton dispatch={dispatch} digit="0" />
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </div>
  );
}

export default App;

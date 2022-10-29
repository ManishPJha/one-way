import { combineReducers } from "redux";
import { OperatorReducer } from "./Operator/reducer";
import { authReducer } from "./auth/reducer";
import { employeeReducer } from "./Employee/reducer"

export const rootReducer = combineReducers({
    auth: authReducer,
    operator: OperatorReducer,
    employee: employeeReducer
})
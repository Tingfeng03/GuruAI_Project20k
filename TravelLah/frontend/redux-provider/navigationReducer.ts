import { NAVIGATE_TO_TRIPFLOW, NAVIGATE_TO_TRIPPLAN } from "@/actions/navigationActions";

const initialState = {
    currentRoute: "TRIPPLAN",
    tripSerialNo: null,
}

export const naviagationReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case NAVIGATE_TO_TRIPFLOW:
            return {
                ...state,
                currentRoute: "TRIPFLOW",
                tripSerialNo: action.payload.tripSerialNo
            };
        case NAVIGATE_TO_TRIPPLAN:
            return {
                ...state,
                currentRoute: "TRIPPLAN",
                tripSerialNo: null,
            }
        default:
            return state;
    }
};
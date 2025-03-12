export const NAVIGATE_TO_TRIPFLOW = "NAVIGATE_TO_TRIPFLOW";
export const NAVIGATE_TO_TRIPPLAN = "NAVIGATE_TO_TRIPPLAN";

export const navigateToTripFlow = (tripSerialNo: String) => ({
    type: NAVIGATE_TO_TRIPFLOW,
    payload: {tripSerialNo},
});

export const navigateToTripPlan = () => ({
    type: NAVIGATE_TO_TRIPPLAN,
})
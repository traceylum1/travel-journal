import apiCalls from "../Requests/apiCalls";
import { CreateTripProps } from "../Types/Props";

const tripEventHandlers = {
  createTrip: async function({tripName, description, startDate, endDate}: CreateTripProps ) {
    const usernameValue = localStorage.getItem("username");
    const username = usernameValue ? JSON.parse(usernameValue) : null;
    const userIdValue = localStorage.getItem("userId");
    const ownerId = userIdValue ? Number(JSON.parse(userIdValue)) : NaN;

    try {
      const result = await apiCalls.createTrip({
        tripName: tripName,
        description: description,
        startDate: startDate,
        endDate: endDate,
        createdBy: username,
        ownerId: ownerId,
      });

      if (result.success) {
        return result;
      } else {
        return {
          success: false,
          message: "Failed to create trip. Please try again.",
        };
      }
    } catch {
      return {
        success: false,
        message: "Failed to create trip. Please try again.",
      };
    }
  },
}

export default tripEventHandlers;

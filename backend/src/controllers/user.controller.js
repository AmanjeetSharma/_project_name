import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";





export const getProfile = asyncHandler(async (req, res) => {
    // req.user comes from verifyToken middleware

    if (!req.user) {
        return res.status(404).json(
            new ApiResponse(404, null, "User not found")
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            req.user,
            "User profile fetched successfully"
        )
    );
});
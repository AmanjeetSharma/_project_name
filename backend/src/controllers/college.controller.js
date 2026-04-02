import { College } from "../models/college.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";








const getColleges = asyncHandler(async (req, res) => {
    let {
        page = 1,
        limit = 10,
        state,
        city,
        type,
        stream,
        minCutoff,
        maxCutoff,
        search,
    } = req.query;

    page = Math.max(1, Number(page));
    limit = Math.max(1, Number(limit));
    const skip = (page - 1) * limit;

    state = state?.trim();
    city = city?.trim();
    type = type?.trim();
    stream = stream?.trim();
    search = search?.trim();

    // Escape special characters in search string for regex
    const escapeRegex = (text) =>
        text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const filter = {};

    if (state) filter["location.state"] = state;
    if (city) filter["location.city"] = city;
    if (type) filter.type = type;
    if (stream) filter.streams = stream;

    if (minCutoff || maxCutoff) {
        filter.cutoff = {};
        if (minCutoff) filter.cutoff.$gte = Number(minCutoff);
        if (maxCutoff) filter.cutoff.$lte = Number(maxCutoff);
    }

    if (search) {
        const safeSearch = escapeRegex(search);

        filter.$or = [
            { name: { $regex: safeSearch, $options: "i" } },
            { collegeId: { $regex: safeSearch, $options: "i" } },
            { "location.city": { $regex: safeSearch, $options: "i" } },
            { "location.state": { $regex: safeSearch, $options: "i" } },
        ];
    }

    // Executing queries in parallel for better performance
    const [colleges, total, state_uts] = await Promise.all([
        College.find(filter)
            .select("name location type streams cutoff")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean(),

        College.countDocuments(filter),

        College.distinct("location.state"),
    ]);

    console.log(`Fetched ${colleges.length} colleges with filter:`, filter);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                colleges,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
                state_uts,
            },
            "Colleges fetched successfully"
        )
    );
});










const getCollegeById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const college = await College.findById(id);

    if (!college) {
        throw new ApiError(404, "College not found");
    }

    return res.status(200).json(
        new ApiResponse(200, college, "College fetched successfully")
    );
});












const addCollege = asyncHandler(async (req, res) => {
    const data = req.body;

    // Basic validation
    if (!data.name || !data.collegeId) {
        throw new ApiError(400, "College name and collegeId are required");
    }

    // Check duplicate collegeId
    const existing = await College.findOne({ collegeId: data.collegeId });
    if (existing) {
        throw new ApiError(400, "College with this ID already exists");
    }

    const college = await College.create(data);

    return res.status(201).json(
        new ApiResponse(201, college, "College added successfully")
    );
});











const updateCollege = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    const college = await College.findByIdAndUpdate(
        id,
        updateData,
        {
            new: true,
            runValidators: true, // ensures schema validations are applied on update
        }
    );

    if (!college) {
        throw new ApiError(404, "College not found");
    }

    return res.status(200).json(
        new ApiResponse(200, college, "College updated successfully")
    );
});








const deleteCollege = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const college = await College.findByIdAndDelete(id);

    if (!college) {
        throw new ApiError(404, "College not found");
    }

    return res.status(200).json(
        new ApiResponse(200, null, "College deleted successfully")
    );
});












export {
    getColleges,
    getCollegeById,
    addCollege,
    updateCollege,
    deleteCollege,
}
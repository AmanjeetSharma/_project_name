import { createContext, useContext, useState } from "react";
import { axiosInstance } from "../lib/http";
import { schadenToast } from "../components/schadenToast/ToastConfig.jsx";

const CollegeContext = createContext(null);

export const CollegeProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [colleges, setColleges] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [selectedCollege, setSelectedCollege] = useState(null);
    const [filters, setFilters] = useState({
        states: [],
        cities: [],
        types: [],
        streams: [],
    });






    // GET ALL COLLEGES
    const getColleges = async (params = {}) => {
        setLoading(true);
        try {
            const { data } = await axiosInstance.get("/colleges", {
                params,
            });

            setColleges(data?.data?.colleges || []);
            setPagination(data?.data?.pagination || null);

            return true;
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                "Failed to fetch colleges";

            schadenToast.error(msg, {
                duration: 4000,
                position: "top-center",
            });

            throw err;
        } finally {
            setLoading(false);
        }
    };







    const getFilters = async () => {
        try {
            const { data } = await axiosInstance.get("/colleges/filters");
            const newFilters = {
                states: data?.data?.states || [],
                cities: data?.data?.cities || [],
                types: data?.data?.types || [],
                streams: data?.data?.streams || [],
            };

            setFilters(newFilters);

            return true;
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                "Failed to fetch filters";

            schadenToast.error(msg, {
                duration: 2000,
                position: "top-center",
            });

            throw err;
        }
    };








    // GET COLLEGE BY ID
    const getCollegeById = async (id) => {
        setLoading(true);

        try {
            const { data } = await axiosInstance.get(`/colleges/${id}`);

            setSelectedCollege(data?.data);

            return data?.data;
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                "Failed to fetch college";

            schadenToast.error(msg, {
                duration: 4000,
                position: "top-center",
            });

            throw err;
        } finally {
            setLoading(false);
        }
    };









    // ADD COLLEGE
    const addCollege = async (collegeData) => {
        setLoading(true);

        try {
            const { data } = await axiosInstance.post(
                "/colleges",
                collegeData
            );

            schadenToast.success(
                data?.message || "College added successfully",
                {
                    duration: 4000,
                    position: "top-center",
                }
            );

            return data?.data;
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                "Failed to add college";

            schadenToast.error(msg, {
                duration: 4000,
                position: "top-center",
            });

            throw err;
        } finally {
            setLoading(false);
        }
    };









    // UPDATE COLLEGE
    const updateCollege = async (id, updateData) => {
        setLoading(true);

        try {
            const { data } = await axiosInstance.put(
                `/colleges/${id}`,
                updateData
            );

            schadenToast.success(
                data?.message || "College updated successfully",
                {
                    duration: 4000,
                    position: "top-center",
                }
            );

            return data?.data;
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                "Failed to update college";

            schadenToast.error(msg, {
                duration: 4000,
                position: "top-center",
            });

            throw err;
        } finally {
            setLoading(false);
        }
    };









    // DELETE COLLEGE
    const deleteCollege = async (id) => {
        setLoading(true);

        try {
            const { data } = await axiosInstance.delete(
                `/colleges/${id}`
            );

            schadenToast.success(
                data?.message || "College deleted successfully",
                {
                    duration: 4000,
                    position: "top-center",
                }
            );

            return true;
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                "Failed to delete college";

            schadenToast.error(msg, {
                duration: 4000,
                position: "top-center",
            });

            throw err;
        } finally {
            setLoading(false);
        }
    };









    const getCollegeSuggestion = async ({ testId, state }) => {
        setLoading(true);

        try {
            const { data } = await axiosInstance.post("/colleges/college-suggestion", {
                testId,
                state
            });

            return data?.data; // array of colleges
        } catch (err) {
            const msg =
                err?.response?.data?.message || "Failed to fetch college suggestions";

            schadenToast.error(msg, {
                duration: 4000,
                position: "top-center",
            });

            throw err;
        } finally {
            setLoading(false);
        }
    };









    const value = {
        loading,
        colleges,
        pagination,
        selectedCollege,
        filters,

        getColleges,
        getCollegeById,
        addCollege,
        updateCollege,
        deleteCollege,
        getFilters,
        getCollegeSuggestion
    };

    return (
        <CollegeContext.Provider value={value}>
            {children}
        </CollegeContext.Provider>
    );
};

export const useCollege = () => {
    const context = useContext(CollegeContext);

    if (!context) {
        throw new Error(
            "useCollege must be used within CollegeProvider"
        );
    }

    return context;
};
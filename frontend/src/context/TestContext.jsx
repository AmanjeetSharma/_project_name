import { createContext, useContext, useState } from "react";
import { axiosInstance } from "../lib/http";
import { schadenToast } from "../components/schadenToast/ToastConfig.jsx";

const TestContext = createContext(null);

export const TestProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    // 🔥 GENERATE TEST
    const generateTest = async ({ studentClass, interest }) => {
        setLoading(true);

        try {
            const { data } = await axiosInstance.post("/test/build", {
                studentClass,
                interest,
            });

            schadenToast.success(
                data?.message || "Test generated successfully",
                {
                    duration: 4000,
                    position: "top-center",
                }
            );

            return data?.data; // test object
        } catch (err) {
            const msg =
                err?.response?.data?.message || "Failed to generate test";

            schadenToast.error(msg, {
                duration: 4000,
                position: "top-center",
            });

            throw err;
        } finally {
            setLoading(false);
        }
    };

    // 🔥 GET RUNNING TEST
    const getRunningTest = async () => {
        setLoading(true);

        try {
            const { data } = await axiosInstance.get("/test");

            return data?.data; // test or null
        } catch (err) {
            const msg =
                err?.response?.data?.message || "Failed to fetch running test";

            schadenToast.error(msg, {
                duration: 4000,
                position: "top-center",
            });

            throw err;
        } finally {
            setLoading(false);
        }
    };

    // 🔥 SUBMIT TEST
    const submitTest = async ({ testId, answers }) => {
        setLoading(true);

        try {
            const { data } = await axiosInstance.post("/test/submit", {
                testId,
                answers,
            });

            schadenToast.success(
                data?.message || "Test submitted successfully",
                {
                    duration: 4000,
                    position: "top-center",
                }
            );

            return data?.data; // resultId + scores
        } catch (err) {
            const msg =
                err?.response?.data?.message || "Failed to submit test";

            schadenToast.error(msg, {
                duration: 4000,
                position: "top-center",
            });

            throw err;
        } finally {
            setLoading(false);
        }
    };

    // 🔥 GET ALL TESTS (HISTORY)
    const getUserAllTests = async () => {
        setLoading(true);

        try {
            const { data } = await axiosInstance.get("/test/history");

            return data?.data; // array of tests
        } catch (err) {
            const msg =
                err?.response?.data?.message || "Failed to fetch test history";

            schadenToast.error(msg, {
                duration: 4000,
                position: "top-center",
            });

            throw err;
        } finally {
            setLoading(false);
        }
    };

    // 🔥 GET TEST BY ID (RESULT VIEW)
    const getTestById = async (testId) => {
        setLoading(true);

        try {
            const { data } = await axiosInstance.get(`/test/${testId}`);

            return data?.data; // { test, result }
        } catch (err) {
            const msg =
                err?.response?.data?.message || "Failed to fetch test";

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
        generateTest,
        getRunningTest,
        submitTest,
        getUserAllTests,
        getTestById,
    };

    return (
        <TestContext.Provider value={value}>
            {children}
        </TestContext.Provider>
    );
};

export const useTest = () => {
    const context = useContext(TestContext);

    if (!context) {
        throw new Error("useTest must be used within TestProvider");
    }

    return context;
};
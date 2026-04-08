import { createContext, useContext, useState } from "react";
import { axiosInstance } from "../lib/http";
import { shadcnToast } from "../components/shadcnToast/ToastConfig.jsx";

const TestContext = createContext(null);

export const TestProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);










    const generateTest = async ({ studentClass, interest }) => {
        setLoading(true);

        try {
            const { data } = await axiosInstance.post("/test/build", {
                studentClass,
                interest,
            });

            shadcnToast.success(
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

            shadcnToast.error(msg, {
                duration: 4000,
                position: "top-center",
            });

            throw err;
        } finally {
            setLoading(false);
        }
    };











    const getRunningTest = async () => {
        setLoading(true);

        try {
            const { data } = await axiosInstance.get("/test");

            return data?.data; // test or null
        } catch (err) {
            const msg =
                err?.response?.data?.message || "Failed to fetch running test";

            shadcnToast.error(msg, {
                duration: 4000,
                position: "top-center",
            });

            throw err;
        } finally {
            setLoading(false);
        }
    };











    const submitTest = async ({ testId, answers }) => {
        setLoading(true);

        try {
            const { data } = await axiosInstance.post("/test/submit", {
                testId,
                answers,
            });

            shadcnToast.success(
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

            shadcnToast.error(msg, {
                duration: 4000,
                position: "top-center",
            });

            throw err;
        } finally {
            setLoading(false);
        }
    };









    const getUserAllTests = async () => {
        setLoading(true);

        try {
            const { data } = await axiosInstance.get("/test/history");

            return data?.data; // array of tests
        } catch (err) {
            const msg =
                err?.response?.data?.message || "Failed to fetch test history";

            shadcnToast.error(msg, {
                duration: 4000,
                position: "top-center",
            });

            throw err;
        } finally {
            setLoading(false);
        }
    };









    const getTestById = async (testId) => {
        setLoading(true);

        try {
            const { data } = await axiosInstance.get(`/test/${testId}`);

            return data?.data; // { test, result }
        } catch (err) {
            const msg =
                err?.response?.data?.message || "Failed to fetch test";

            shadcnToast.error(msg, {
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
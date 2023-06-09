import React, { useEffect, useState } from "react";
import useEth from "./contexts/EthContext/useEth";
import IncorrectChain from "./components/IncorrectChain";
import WalletNotConnected from "./components/WalletNotConnected";
import WalletNotFound from "./components/WalletNotFound";
import "./assets/styles/index.scss";
import { ToastContainer, toast } from "react-toastify";

import { reducer, actions, initialState } from "./contexts/EthContext/state";
import { useLocation } from "react-router-dom";
import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    useRouteMatch,
} from "react-router-dom";
import Login from "./pages/Login";
import NavBar from "./components/NavBar";
import VerifyCertificate from "./pages/VerifyCertificate";
import Dashboard from "./pages/Admin/Dashboard";
import Home from "./pages/Home";
import LoadingPage from "./pages/LoadingPage";
import NotFound from "./pages/NotFound";
import Students from "./pages/Admin/Students/Students";

import StudentCreate from "./pages/Admin/Students/Create";
import Student from "./pages/Admin/Students/Student";
import SubjectCreate from "./pages/Admin/Subjects/Create";
import ProgramsCreate from "./pages/Admin/Programs/Create";

import Subjects from "./pages/Admin/Subjects/Subjects";
import Programs from "./pages/Admin/Programs/Programs";
import AccountSettings from "./pages/AccountSettings";

function App() {
    const { state, dispatch } = useEth();
    const location = useLocation();
    const [isLoadingPage, setIsLoadingPage] = useState(true);

    useEffect(() => {
        let savedUserData = JSON.parse(localStorage.getItem("certify")) || {};
        dispatch({
            type: actions.setUserState,
            data: {
                ...savedUserData,
            },
        });
        setIsLoadingPage(false);
    }, []);

    useEffect(() => {
        !isLoadingPage && shutDownDropDown();
    }, [location.pathname]);

    if (isLoadingPage) {
        return (
            <div className="absolute-center-page">
                <LoadingPage />
            </div>
        );
    }

    if (!window.ethereum) {
        return <WalletNotFound />;
    }
    if (state && state.accounts && state.accounts.length <= 0) {
        return <WalletNotConnected state={state} />;
    }

    const isLoggedIn = state && state.userState && state.userState.isLoggedIn;
    const isAdmin =
        state &&
        state.userState &&
        state.userState.user &&
        state.userState.user.isAdmin;

    const shutDownDropDown = () => {
        dispatch({
            type: actions.toggleBackdrop,
            data: false,
        });
    };

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            <NavBar state={state} />
            <div
                className={`backdrop ${
                    state.backdrop ? "backdrop--active" : ""
                }`}
                onClick={shutDownDropDown}
            ></div>
            <Routes>
                <Route
                    exact
                    path="/"
                    element={
                        isLoggedIn ? (
                            isAdmin ? (
                                <Dashboard />
                            ) : (
                                <Home />
                            )
                        ) : (
                            <Login />
                        )
                    }
                />

                <Route path="/students" element={<Students />} />
                <Route path="/students/add" exact element={<StudentCreate />} />
                <Route path="/students/:id" element={<Student />} />

                <Route path="/subjects" element={<Subjects />} />
                <Route path="/subjects/add" element={<SubjectCreate />} />
                <Route
                    path="/subjects/:id"
                    element={<SubjectCreate update={true} />}
                />

                <Route path="/programs" element={<Programs />} />
                <Route path="/programs/add" element={<ProgramsCreate />} />
                <Route
                    path="/programs/:id"
                    element={<ProgramsCreate update={true} />}
                />

                <Route
                    path="/verify-certificate"
                    element={<VerifyCertificate />}
                />
                <Route path="/account-settings" element={<AccountSettings />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}

export default App;

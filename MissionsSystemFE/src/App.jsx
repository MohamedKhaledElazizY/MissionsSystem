import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StateKeeper from './components/StateKeeper/StateKeeper';
import Home from './pages/home/Home';
import MissionMember from './pages/MissionMembers/MissionMember';
import MissionEntry from './pages/MissionEntry/MissionEntry';
import MissionSelection from './pages/MissionSelection/MissionSelection';
import Register from './pages/Register/Register';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import UserProvider from './reducers/UserProvider';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import AuthRoute from './components/AuthRoute/AuthRoute';
import Navbar from './components/Navbar/Navbar';
import Login from './pages/Login/Login';
import Authorization from './pages/Authorization/Authorization';
import History from './pages/History/History';

const App = () => {
    return (
        <UserProvider>
            <StateKeeper>
                <BrowserRouter>
                    <Routes>
                        <Route exact element={<PrivateRoute />}>
                            <Route
                                exact
                                path="/"
                                element={
                                    <>
                                        <Navbar />
                                        <Home />
                                    </>
                                }
                            />
                        </Route>
                        <Route exact element={<PrivateRoute />}>
                            <Route
                                exact
                                path="/mission-member"
                                element={
                                    <>
                                        <Navbar />
                                        <MissionMember />
                                    </>
                                }
                            />
                        </Route>
                        <Route exact element={<PrivateRoute />}>
                            <Route
                                exact
                                path="/mission-entry/:id?"
                                element={
                                    <>
                                        <Navbar />
                                        <MissionEntry />
                                    </>
                                }
                            />
                        </Route>
                        <Route exact element={<PrivateRoute />}>
                            <Route
                                exact
                                path="/mission-selection"
                                element={
                                    <>
                                        <Navbar />
                                        <MissionSelection />
                                    </>
                                }
                            />
                        </Route>
                        <Route exact element={<PrivateRoute />}>
                            <Route
                                exact
                                path="/register"
                                element={
                                    <>
                                        <Navbar />
                                        <Register />
                                    </>
                                }
                            />
                        </Route>
                        <Route exact element={<PrivateRoute />}>
                            <Route
                                exact
                                path="/reset-password"
                                element={
                                    <>
                                        <Navbar />
                                        <ResetPassword />
                                    </>
                                }
                            />
                        </Route>
                        <Route exact element={<PrivateRoute />}>
                            <Route
                                exact
                                path="/authorization"
                                element={
                                    <>
                                        <Navbar />
                                        <Authorization />
                                    </>
                                }
                            />
                        </Route>
                        <Route exact element={<PrivateRoute />}>
                            <Route
                                exact
                                path="/history"
                                element={
                                    <>
                                        <Navbar />
                                        <History />
                                    </>
                                }
                            />
                        </Route>
                        <Route exact element={<AuthRoute />}>
                            <Route exact path="/login" element={<Login />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </StateKeeper>
        </UserProvider>
    );
};

export default App;

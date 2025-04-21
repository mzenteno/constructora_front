import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PrivateRoute } from "@routes/PrivateRoute";
import { Login } from "@pages/auth/pages/Login";
import { Layout } from "@layouts/Layout";
import { Dashboard } from "@pages/dashboard/Dashboard";
import { Users } from "@pages/auth/pages/Users";
import { UsersForm } from "@pages/auth/pages/UsersForm";
import { Duplex } from "@pages/budget/pages/Duplex";
import { DuplexForm } from "@pages/budget/pages/DuplexForm";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Login />} />
        <Route path="/login" element={<Login />}></Route>

        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users-form" element={<UsersForm />} />

            <Route path="/duplex" element={<Duplex />} />
            <Route path="/duplex-form" element={<DuplexForm />} />
            <Route path="/duplex-form/:id" element={<DuplexForm />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

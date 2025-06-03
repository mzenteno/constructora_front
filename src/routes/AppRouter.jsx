import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PrivateRoute } from "@routes/PrivateRoute";
import { Login } from "@pages/auth/pages/Login";
import { Layout } from "@layouts/Layout";
import { ChangePassword } from "@pages/auth/pages/ChangePassword";
import { Dashboard } from "@pages/dashboard/Dashboard";
import { Users } from "@pages/auth/pages/Users";
import { UsersForm } from "@pages/auth/pages/UsersForm";
import { Duplex } from "@pages/budget/pages/Duplex";
import { DuplexForm } from "@pages/budget/pages/DuplexForm";
import { DuplexTracking } from "@pages/budget/pages/DuplexTracking";
import { DuplexTrackingForm } from "@pages/budget/pages/DuplexTrackingForm";
import { ExpenseType } from "@pages/expense/pages/ExpenseType";
import { ExpenseTypeForm } from "@pages/expense/pages/ExpenseTypeForm";
import { Expense } from "@pages/expense/pages/Expense";
import { ExpenseForm } from "@pages/expense/pages/ExpenseForm";
import { Supplier } from "@pages/land/pages/Supplier";
import { SupplierForm } from "@pages/land/pages/SupplierForm";
import { Land } from "@pages/land/pages/Land";
import { LandForm } from "@pages/land/pages/LandForm";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Login />} />
        <Route path="/login" element={<Login />}></Route>

        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/change-password" element={<ChangePassword />}></Route>

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/user" element={<Users />} />
            <Route path="/user-form" element={<UsersForm />} />
            <Route path="/user-form/:id" element={<UsersForm />} />

            <Route path="/duplex" element={<Duplex />} />
            <Route path="/duplex-form" element={<DuplexForm />} />
            <Route path="/duplex-form/:id" element={<DuplexForm />} />

            <Route path="/duplex-tracking" element={<DuplexTracking />} />
            <Route path="/duplex-tracking-form/:id" element={<DuplexTrackingForm />} />

            <Route path="/expense-type" element={<ExpenseType />} />
            <Route path="/expense-type-form" element={<ExpenseTypeForm />} />
            <Route path="/expense-type-form/:id" element={<ExpenseTypeForm />} />

            <Route path="/expense" element={<Expense />} />
            <Route path="/expense-form" element={<ExpenseForm />} />
            <Route path="/expense-form/:id" element={<ExpenseForm />} />

            <Route path="/supplier" element={<Supplier />} />
            <Route path="/supplier-form" element={<SupplierForm />} />
            <Route path="/supplier-form/:id" element={<SupplierForm />} />

            <Route path="/land" element={<Land />} />
            <Route path="/land-form" element={<LandForm />} />
            <Route path="/land-form/:id" element={<LandForm />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

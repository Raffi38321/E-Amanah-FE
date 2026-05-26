import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "../utils/api";

/**
 * Fetch current user and enforce role-based access.
 *
 * @param {"Mahasiswa" | "Admin" | null} requiredRole
 *   - "Mahasiswa" → redirect Admin ke /admin
 *   - "Admin"     → redirect non-Admin ke /login
 *   - null        → no role restriction, just auth check
 */
export default function useAuthUser(requiredRole = null) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    getMe()
      .then((res) => {
        if (res.status !== "succes") {
          navigate("/login");
          return;
        }
        const employee = res.data.employee;

        if (requiredRole === "Mahasiswa" && employee.role === "Admin") {
          navigate("/admin");
          return;
        }
        if (requiredRole === "Admin" && employee.role !== "Admin") {
          navigate("/login");
          return;
        }

        setUser(employee);
      })
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  }, [navigate, requiredRole]);

  return { user, loading };
}

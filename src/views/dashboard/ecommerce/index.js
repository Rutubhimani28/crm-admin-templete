// ** Styles
import "@styles/react/libs/charts/apex-charts.scss";
import "@styles/base/pages/dashboard-ecommerce.scss";
import { useEffect } from "react";
import axiosInstance from "../../../auth/axiosInstance";

const EcommerceDashboard = () => {
  const fetch = async () => {
    const res = await axiosInstance.get('/categories/categories')
  }
  useEffect(() => {
    fetch()
  }, [])
  return <div id="dashboard-ecommerce">Dashboard</div>;
};

export default EcommerceDashboard;

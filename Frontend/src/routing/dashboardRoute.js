import { createRoute } from "@tanstack/react-router";
import Dashboard from "../pages/Dashboard.jsx";
import { rootRoute } from "./routeTree.js"  


export const dashboardRoute = createRoute({
    getParentRoute: () => rootRoute,
    path:"/dashboard",
    component: Dashboard
  })
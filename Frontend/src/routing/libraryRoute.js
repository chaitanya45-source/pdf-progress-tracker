import { createRoute } from "@tanstack/react-router"
import { rootRoute } from "./routeTree.js"
import MyLibrary from "../pages/MyLibrary.jsx"

export const libraryRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/library", 
    component: MyLibrary
})

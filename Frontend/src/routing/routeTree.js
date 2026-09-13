import {createRootRoute} from '@tanstack/react-router';
import RootLayout from "../RootLayout.jsx";
import {homeRoute} from "./homeRoute.js"
import {authRoute} from "./authRoute.js"
import {dashboardRoute} from "./dashboardRoute.js"
import {libraryRoute} from "./libraryRoute.js"
import {pdfReaderRoute} from "./pdfReaderRoute.js"

export const rootRoute = createRootRoute({
    component: RootLayout
})

export const routeTree = rootRoute.addChildren([
    homeRoute,
    authRoute,
    dashboardRoute,
    libraryRoute,
    pdfReaderRoute,
]); 
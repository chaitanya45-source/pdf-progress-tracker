import { createRoute } from "@tanstack/react-router";
import PdfReader from "../pages/PdfReader.jsx";
import { rootRoute } from "./routeTree.js";

export const pdfReaderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reader/$pdfId",
  component: PdfReader,
});
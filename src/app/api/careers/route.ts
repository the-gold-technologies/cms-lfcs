import { createPageRouteHandlers } from "@/lib/page-route-factory";

const { GET, PUT } = createPageRouteHandlers("careers", "Careers");
export { GET, PUT };

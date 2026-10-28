import { createPageRouteHandlers } from "@/lib/page-route-factory";

const { GET, PUT } = createPageRouteHandlers("admissions", "Admissions");
export { GET, PUT };

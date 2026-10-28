# LFCS School CMS — AI Agent Operational Guidelines

## Overview

This CMS application provides administrative management for the Little Flower Group of Schools website (`lfcs-school`).
It is built strictly adhering to the architectural patterns established in `kokalachi-cms`.

## Rules for AI Assistants

1. **Reference Docs First**: Before adding features or making modifications, review `docs/PLAN_AND_STATUS.md` and `docs/ARCHITECTURE.md`.
2. **Keep Status Updated**: When completing a module or file, update the checklist in `docs/PLAN_AND_STATUS.md`.
3. **Preserve Resilient Fallback**: Always maintain zero-downtime static fallbacks in `lfcs-school/src/lib/content.ts` so the live school website never breaks if the CMS is offline.
4. **Sharp Image Optimization**: Never upload uncompressed image buffers directly to Cloudinary. Always process through `sharp` (WebP conversion + max 2000px downscale).
5. **Component Parity**: Any changes to frontend sections in `lfcs-school` must be mirrored in `src/app/static-pages/` editors in `lfcs-school-cms`.

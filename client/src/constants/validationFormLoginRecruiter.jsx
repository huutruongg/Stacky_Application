import { z } from "zod";
import { baseSchemas } from "./baseShemas";

export const LoginRecruiterSchema = z.object({
  email: baseSchemas.requiredEmail(),
  password: baseSchemas.password(),
});

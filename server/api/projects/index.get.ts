import { projectService } from "~~/server/services/project.service";

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event);

  return projectService.findProjectsByUserId(user.id);
});

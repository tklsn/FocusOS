import { ProjectService } from "~~/server/services/project.service";

export default defineLazyEventHandler(() => {
  const __projectService = new ProjectService();

  return defineEventHandler(async (event) => {
    const user = await getCurrentUser(event);

    return __projectService.findProjectsByUserId(user.id);
  });
});

import { Router } from 'express';
import * as projectController from '../controllers/project.controller';
import { verifyToken, requireSiteAdmin, requireProjectMember } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createProjectSchema, updateProjectSchema, inviteMemberSchema, updateMemberRoleSchema } from '../validations/project.validation';

const router = Router();

router.use(verifyToken);

router.get('/', projectController.listProjects);
router.post('/', requireSiteAdmin, validate(createProjectSchema), projectController.createProject);

router.get('/:id', requireProjectMember, projectController.getProject);
router.patch('/:id', requireSiteAdmin, validate(updateProjectSchema), projectController.updateProject);
router.delete('/:id', requireProjectMember, projectController.deleteProject);
router.patch('/:id/archive', requireSiteAdmin, projectController.archiveProject);

// Members routes
router.get('/:id/members', requireProjectMember, projectController.listMembers);
router.post('/:id/members/invite', requireSiteAdmin, validate(inviteMemberSchema), projectController.inviteMember);
router.patch('/:id/members/:userId/role', requireSiteAdmin, validate(updateMemberRoleSchema), projectController.updateMemberRole);
router.delete('/:id/members/:userId', requireSiteAdmin, projectController.removeMember);

export default router;

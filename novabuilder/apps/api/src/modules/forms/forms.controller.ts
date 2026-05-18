import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FormsService } from './forms.service';

@Controller('projects/:projectId/forms')
export class FormsController {
  constructor(private readonly forms: FormsService) {}

  @Post('submit')
  async submit(
    @Param('projectId') projectId: string,
    @Body() body: { formName: string; pageId?: string; fields: Record<string, unknown>; validationRules?: any[] },
  ) {
    if (!body.formName || !body.fields) return { error: 'formName and fields are required.' };

    if (body.validationRules?.length) {
      const { valid, errors } = this.forms.validateFields(body.fields, body.validationRules);
      if (!valid) return { error: 'Validation failed', errors };
    }

    await this.forms.submitForm(projectId, body);
    return { ok: true };
  }

  @Get('submissions')
  @UseGuards(AuthGuard('jwt'))
  async list(@Param('projectId') projectId: string, @Query('form') formName?: string) {
    return this.forms.listSubmissions(projectId, formName);
  }

  @Get('names')
  @UseGuards(AuthGuard('jwt'))
  async formNames(@Param('projectId') projectId: string) {
    return this.forms.getFormNames(projectId);
  }

  @Delete('submissions/:id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async deleteSubmission(@Param('id') id: string) {
    await this.forms.deleteSubmission(id);
    return { ok: true };
  }

  @Get('submissions/export')
  @UseGuards(AuthGuard('jwt'))
  async exportSubmissions(@Param('projectId') projectId: string, @Query('form') formName: string) {
    if (!formName) return { error: 'Form name is required.' };
    const csv = await this.forms.exportSubmissions(projectId, formName);
    return { csv, formName };
  }
}

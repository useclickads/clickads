import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { EditorModule } from './modules/editor/editor.module';
import { CmsModule } from './modules/cms/cms.module';
import { AssetsModule } from './modules/assets/assets.module';
import { TeamsModule } from './modules/teams/teams.module';
import { DeployModule } from './modules/deploy/deploy.module';
import { ThemeModule } from './modules/theme/theme.module';
import { DomainsModule } from './modules/domains/domains.module';
import { FormsModule } from './modules/forms/forms.module';
import { SettingsModule } from './modules/settings/settings.module';
import { SearchModule } from './modules/search/search.module';
import { UsersModule } from './modules/users/users.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AuditModule } from './modules/audit/audit.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { ExportModule } from './modules/export/export.module';
import { ApiKeysModule } from './modules/apikeys/apikeys.module';
import { ImportModule } from './modules/import/import.module';
import { BillingModule } from './modules/billing/billing.module';
import { AdminModule } from './modules/admin/admin.module';
import { AiModule } from './modules/ai/ai.module';
import { RealtimeModule } from './modules/realtime/realtime.module';
import { MarketplaceModule } from './modules/marketplace/marketplace.module';
import { EmailModule } from './modules/email/email.module';
import { UsageModule } from './modules/usage/usage.module';
import { ABTestingModule } from './modules/abtesting/abtesting.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import { WorkflowsModule } from './modules/workflows/workflows.module';
import { QualityModule } from './modules/quality/quality.module';

@Module({
  imports: [
    AuthModule, ProjectsModule, EditorModule, CmsModule, AssetsModule,
    TeamsModule, DeployModule, ThemeModule, DomainsModule, FormsModule,
    SettingsModule, SearchModule, UsersModule, AnalyticsModule,
    AuditModule, NotificationsModule, WebhooksModule, ExportModule,
    ApiKeysModule, ImportModule, BillingModule, AdminModule, AiModule,
    RealtimeModule, MarketplaceModule, EmailModule, UsageModule,
    ABTestingModule, IntegrationsModule, WorkflowsModule, QualityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

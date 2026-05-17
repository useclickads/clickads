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

@Module({
  imports: [AuthModule, ProjectsModule, EditorModule, CmsModule, AssetsModule, TeamsModule, DeployModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { EditorModule } from './modules/editor/editor.module';

@Module({
  imports: [AuthModule, ProjectsModule, EditorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

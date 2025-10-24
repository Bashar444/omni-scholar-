import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from '@angular/router';
import { ClarityModule } from './theme/clarity.module';
import { ThemeModule } from './theme/theme.module';
import { JwtInterceptor } from '../interceptors/jwt.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    ProfileComponent,
    PostComponent,
    CommentComponent,
    LikeComponent,
    ShareComponent,
    SearchComponent,
    NotificationComponent,
    ChatComponent,
    AdminComponent,
    EditComponent,
    DeleteComponent,
    CreateComponent,
    UpdateComponent,
    ViewComponent,
    AuthComponent,
    ClarityComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AuthGuard,
    ClarityModule,
    ThemeModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
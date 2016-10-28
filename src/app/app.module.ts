import { BrowserModule }    from '@angular/platform-browser';
import { NgModule }         from '@angular/core';
import { FormsModule }      from '@angular/forms';
import { HttpModule }       from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AuthModule }       from './auth/auth.module';
import { HomeModule }       from './home/home.module';
import { NewsModule }       from './news/news.module';

import { AppComponent }      from './app.component';
import { HeaderComponent }   from './header/header.component';

import { HeadersWithToken}  from './shared/headers-with-token.service';
import { LoggedInGuard }    from './shared/logged-in-guard.service';
import { UserService }      from './shared/user.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    AuthModule,
    NewsModule,
    HomeModule
  ],
  providers: [
      HeadersWithToken,
      LoggedInGuard,
      UserService
  ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }

import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AppConstants {
  public static readonly urlSiteMain = 'https://tunt.net';
  public static readonly pathAssets = '/assets/';
  public static readonly pathUrlFile = `${AppConstants.pathAssets}data/`;
  public static readonly pathUrlImg = `${AppConstants.pathAssets}images/`;
  public static readonly pathUrlFileInfo = `${AppConstants.pathUrlFile}dataInfo.json`;
  public static readonly imgAvatarCV = `${AppConstants.pathUrlImg}avatar-cv.jpg`;
  public static readonly imgAvatarProfile = `${AppConstants.pathUrlImg}avatar-profile.jpg`;
  public static readonly imgQrCode = `${AppConstants.pathUrlImg}qr-code.svg`;
  public static readonly imgHeroFile = `${AppConstants.pathUrlImg}hero-bg.jpg`;
  public static readonly currentYear = (new Date()).getFullYear();
}

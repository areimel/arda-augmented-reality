# Build Issues Checklist

## Script Inline Directives (2 issues)
- [ ] src/components/HeadAR.astro:22 - Add `is:inline` directive to script tag
- [ ] src/components/HeadGlobal.astro:22 - Add `is:inline` directive to script tag

## Component Issues - Unused Props (8 issues)
- [ ] src/components/AFrameComponents/CameraCorners.astro:3 - Remove unused `position` prop
- [ ] src/components/AFrameComponents/CameraCursor.astro:3 - Remove unused `position` prop
- [ ] src/components/AFrameComponents/ClickTestObject.astro:3 - Remove unused `position` prop
- [ ] src/components/AFrameComponents/GroundPlane.astro:3 - Remove unused `position` prop
- [ ] src/components/AFrameComponents/LiveClock.astro:3 - Remove unused `position` prop
- [ ] src/components/ARComponents/Camera.astro:3 - Remove unused `clickable` prop
- [ ] src/components/ARComponents/GreenScreenVideo.astro:14 - Remove unused destructured props
- [ ] src/layouts/SplashLayout.astro:17 - Remove unused `siteData` import

## Page Issues - Unused Imports (2 issues)
- [ ] src/pages/qr-scanner.astro:16 - Remove unused `SiteQRCodeLink` import
- [ ] src/pages/qr-scanner.astro:13 - Remove unused `LinkCard` import

## Page Issues - Unused Variables (deliverator, event-handler-test, image-test)
- [ ] src/pages/deliverator/index.astro:13 - Remove unused `markerImage`
- [ ] src/pages/deliverator/index.astro:11 - Remove unused `defaultScale`
- [ ] src/pages/event-handler-test/index.astro:13 - Remove unused `markerImage`
- [ ] src/pages/event-handler-test/index.astro:11 - Remove unused `defaultScale`
- [ ] src/pages/image-test/index.astro:13 - Remove unused `markerImage`
- [ ] src/pages/image-test/index.astro:11 - Remove unused `defaultScale`

## Page Issues - Greenscreen Pages (10 issues)
- [ ] src/pages/greenscreen-test/index.astro:17 - Remove unused `markerImage`
- [ ] src/pages/greenscreen-test/index.astro:15 - Remove unused `defaultScale`
- [ ] src/pages/greenscreen-test/index.astro:63 - Prefix unused `event` parameter with underscore
- [ ] src/pages/greenscreen-test/index.astro:58 - Prefix unused `event` parameter with underscore
- [ ] src/pages/greenscreen-test/index.astro:53 - Prefix unused `e` parameter with underscore
- [ ] src/pages/greenscreen-world-tracking/index.astro:17 - Remove unused `markerImage`
- [ ] src/pages/greenscreen-world-tracking/index.astro:15 - Remove unused `defaultScale`
- [ ] src/pages/greenscreen-world-tracking/index.astro:64 - Prefix unused `event` parameter with underscore
- [ ] src/pages/greenscreen-world-tracking/index.astro:59 - Prefix unused `event` parameter with underscore
- [ ] src/pages/greenscreen-world-tracking/index.astro:54 - Prefix unused `e` parameter with underscore

## Page Issues - Interactive Template (11 issues)
- [ ] src/pages/interactive-marker-template/index.astro:22 - Remove unused `assetWidth`
- [ ] src/pages/interactive-marker-template/index.astro:21 - Remove unused `assetHeight`
- [ ] src/pages/interactive-marker-template/index.astro:20 - Remove unused `assetFile`
- [ ] src/pages/interactive-marker-template/index.astro:19 - Remove unused `experienceType`
- [ ] src/pages/interactive-marker-template/index.astro:95 - Prefix unused `event` parameter with underscore
- [ ] src/pages/interactive-marker-template/index.astro:90 - Prefix unused `event` parameter with underscore
- [ ] src/pages/interactive-marker-template/index.astro:85 - Prefix unused `event` parameter with underscore
- [ ] src/pages/interactive-marker-template/index.astro:80 - Prefix unused `event` parameter with underscore
- [ ] src/pages/interactive-marker-template/index.astro:69 - Prefix unused `event` parameter with underscore
- [ ] src/pages/interactive-marker-template/index.astro:64 - Prefix unused `event` parameter with underscore
- [ ] src/pages/interactive-marker-template/index.astro:58 - Prefix unused `e` parameter with underscore

## Page Issues - Look-at Test (3 issues)
- [ ] src/pages/look-at-test/index.astro:68 - Prefix unused `event` parameter with underscore
- [ ] src/pages/look-at-test/index.astro:63 - Prefix unused `event` parameter with underscore
- [ ] src/pages/look-at-test/index.astro:58 - Prefix unused `e` parameter with underscore

## Page Issues - Testing Folder (14 issues)
- [ ] src/pages/testing/basic-demo/index.astro:22 - Remove unused `assetWidth`
- [ ] src/pages/testing/basic-demo/index.astro:21 - Remove unused `assetHeight`
- [ ] src/pages/testing/basic-demo/index.astro:20 - Remove unused `assetFile`
- [ ] src/pages/testing/basic-demo/index.astro:19 - Remove unused `experienceType`
- [ ] src/pages/testing/basic-demo/index.astro:68 - Prefix unused `event` parameter with underscore
- [ ] src/pages/testing/basic-demo/index.astro:63 - Prefix unused `event` parameter with underscore
- [ ] src/pages/testing/basic-demo/index.astro:58 - Prefix unused `e` parameter with underscore
- [ ] src/pages/testing/general-marker-template/index.astro:22 - Remove unused `assetWidth`
- [ ] src/pages/testing/general-marker-template/index.astro:21 - Remove unused `assetHeight`
- [ ] src/pages/testing/general-marker-template/index.astro:20 - Remove unused `assetFile`
- [ ] src/pages/testing/general-marker-template/index.astro:19 - Remove unused `experienceType`
- [ ] src/pages/testing/general-marker-template/index.astro:68 - Prefix unused `event` parameter with underscore
- [ ] src/pages/testing/general-marker-template/index.astro:63 - Prefix unused `event` parameter with underscore
- [ ] src/pages/testing/general-marker-template/index.astro:58 - Prefix unused `e` parameter with underscore

## Page Issues - Video Test (15 issues)
- [ ] src/pages/video-test/alpha-channel-code-test.astro:17 - Remove unused `markerImage`
- [ ] src/pages/video-test/alpha-channel-code-test.astro:15 - Remove unused `defaultScale`
- [ ] src/pages/video-test/alpha-channel-code-test.astro:63 - Prefix unused `event` parameter with underscore
- [ ] src/pages/video-test/alpha-channel-code-test.astro:58 - Prefix unused `event` parameter with underscore
- [ ] src/pages/video-test/alpha-channel-code-test.astro:53 - Prefix unused `e` parameter with underscore
- [ ] src/pages/video-test/alpha-mp4.astro:13 - Remove unused `markerImage`
- [ ] src/pages/video-test/alpha-mp4.astro:11 - Remove unused `defaultScale`
- [ ] src/pages/video-test/index.astro:13 - Remove unused `markerImage`
- [ ] src/pages/video-test/index.astro:11 - Remove unused `defaultScale`
- [ ] src/pages/video-test/webm.astro:13 - Remove unused `markerImage`
- [ ] src/pages/video-test/webm.astro:11 - Remove unused `defaultScale`

## Utility Files - Unused Event Parameters (10 issues)
- [ ] src/utils/arEventHandlers.ts:86 - Prefix unused `event` parameter with underscore
- [ ] src/utils/arEventHandlers.ts:81 - Prefix unused `event` parameter with underscore
- [ ] src/utils/arEventHandlers.ts:77 - Prefix unused `event` parameter with underscore
- [ ] src/utils/arEventHandlers.ts:72 - Prefix unused `event` parameter with underscore
- [ ] src/utils/arEventHandlers.ts:68 - Prefix unused `event` parameter with underscore
- [ ] src/utils/arVideoHandler.ts:99 - Prefix unused `event` parameter with underscore
- [ ] src/utils/arVideoHandler.ts:92 - Prefix unused `event` parameter with underscore
- [ ] src/utils/arVideoHandler.ts:84 - Prefix unused `event` parameter with underscore
- [ ] src/utils/arVideoHandler.ts:79 - Prefix unused `event` parameter with underscore
- [ ] src/utils/arVideoHandler.ts:75 - Prefix unused `event` parameter with underscore

---
**Total Issues: ~95 warnings to fix**
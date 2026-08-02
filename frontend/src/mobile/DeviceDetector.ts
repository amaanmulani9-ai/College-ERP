// ── Mobile Foundation — Device Detector Utility ───────────────────────────────

export type DeviceType = "phone" | "tablet" | "desktop";
export type OrientationType = "portrait" | "landscape";

export interface DeviceInfo {
  deviceType: DeviceType;
  isPhone: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isMobile: boolean; // phone or tablet
  orientation: OrientationType;
  isPortrait: boolean;
  isLandscape: boolean;
  isTouch: boolean;
  hasNotch: boolean;
  safeAreaInsetTop: number;
  safeAreaInsetBottom: number;
  screenWidth: number;
  screenHeight: number;
  pixelRatio: number;
}

export function detectDevice(): DeviceInfo {
  if (typeof window === "undefined") {
    return {
      deviceType: "desktop",
      isPhone: false,
      isTablet: false,
      isDesktop: true,
      isMobile: false,
      orientation: "landscape",
      isPortrait: false,
      isLandscape: true,
      isTouch: false,
      hasNotch: false,
      safeAreaInsetTop: 0,
      safeAreaInsetBottom: 0,
      screenWidth: 1280,
      screenHeight: 800,
      pixelRatio: 1,
    };
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  let deviceType: DeviceType = "desktop";
  if (width < 640) {
    deviceType = "phone";
  } else if (width < 1024) {
    deviceType = "tablet";
  }

  const isPhone = deviceType === "phone";
  const isTablet = deviceType === "tablet";
  const isDesktop = deviceType === "desktop";
  const isMobile = isPhone || isTablet;

  const orientation: OrientationType = height > width ? "portrait" : "landscape";
  const isPortrait = orientation === "portrait";
  const isLandscape = orientation === "landscape";

  // Check for safe area notch support (e.g., iPhone X+ or modern Android punch-hole)
  const hasNotch = isMobile && isPortrait && window.screen.height >= 812;

  return {
    deviceType,
    isPhone,
    isTablet,
    isDesktop,
    isMobile,
    orientation,
    isPortrait,
    isLandscape,
    isTouch,
    hasNotch,
    safeAreaInsetTop: hasNotch ? 44 : 0,
    safeAreaInsetBottom: hasNotch ? 34 : 0,
    screenWidth: width,
    screenHeight: height,
    pixelRatio: window.devicePixelRatio || 1,
  };
}

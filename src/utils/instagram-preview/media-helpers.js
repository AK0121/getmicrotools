/**
 * Helper utilities for the Instagram Reels Preview / Overlay Tester.
 */

/**
 * Check if the file is a video based on its MIME type.
 * @param {File} file
 * @returns {boolean}
 */
export function isVideoFile(file) {
  return !!(file && file.type && file.type.startsWith('video/'));
}

/**
 * Generates config attributes for building a media element.
 * @param {boolean} isVideo
 * @param {string} fitMode - 'original' or 'fill'
 * @returns {Object}
 */
export function getMediaConfig(isVideo, fitMode = 'original') {
  const fitClass = fitMode === 'fill' ? 'object-cover' : 'object-contain';
  if (isVideo) {
    return {
      tagName: 'video',
      className: `w-full h-full ${fitClass}`,
      attributes: {
        autoplay: true,
        loop: true,
        muted: true,
        playsInline: true
      }
    };
  } else {
    return {
      tagName: 'img',
      className: `w-full h-full ${fitClass}`,
      attributes: {}
    };
  }
}

/**
 * Detects and formats the aspect ratio label of media.
 * @param {number} width 
 * @param {number} height 
 * @returns {string}
 */
export function getAspectRatioLabel(width, height) {
  if (!width || !height) return '';
  const ratio = width / height;
  
  // Standard ratios check with tolerance
  const standards = [
    { name: '9:16', value: 9 / 16 },
    { name: '4:5', value: 4 / 5 },
    { name: '1:1', value: 1 },
    { name: '4:3', value: 4 / 3 },
    { name: '16:9', value: 16 / 9 }
  ];
  
  const tolerance = 0.05;
  for (const std of standards) {
    if (Math.abs(ratio - std.value) < tolerance) {
      return `${std.name} (${width}x${height})`;
    }
  }
  
  // Fallback: calculate greatest common divisor to simplify the fraction
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  const divisor = gcd(width, height);
  const simplifiedW = Math.round(width / divisor);
  const simplifiedH = Math.round(height / divisor);
  
  if (simplifiedW < 50 && simplifiedH < 50) {
    return `${simplifiedW}:${simplifiedH} (${width}x${height})`;
  }
  
  return `${ratio.toFixed(2)}:1 (${width}x${height})`;
}

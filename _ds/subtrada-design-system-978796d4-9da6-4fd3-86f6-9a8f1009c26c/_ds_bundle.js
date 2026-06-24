/* @ds-bundle: {"format":3,"namespace":"SubTradaDesignSystem_978796","components":[{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"IconButton","sourcePath":"components/buttons/IconButton.jsx"},{"name":"Avatar","sourcePath":"components/display/Avatar.jsx"},{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"StatCard","sourcePath":"components/display/StatCard.jsx"},{"name":"Tag","sourcePath":"components/display/Tag.jsx"},{"name":"TierBadge","sourcePath":"components/display/TierBadge.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Icon","sourcePath":"components/icon/Icon.jsx"},{"name":"ICON_NAMES","sourcePath":"components/icon/Icon.jsx"},{"name":"Card","sourcePath":"components/layout/Card.jsx"},{"name":"Tabs","sourcePath":"components/layout/Tabs.jsx"}],"sourceHashes":{"components/buttons/Button.jsx":"9fb57e683638","components/buttons/IconButton.jsx":"4cc45add67b1","components/display/Avatar.jsx":"314e8a9ff88e","components/display/Badge.jsx":"64532fca7f58","components/display/StatCard.jsx":"413c40663707","components/display/Tag.jsx":"16d377a62a35","components/display/TierBadge.jsx":"48f439b19750","components/forms/Checkbox.jsx":"3a066cf5724d","components/forms/Input.jsx":"bbadeaff65fb","components/forms/Select.jsx":"3c5b01152b57","components/icon/Icon.jsx":"6a8f2f72711c","components/layout/Card.jsx":"fccd5528b986","components/layout/Tabs.jsx":"85beb466f615","landing/landing.js":"6364e90d63c3","site/site.js":"8d9eacbe188c","ui_kits/contractor/dashboard.jsx":"3b79b5e2797b","ui_kits/contractor/data.jsx":"212f2b8ba5c9","ui_kits/contractor/directory.jsx":"a31c89c5e2ff","ui_kits/contractor/project.jsx":"520a68c9c111","ui_kits/contractor/shell.jsx":"66f7a3b92031"},"inlinedExternals":[],"unexposedExports":[{"name":"statusTone","sourcePath":"components/display/Badge.jsx"}]} */

(() => {

const __ds_ns = (window.SubTradaDesignSystem_978796 = window.SubTradaDesignSystem_978796 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/display/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Avatar — initials in a teal disc (people) or a square company tile (firms).
 * Falls back to initials from `name` when no `src` image is given.
 */
function initials(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
function Avatar({
  name = '',
  src,
  size = 36,
  shape = 'circle',
  tone = 'teal',
  style = {},
  ...rest
}) {
  const tones = {
    teal: ['var(--st-mint-strong)', 'var(--st-ink-900)'],
    ink: ['var(--st-ink-700)', 'var(--st-on-ink)'],
    neutral: ['var(--st-paper-2)', 'var(--st-paper-ink-dim)']
  };
  const [bg, fg] = tones[tone] || tones.teal;
  const radius = shape === 'square' ? 'var(--radius-md)' : '50%';
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-grid',
      placeItems: 'center',
      flexShrink: 0,
      width: size,
      height: size,
      borderRadius: radius,
      background: src ? `center/cover no-repeat url(${src})` : bg,
      color: fg,
      fontFamily: 'var(--font-sans)',
      fontWeight: 600,
      fontSize: Math.round(size * 0.36),
      letterSpacing: '0.01em',
      border: shape === 'square' ? '1px solid var(--st-paper-line)' : 'none',
      ...style
    }
  }, rest), src ? '' : initials(name));
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/display/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Badge — small status pill. `tone` selects the semantic colour set; the
 * SubTrada tender lifecycle maps directly onto these tones (see statusTone).
 * Set `dot` for a leading status dot, `solid` for a filled chip.
 */
const TONES = {
  success: ['var(--st-success)', 'var(--st-success-soft)', 'var(--st-success-line)'],
  info: ['var(--st-info)', 'var(--st-info-soft)', 'var(--st-info-line)'],
  violet: ['var(--st-violet)', 'var(--st-violet-soft)', 'var(--st-violet-line)'],
  warn: ['var(--st-warn)', 'var(--st-warn-soft)', 'var(--st-warn-line)'],
  danger: ['var(--st-danger)', 'var(--st-danger-soft)', 'var(--st-danger-line)'],
  neutral: ['var(--st-neutral)', 'var(--st-neutral-soft)', 'var(--st-neutral-line)'],
  gold: ['var(--st-gold)', 'var(--st-gold-soft)', 'var(--st-gold-line)']
};

/** Map a tender / lifecycle status string to a Badge tone. */
function statusTone(status) {
  const s = String(status).toLowerCase();
  if (/(won|awarded|active|verified|submitted|complete)/.test(s)) return 'success';
  if (/sent/.test(s)) return 'info';
  if (/viewed/.test(s)) return 'violet';
  if (/(pending|expiring|open|review)/.test(s)) return 'warn';
  if (/(declined|overdue|rejected|failed)/.test(s)) return 'danger';
  return 'neutral';
}
function Badge({
  children,
  tone = 'neutral',
  dot = false,
  solid = false,
  size = 'md',
  style = {},
  ...rest
}) {
  const [fg, soft, line] = TONES[tone] || TONES.neutral;
  const pad = size === 'sm' ? '2px 8px' : '4px 10px';
  const fs = size === 'sm' ? '11px' : '12px';
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      fontFamily: 'var(--font-sans)',
      fontSize: fs,
      fontWeight: 600,
      lineHeight: 1.3,
      padding: pad,
      borderRadius: 'var(--radius-pill)',
      color: solid ? 'var(--st-paper-card)' : fg,
      background: solid ? fg : soft,
      border: `1px solid ${solid ? fg : line}`,
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), dot ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: solid ? 'var(--st-paper-card)' : fg
    }
  }) : null, children);
}
Object.assign(__ds_scope, { statusTone, Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/display/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Tag — trade / capability chip. Mint-tinted by default (the directory trade
 * pills: Cladding, Demolition, Groundworks…). `muted` for a neutral chip and
 * `more` to render a "+N more" overflow tag.
 */
function Tag({
  children,
  muted = false,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      fontFamily: 'var(--font-sans)',
      fontSize: '12px',
      fontWeight: 500,
      lineHeight: 1.3,
      padding: '4px 10px',
      borderRadius: 'var(--radius-pill)',
      color: muted ? 'var(--st-paper-ink-dim)' : 'var(--st-mint-deep)',
      background: muted ? 'var(--st-neutral-soft)' : 'var(--st-mint-soft)',
      border: `1px solid ${muted ? 'var(--st-neutral-line)' : 'var(--st-mint-line)'}`,
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Tag.jsx", error: String((e && e.message) || e) }); }

// components/icon/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SubTrada icon set — Lucide-style line icons.
 * 24×24 viewBox, stroke-based, 2px stroke, round caps & joins, currentColor.
 * This mirrors the icon language used across the SubTrada product. Consumers
 * can drop in the full Lucide set 1:1; these are the glyphs the kits rely on.
 */

const PATHS = {
  // navigation
  'dashboard': '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
  'home': '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5"/>',
  'users': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  'directory': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  'settings': '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  'clipboard': '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>',
  'mail': '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  'inbox': '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  'check-square': '<path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
  'bell': '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  'calendar': '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  'file-text': '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M14 2v5h5"/><path d="M16 13H8M16 17H8M10 9H8"/>',
  'building': '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>',
  'briefcase': '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  'shield': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  'log-out': '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>',
  // actions
  'search': '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  'plus': '<path d="M12 5v14M5 12h14"/>',
  'eye': '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
  'user-plus': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/>',
  'trash': '<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  'download': '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5M12 15V3"/>',
  'edit': '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/>',
  'external-link': '<path d="M15 3h6v6M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  'upload': '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5M12 3v12"/>',
  'filter': '<path d="M22 3H2l8 9.46V19l4 2v-8.54z"/>',
  'message-circle': '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z"/>',
  'zap': '<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
  'star': '<path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>',
  'map-pin': '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  'check': '<path d="M20 6 9 17l-5-5"/>',
  'check-circle': '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>',
  'x': '<path d="M18 6 6 18M6 6l12 12"/>',
  'lock': '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  'alert-triangle': '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/>',
  'clock': '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  'more-vertical': '<circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>',
  'arrow-left': '<path d="M19 12H5M12 19l-7-7 7-7"/>',
  'arrow-right': '<path d="M5 12h14M12 5l7 7-7 7"/>',
  'chevron-right': '<path d="m9 18 6-6-6-6"/>',
  'chevron-left': '<path d="m15 18-6-6 6-6"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  'chevron-up': '<path d="m18 15-6-6-6 6"/>',
  'phone': '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  'globe': '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>'
};
function Icon({
  name,
  size = 18,
  strokeWidth = 2,
  className = '',
  style = {},
  title,
  ...rest
}) {
  const inner = PATHS[name];
  return /*#__PURE__*/React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: className,
    style: {
      display: 'inline-block',
      flexShrink: 0,
      ...style
    },
    "aria-hidden": title ? undefined : true,
    role: title ? 'img' : undefined
  }, rest), title ? /*#__PURE__*/React.createElement("title", null, title) : null, /*#__PURE__*/React.createElement("g", {
    dangerouslySetInnerHTML: {
      __html: inner || ''
    }
  }));
}

/** Names available in this build (for tooling / cards). */
const ICON_NAMES = Object.keys(PATHS);
Object.assign(__ds_scope, { Icon, ICON_NAMES });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/icon/Icon.jsx", error: String((e && e.message) || e) }); }

// components/buttons/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SubTrada Button. Primary is solid ink (near-black navy), the workhorse CTA.
 * Secondary is a white/outline button on paper. Accent is the teal action used
 * sparingly for the single most important confirm. Ghost is chrome-less.
 */
function Button({
  children,
  variant = 'secondary',
  // 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger'
  size = 'md',
  // 'sm' | 'md' | 'lg'
  iconLeft,
  iconRight,
  fullWidth = false,
  disabled = false,
  type = 'button',
  onClick,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      padding: '6px 12px',
      fontSize: '12.5px',
      radius: 'var(--radius-sm)',
      icon: 14
    },
    md: {
      padding: '9px 16px',
      fontSize: '13.5px',
      radius: 'var(--radius-md)',
      icon: 16
    },
    lg: {
      padding: '12px 22px',
      fontSize: '15px',
      radius: 'var(--radius-md)',
      icon: 18
    }
  };
  const s = sizes[size] || sizes.md;
  const variants = {
    primary: {
      background: 'var(--st-paper-ink)',
      color: 'var(--st-paper)',
      border: '1px solid var(--st-paper-ink)'
    },
    secondary: {
      background: '#fff',
      color: 'var(--st-paper-ink)',
      border: '1px solid var(--st-paper-line-2)'
    },
    accent: {
      background: 'var(--st-mint)',
      color: 'var(--st-ink-900)',
      border: '1px solid var(--st-mint)',
      fontWeight: 700
    },
    ghost: {
      background: 'transparent',
      color: 'var(--st-paper-ink)',
      border: '1px solid transparent'
    },
    danger: {
      background: '#fff',
      color: 'var(--st-danger)',
      border: '1px solid var(--st-danger-line)'
    }
  };
  const v = variants[variant] || variants.secondary;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      fontFamily: 'var(--font-sans)',
      fontSize: s.fontSize,
      fontWeight: v.fontWeight || 500,
      lineHeight: 1,
      letterSpacing: '-0.005em',
      padding: s.padding,
      borderRadius: s.radius,
      width: fullWidth ? '100%' : 'auto',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      transition: 'background var(--dur-fast), border-color var(--dur-fast), transform var(--dur-fast)',
      whiteSpace: 'nowrap',
      ...v,
      ...style
    },
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.transform = 'translateY(1px)';
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = 'none';
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'none';
    }
  }, rest), iconLeft ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconLeft,
    size: s.icon
  }) : null, children, iconRight ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconRight,
    size: s.icon
  }) : null);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/buttons/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Icon-only button — table row actions (view, invite, delete), toolbar tools,
 * the notification bell. Square hit area, subtle hover tint. `tone` colours the
 * glyph for destructive (danger) or accent affordances.
 */
function IconButton({
  icon,
  size = 'md',
  // 'sm' | 'md'
  tone = 'default',
  // 'default' | 'muted' | 'accent' | 'danger'
  label,
  disabled = false,
  onClick,
  style = {},
  ...rest
}) {
  const dim = size === 'sm' ? 28 : 34;
  const iconSize = size === 'sm' ? 15 : 17;
  const tones = {
    default: 'var(--st-paper-ink)',
    muted: 'var(--st-paper-ink-dim)',
    accent: 'var(--st-mint-deep)',
    danger: 'var(--st-danger)'
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    title: label,
    disabled: disabled,
    onClick: onClick,
    style: {
      display: 'inline-grid',
      placeItems: 'center',
      width: dim,
      height: dim,
      padding: 0,
      background: 'transparent',
      border: '1px solid transparent',
      borderRadius: 'var(--radius-sm)',
      color: tones[tone] || tones.default,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      transition: 'background var(--dur-fast), color var(--dur-fast)',
      ...style
    },
    onMouseEnter: e => {
      if (!disabled) e.currentTarget.style.background = 'rgba(0,0,0,0.05)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = 'transparent';
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: iconSize
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/display/StatCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * StatCard — the dashboard summary tile: a tinted icon chip, a big numeric, and
 * a quiet label. Rows of these head the SubTrada dashboard
 * (Active Projects, Inbound Tenders, Awarded Trades…).
 */
function StatCard({
  icon,
  value,
  label,
  tone = 'teal',
  style = {},
  ...rest
}) {
  const chip = {
    teal: ['var(--st-mint-soft)', 'var(--st-mint-deep)'],
    neutral: ['var(--st-neutral-soft)', 'var(--st-paper-ink-dim)'],
    success: ['var(--st-success-soft)', 'var(--st-success)']
  }[tone] || ['var(--st-mint-soft)', 'var(--st-mint-deep)'];
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-xl)',
      padding: '16px 18px',
      minWidth: 0,
      ...style
    }
  }, rest), icon ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'grid',
      placeItems: 'center',
      width: 38,
      height: 38,
      flexShrink: 0,
      borderRadius: 'var(--radius-md)',
      background: chip[0],
      color: chip[1]
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 19
  })) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '24px',
      fontWeight: 600,
      letterSpacing: '-0.02em',
      color: 'var(--st-paper-ink)',
      lineHeight: 1.05
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '12.5px',
      color: 'var(--st-paper-ink-dim)',
      marginTop: '2px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, label)));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/display/TierBadge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * TierBadge — the SubTrada subcontractor compliance signal: "Tier 4 — Verified".
 * Gold star + tier label. `verified` toggles the verified/not-verified wording
 * and colour (gold when verified, muted when not).
 */
function TierBadge({
  tier = 4,
  verified = false,
  style = {},
  ...rest
}) {
  const color = verified ? 'var(--st-gold)' : 'var(--st-paper-ink-dim)';
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      fontFamily: 'var(--font-sans)',
      fontSize: '12.5px',
      fontWeight: 600,
      color,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "star",
    size: 14,
    style: {
      fill: verified ? 'var(--st-gold)' : 'none'
    }
  }), "Tier ", tier, " \u2014 ", verified ? 'Verified' : 'Not Verified');
}
Object.assign(__ds_scope, { TierBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/TierBadge.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Checkbox — square, mint when checked. Used for shortlist selection,
 * permission toggles on invite, and filter facets.
 */
function Checkbox({
  checked = false,
  label,
  disabled = false,
  onChange,
  id,
  style = {},
  ...rest
}) {
  const cbId = id || (label ? 'cb-' + String(label).replace(/\s+/g, '-').toLowerCase() : undefined);
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: cbId,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '9px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      fontFamily: 'var(--font-sans)',
      fontSize: '13.5px',
      color: 'var(--st-paper-ink)',
      userSelect: 'none',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => {
      if (!disabled && onChange) onChange(!checked);
    },
    style: {
      width: 18,
      height: 18,
      flexShrink: 0,
      borderRadius: 'var(--radius-xs)',
      border: `1.5px solid ${checked ? 'var(--st-mint-strong)' : 'var(--st-paper-line-2)'}`,
      background: checked ? 'var(--st-mint-strong)' : '#fff',
      display: 'grid',
      placeItems: 'center',
      transition: 'background var(--dur-fast), border-color var(--dur-fast)'
    }
  }, checked ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 13,
    strokeWidth: 3,
    style: {
      color: 'var(--st-ink-900)'
    }
  }) : null), /*#__PURE__*/React.createElement("input", _extends({
    id: cbId,
    type: "checkbox",
    checked: checked,
    disabled: disabled,
    onChange: e => onChange && onChange(e.target.checked),
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }, rest)), label ? /*#__PURE__*/React.createElement("span", null, label) : null);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Text input on paper. White field, warm border, mint focus ring. Optional
 * leading icon (e.g. search), label, prefix (e.g. £) and hint/error text.
 */
function Input({
  label,
  hint,
  error,
  icon,
  prefix,
  id,
  style = {},
  containerStyle = {},
  ...rest
}) {
  const [focused, setFocused] = React.useState(false);
  const inputId = id || (label ? 'in-' + label.replace(/\s+/g, '-').toLowerCase() : undefined);
  const borderColor = error ? 'var(--st-danger-line)' : focused ? 'var(--st-mint-strong)' : 'var(--st-paper-line-2)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      ...containerStyle
    }
  }, label ? /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontSize: '12.5px',
      fontWeight: 500,
      color: 'var(--st-paper-ink)'
    }
  }, label) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: '#fff',
      border: `1px solid ${borderColor}`,
      borderRadius: 'var(--radius-md)',
      padding: '0 12px',
      boxShadow: focused ? '0 0 0 3px var(--focus-ring)' : 'none',
      transition: 'border-color var(--dur-fast), box-shadow var(--dur-fast)'
    }
  }, icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 16,
    style: {
      color: 'var(--st-paper-ink-dim)'
    }
  }) : null, prefix ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: '13px',
      color: 'var(--st-paper-ink-dim)'
    }
  }, prefix) : null, /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    onFocus: e => {
      setFocused(true);
      rest.onFocus && rest.onFocus(e);
    },
    onBlur: e => {
      setFocused(false);
      rest.onBlur && rest.onBlur(e);
    }
  }, rest, {
    style: {
      flex: 1,
      minWidth: 0,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: 'var(--font-sans)',
      fontSize: '14px',
      color: 'var(--st-paper-ink)',
      padding: '9px 0',
      ...style
    }
  }))), error ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '11.5px',
      color: 'var(--st-danger)'
    }
  }, error) : hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '11.5px',
      color: 'var(--st-paper-ink-dim)'
    }
  }, hint) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Select / dropdown on paper. Native <select> styled to match Input, with a
 * chevron affordance. Used for status filters, trade pickers, location, etc.
 */
function Select({
  label,
  hint,
  options = [],
  // [{value, label}] or string[]
  placeholder,
  id,
  style = {},
  containerStyle = {},
  ...rest
}) {
  const [focused, setFocused] = React.useState(false);
  const selectId = id || (label ? 'sel-' + label.replace(/\s+/g, '-').toLowerCase() : undefined);
  const opts = options.map(o => typeof o === 'string' ? {
    value: o,
    label: o
  } : o);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      ...containerStyle
    }
  }, label ? /*#__PURE__*/React.createElement("label", {
    htmlFor: selectId,
    style: {
      fontSize: '12.5px',
      fontWeight: 500,
      color: 'var(--st-paper-ink)'
    }
  }, label) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      background: '#fff',
      border: `1px solid ${focused ? 'var(--st-mint-strong)' : 'var(--st-paper-line-2)'}`,
      borderRadius: 'var(--radius-md)',
      boxShadow: focused ? '0 0 0 3px var(--focus-ring)' : 'none',
      transition: 'border-color var(--dur-fast), box-shadow var(--dur-fast)'
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: selectId,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false)
  }, rest, {
    style: {
      appearance: 'none',
      WebkitAppearance: 'none',
      MozAppearance: 'none',
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: 'var(--font-sans)',
      fontSize: '14px',
      color: 'var(--st-paper-ink)',
      padding: '9px 36px 9px 12px',
      cursor: 'pointer',
      ...style
    }
  }), placeholder ? /*#__PURE__*/React.createElement("option", {
    value: ""
  }, placeholder) : null, opts.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label))), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 16,
    style: {
      position: 'absolute',
      right: 12,
      pointerEvents: 'none',
      color: 'var(--st-paper-ink-dim)'
    }
  })), hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '11.5px',
      color: 'var(--st-paper-ink-dim)'
    }
  }, hint) : null);
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/layout/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Card — the paper surface container. White, hairline border, 12px radius,
 * soft resting shadow. Optional header with a title and a right-aligned action
 * (e.g. a "View All" link). The workhorse panel of every SubTrada screen.
 */
function Card({
  title,
  action,
  children,
  padding = 22,
  style = {},
  bodyStyle = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("section", _extends({
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-sm)',
      overflow: 'hidden',
      ...style
    }
  }, rest), title || action ? /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: `${padding}px ${padding}px 0`
    }
  }, title ? /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: '17px',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      color: 'var(--st-paper-ink)'
    }
  }, title) : /*#__PURE__*/React.createElement("span", null), action ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }
  }, action) : null) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding,
      ...bodyStyle
    }
  }, children));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Card.jsx", error: String((e && e.message) || e) }); }

// components/layout/Tabs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Tabs — underline tab bar (Trades · Documents · Team · Interested
 * Subcontractors). The active tab gets ink text and a mint underline.
 * Controlled via `value` + `onChange`, or uncontrolled with `defaultValue`.
 */
function Tabs({
  tabs = [],
  value,
  defaultValue,
  onChange,
  style = {},
  ...rest
}) {
  const items = tabs.map(t => typeof t === 'string' ? {
    value: t,
    label: t
  } : t);
  const [internal, setInternal] = React.useState(defaultValue ?? (items[0] && items[0].value));
  const active = value !== undefined ? value : internal;
  const select = v => {
    if (value === undefined) setInternal(v);
    onChange && onChange(v);
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "tablist",
    style: {
      display: 'flex',
      gap: '4px',
      borderBottom: '1px solid var(--border-subtle)',
      ...style
    }
  }, rest), items.map(t => {
    const on = t.value === active;
    return /*#__PURE__*/React.createElement("button", {
      key: t.value,
      role: "tab",
      "aria-selected": on,
      onClick: () => select(t.value),
      style: {
        position: 'relative',
        appearance: 'none',
        background: 'transparent',
        border: 'none',
        fontFamily: 'var(--font-sans)',
        fontSize: '14px',
        fontWeight: on ? 600 : 500,
        color: on ? 'var(--st-paper-ink)' : 'var(--st-paper-ink-dim)',
        padding: '10px 12px 12px',
        cursor: 'pointer',
        transition: 'color var(--dur-fast)'
      }
    }, t.label, /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: 8,
        right: 8,
        bottom: -1,
        height: 2,
        borderRadius: '2px 2px 0 0',
        background: on ? 'var(--st-mint-strong)' : 'transparent'
      }
    }));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Tabs.jsx", error: String((e && e.message) || e) }); }

// landing/landing.js
try { (() => {
/* SubTrada landing — nav state, video players, scroll reveals */
(function () {
  'use strict';

  // ---- Sticky nav background on scroll ----
  var nav = document.getElementById('nav');
  function onScroll() {
    if (window.scrollY > 24) nav.classList.add('scrolled');else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, {
    passive: true
  });
  onScroll();

  // ---- Video players: click overlay to play with native controls ----
  document.querySelectorAll('.player').forEach(function (player) {
    var video = player.querySelector('video');
    var overlay = player.querySelector('.player-overlay');
    if (!video || !overlay) return;
    function play() {
      // Pause any other playing videos
      document.querySelectorAll('.player video').forEach(function (v) {
        if (v !== video) {
          v.pause();
          var o = v.closest('.player').querySelector('.player-overlay');
          if (o) o.classList.remove('hidden');
          v.removeAttribute('controls');
        }
      });
      video.setAttribute('controls', '');
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
      overlay.classList.add('hidden');
    }
    overlay.addEventListener('click', play);
    video.addEventListener('pause', function () {
      if (!video.ended && video.currentTime > 0) return; // keep controls if just paused mid-play
    });
    video.addEventListener('ended', function () {
      overlay.classList.remove('hidden');
      video.removeAttribute('controls');
      video.currentTime = 0;
    });
  });

  // ---- Reveal on scroll ----
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revs = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    revs.forEach(function (el) {
      el.classList.add('in');
    });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -8% 0px'
    });
    revs.forEach(function (el) {
      io.observe(el);
    });
  }

  // ====================================================================
  // CALLBACK FORM
  // --------------------------------------------------------------------
  // HOW TO RECEIVE SUBMISSIONS — pick ONE:
  //   1. Set CALLBACK_ENDPOINT to a form-handler URL (Formspree, Basin,
  //      your own Xano endpoint, etc). The form POSTs JSON to it.
  //   2. Leave CALLBACK_ENDPOINT empty and set CALLBACK_EMAIL — the form
  // ====================================================================
  // CALLBACK FORM — delivery
  // --------------------------------------------------------------------
  // Right now (no backend): submissions open the visitor's mail app
  // pre-addressed to CALLBACK_EMAIL (hello@subtrada.com) and are saved to
  // localStorage ('subtrada_callbacks') as a backup.
  //
  // For FULLY AUTOMATIC delivery (no mail-app popup): deploy the included
  // serverless function — see /seo-handoff/api/callback.ts — then set
  //   CALLBACK_ENDPOINT = '/api/callback';
  // The form will POST the lead as JSON and the function emails it to
  // hello@subtrada.com. If the POST ever fails, it falls back to mailto.
  // ====================================================================
  var CALLBACK_ENDPOINT = ''; // set to '/api/callback' once the function is deployed
  var CALLBACK_EMAIL = 'hello@subtrada.com';
  var modal = document.getElementById('callbackModal');
  if (modal) {
    var formPane = document.getElementById('cbForm');
    var successPane = document.getElementById('cbSuccess');
    var form = document.getElementById('callbackForm');
    var roleInput = document.getElementById('cbRole');
    var segBtns = modal.querySelectorAll('.seg-btn');
    var lastFocus = null;
    function openModal(role) {
      lastFocus = document.activeElement;
      formPane.hidden = false;
      successPane.hidden = true;
      setRole(role || '');
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      setTimeout(function () {
        document.getElementById('cbName').focus();
      }, 120);
    }
    function closeModal() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    function setRole(role) {
      roleInput.value = role || '';
      segBtns.forEach(function (b) {
        b.classList.toggle('active', b.dataset.val === role);
      });
    }

    // Open triggers
    document.querySelectorAll('[data-callback]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        openModal(el.getAttribute('data-role') || '');
      });
    });

    // Close triggers
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-done').addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });

    // Role segmented control
    segBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        setRole(b.dataset.val);
      });
    });

    // Submit
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var phone = form.phone.value.trim();
      var email = form.email.value.trim();
      var nameEl = form.name,
        phoneEl = form.phone,
        emailEl = form.email;
      var ok = true;
      if (!name) {
        nameEl.classList.add('invalid');
        ok = false;
      } else {
        nameEl.classList.remove('invalid');
      }
      if (!phone || phone.replace(/[^0-9]/g, '').length < 7) {
        phoneEl.classList.add('invalid');
        ok = false;
      } else {
        phoneEl.classList.remove('invalid');
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        emailEl.classList.add('invalid');
        ok = false;
      } else {
        emailEl.classList.remove('invalid');
      }
      if (!ok) return;
      var lead = {
        name: name,
        phone: phone,
        email: email,
        role: roleInput.value || 'unspecified',
        company: form.company.value.trim(),
        at: new Date().toISOString()
      };

      // backup to localStorage
      try {
        var store = JSON.parse(localStorage.getItem('subtrada_callbacks') || '[]');
        store.push(lead);
        localStorage.setItem('subtrada_callbacks', JSON.stringify(store));
      } catch (err) {}

      // deliver
      var subject = 'Callback request — ' + lead.name + (lead.role !== 'unspecified' ? ' (' + lead.role + ')' : '');
      var body = 'Name: ' + lead.name + '\nPhone: ' + lead.phone + '\nEmail: ' + lead.email + '\nRole: ' + lead.role + '\nCompany: ' + (lead.company || '—') + '\nRequested: ' + lead.at;
      function mailtoSend() {
        if (!CALLBACK_EMAIL) return;
        var a = document.createElement('a');
        a.href = 'mailto:' + CALLBACK_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        a.target = '_blank';
        a.rel = 'noopener';
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
      if (CALLBACK_ENDPOINT) {
        fetch(CALLBACK_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(lead)
        }).then(function (r) {
          if (!r.ok) mailtoSend();
        }).catch(mailtoSend);
      } else {
        mailtoSend();
      }

      // success state
      document.getElementById('cbEchoPhone').textContent = phone;
      formPane.hidden = true;
      successPane.hidden = false;
      form.reset();
      setRole('');
    });
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "landing/landing.js", error: String((e && e.message) || e) }); }

// site/site.js
try { (() => {
/* ============================================================================
   SubTrada site — shared chrome (nav + footer + callback modal) and behaviour.
   Every page includes this once. Nav/footer/modal are injected into the
   placeholders <div data-nav></div>, <div data-footer></div>, <div data-modal></div>.
   Set the active nav item with  <body data-page="pricing">  (etc).
   ============================================================================ */
(function () {
  'use strict';

  var EMAIL = 'hello@subtrada.com';
  var ADDRESS = '3rd Floor, 86–90 Paul Street, London, EC2A 4NE';
  var LINKEDIN = 'https://www.linkedin.com/company/subtrada/';
  var YOUTUBE = 'https://www.youtube.com/@Subtrada';
  var BLOG = 'https://www.subtrada.com/blog';
  var SIGNIN = 'https://www.subtrada.com/signin';
  var SIGNUP = 'https://www.subtrada.com/signup';

  // ---- Delivery config for the callback form ----
  // '' → opens mail app to EMAIL (works now). Set to '/api/callback' once deployed.
  var CALLBACK_ENDPOINT = '';

  // SVG icon helpers
  function ico(path, w) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (w || 2) + '" stroke-linecap="round" stroke-linejoin="round">' + path + '</svg>';
  }
  var ICONS = {
    chevron: '<path d="m6 9 6 6 6-6"/>',
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" fill="currentColor" stroke="none"/><rect x="2" y="9" width="4" height="12" fill="currentColor" stroke="none"/><circle cx="4" cy="4" r="2" fill="currentColor" stroke="none"/>',
    youtube: '<path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-2C18.88 4 12 4 12 4s-6.88 0-8.59.42a2.78 2.78 0 0 0-1.95 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.41 19c1.71.46 8.59.46 8.59.46s6.88 0 8.59-.42a2.78 2.78 0 0 0 1.95-2 29 29 0 0 0 .46-5.29 29 29 0 0 0-.46-5.33z" fill="currentColor" stroke="none"/><polygon points="9.75,15.02 15.5,11.75 9.75,8.48" fill="#0D1F3C" stroke="none"/>'
  };

  // ---- Nav model ----
  // type: 'link' or 'menu' (dropdown). 'page' key matches body[data-page] for active state.
  var NAV = [{
    label: 'Product',
    type: 'menu',
    items: [{
      label: 'How it works',
      href: 'how-it-works.html',
      page: 'how',
      desc: 'The full procurement lifecycle, end to end'
    }, {
      label: 'Features',
      href: 'features.html',
      page: 'features',
      desc: 'Every tool in the platform'
    }, {
      label: 'For Main Contractors',
      href: 'for-contractors.html',
      page: 'contractors',
      desc: 'Diversify your supply chain, lose the admin'
    }, {
      label: 'For Subcontractors',
      href: 'for-subcontractors.html',
      page: 'subcontractors',
      desc: 'Get found by clients tendering right now'
    }]
  }, {
    label: 'Pricing',
    type: 'link',
    href: 'pricing.html',
    page: 'pricing'
  }, {
    label: 'Resources',
    type: 'menu',
    items: [{
      label: 'Help & How-to Guides',
      href: 'help.html',
      page: 'help',
      desc: 'Step-by-step walkthroughs for both sides'
    }, {
      label: 'FAQ',
      href: 'faq.html',
      page: 'faq',
      desc: 'Quick answers to common questions'
    }, {
      label: 'Blog & Insights',
      href: BLOG,
      page: 'blog',
      desc: 'Industry articles and product news',
      external: true
    }]
  }, {
    label: 'About',
    type: 'link',
    href: 'about.html',
    page: 'about'
  }];
  function navHtml() {
    var active = document.body.getAttribute('data-page') || '';
    var links = NAV.map(function (n) {
      if (n.type === 'link') {
        var on = n.page === active ? ' aria-current="page"' : '';
        return '<a class="nav-link" href="' + n.href + '"' + on + '>' + n.label + '</a>';
      }
      var childActive = n.items.some(function (i) {
        return i.page === active;
      });
      var items = n.items.map(function (i) {
        var tgt = i.external ? ' target="_blank" rel="noopener"' : '';
        return '<a class="menu-item" href="' + i.href + '"' + tgt + '>' + '<span class="menu-item-t">' + i.label + (i.external ? ' ↗' : '') + '</span>' + '<span class="menu-item-d">' + i.desc + '</span></a>';
      }).join('');
      return '<div class="nav-dd' + (childActive ? ' on' : '') + '">' + '<button class="nav-link nav-dd-btn" aria-expanded="false">' + n.label + ico(ICONS.chevron) + '</button>' + '<div class="nav-menu"><div class="nav-menu-inner">' + items + '</div></div></div>';
    }).join('');
    return '' + '<nav class="nav" id="nav"><div class="nav-inner">' + '<a class="brand" href="index.html" aria-label="SubTrada home">' + '<img src="../assets/logos/subtrada-icon-onink.svg" alt="">' + '<span class="word">SubTrada</span></a>' + '<div class="nav-links">' + links + '</div>' + '<div class="nav-cta">' + '<a class="nav-login" href="' + SIGNIN + '">Log in</a>' + '<a class="btn btn-teal" href="' + SIGNUP + '">Get started</a>' + '</div>' + '<button class="nav-burger" aria-label="Menu" aria-expanded="false">' + '<span></span><span></span><span></span></button>' + '</div>' + '<div class="nav-mobile">' + navMobileHtml() + '</div></nav>';
  }
  function navMobileHtml() {
    return NAV.map(function (n) {
      if (n.type === 'link') return '<a class="m-link" href="' + n.href + '">' + n.label + '</a>';
      return '<div class="m-group"><div class="m-group-t">' + n.label + '</div>' + n.items.map(function (i) {
        var tgt = i.external ? ' target="_blank" rel="noopener"' : '';
        return '<a class="m-link m-sub" href="' + i.href + '"' + tgt + '>' + i.label + (i.external ? ' ↗' : '') + '</a>';
      }).join('') + '</div>';
    }).join('') + '<div class="m-cta"><a class="btn btn-ghost-light" href="' + SIGNIN + '">Log in</a>' + '<a class="btn btn-teal" href="' + SIGNUP + '">Get started</a>' + '<a class="btn btn-ghost-light" href="#callback" data-callback>Request a callback</a></div>';
  }
  function footerHtml() {
    return '' + '<footer class="footer"><div class="wrap">' + '<div class="foot-grid">' + '<div class="foot-brand">' + '<a class="brand" href="index.html" style="gap:11px;">' + '<img src="../assets/logos/subtrada-icon-onink.svg" alt="" style="width:32px;">' + '<span class="word">SubTrada</span></a>' + '<p>The UK construction procurement platform — connecting main contractors and subcontractors at the moment work is placed.</p>' + '<div class="foot-tag">Right place. Right time. Right information.</div>' + '<div class="foot-social">' + '<a href="' + LINKEDIN + '" target="_blank" rel="noopener" aria-label="SubTrada on LinkedIn">' + ico(ICONS.linkedin) + '</a>' + '<a href="' + YOUTUBE + '" target="_blank" rel="noopener" aria-label="SubTrada on YouTube">' + ico(ICONS.youtube) + '</a>' + '</div>' + '</div>' + '<div class="foot-col"><h4>Product</h4>' + '<a href="how-it-works.html">How it works</a>' + '<a href="features.html">Features</a>' + '<a href="for-contractors.html">For Main Contractors</a>' + '<a href="for-subcontractors.html">For Subcontractors</a>' + '<a href="pricing.html">Pricing</a></div>' + '<div class="foot-col"><h4>Resources</h4>' + '<a href="help.html">Help &amp; Guides</a>' + '<a href="' + BLOG + '" target="_blank" rel="noopener">Blog &amp; Insights ↗</a>' + '<a href="faq.html">FAQ</a>' + '<a href="contact.html">Contact</a></div>' + '<div class="foot-col"><h4>Company</h4>' + '<a href="about.html">About &amp; Mission</a>' + '<a href="' + SIGNIN + '">Log in</a>' + '<a href="' + SIGNUP + '">Get started</a>' + '<a href="#callback" data-callback>Request a callback</a>' + '<a href="privacy.html">Privacy Policy</a>' + '<a href="terms.html">Terms of Use</a></div>' + '</div>' + '<div class="foot-bottom">' + '<span>© ' + new Date().getFullYear() + ' SubTrada Ltd. All rights reserved.</span>' + '<span class="foot-addr">' + ADDRESS + '</span>' + '</div>' + '</div></footer>';
  }
  function modalHtml() {
    return '' + '<div class="modal-overlay" id="callbackModal" aria-hidden="true"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="cbTitle">' + '<button class="modal-close" type="button" aria-label="Close">' + ico('<path d="M18 6 6 18M6 6l12 12"/>') + '</button>' + '<div class="modal-pane" id="cbForm">' + '<span class="eyebrow teal">Request a callback</span>' + '<h3 id="cbTitle">Leave your number — we\'ll call you back</h3>' + '<p class="modal-lead">Our team will give you a ring to walk you through SubTrada and book a demo at a time that suits. No calendars, no back-and-forth.</p>' + '<form id="callbackForm" novalidate>' + '<div class="field"><label for="cbName">Your name</label><input id="cbName" name="name" type="text" autocomplete="name" placeholder="e.g. Sam Doyle" required></div>' + '<div class="field"><label for="cbPhone">Phone number</label><input id="cbPhone" name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="e.g. 07700 900123" required></div>' + '<div class="field"><label for="cbEmail">Email address</label><input id="cbEmail" name="email" type="email" autocomplete="email" inputmode="email" placeholder="e.g. sam@company.co.uk" required></div>' + '<div class="field"><span class="field-label">I\'m a…</span>' + '<div class="seg" role="radiogroup" aria-label="Which side are you on">' + '<button type="button" class="seg-btn" data-val="contractor">Main Contractor</button>' + '<button type="button" class="seg-btn" data-val="subcontractor">Subcontractor</button>' + '</div><input type="hidden" name="role" id="cbRole" value=""></div>' + '<div class="field"><label for="cbCompany">Company <span class="opt">(optional)</span></label><input id="cbCompany" name="company" type="text" autocomplete="organization" placeholder="Company name"></div>' + '<button class="btn btn-teal btn-lg" type="submit" style="width:100%;margin-top:6px;">Request my callback</button>' + '<p class="modal-fine">We\'ll only use your details to arrange your demo. No spam, ever.</p>' + '</form>' + '</div>' + '<div class="modal-pane modal-success" id="cbSuccess" hidden>' + '<div class="success-tick">' + ico('<path d="M20 6 9 17l-5-5"/>', 2.5) + '</div>' + '<h3>Thanks — we\'ll be in touch</h3>' + '<p class="modal-lead">A member of the SubTrada team will call you on <b id="cbEchoPhone">your number</b> shortly to book your demo.</p>' + '<button class="btn btn-ghost-light modal-done" type="button">Done</button>' + '</div>' + '</div></div>';
  }

  // ---- Inject chrome ----
  function inject(sel, html) {
    var el = document.querySelector(sel);
    if (el) el.outerHTML = html;
  }
  inject('[data-nav]', navHtml());
  inject('[data-footer]', footerHtml());
  inject('[data-modal]', modalHtml());

  // ---- Sticky nav ----
  var nav = document.getElementById('nav');
  function onScroll() {
    if (window.scrollY > 24) nav.classList.add('scrolled');else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, {
    passive: true
  });
  onScroll();

  // ---- Desktop dropdowns (hover + click/focus for a11y) ----
  document.querySelectorAll('.nav-dd').forEach(function (dd) {
    var btn = dd.querySelector('.nav-dd-btn');
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var open = dd.classList.contains('open');
      document.querySelectorAll('.nav-dd.open').forEach(function (o) {
        o.classList.remove('open');
        o.querySelector('.nav-dd-btn').setAttribute('aria-expanded', 'false');
      });
      if (!open) {
        dd.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-dd')) document.querySelectorAll('.nav-dd.open').forEach(function (o) {
      o.classList.remove('open');
      o.querySelector('.nav-dd-btn').setAttribute('aria-expanded', 'false');
    });
  });

  // ---- Mobile menu ----
  var burger = document.querySelector('.nav-burger');
  if (burger) burger.addEventListener('click', function () {
    var open = nav.classList.toggle('mobile-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  });
  document.querySelectorAll('.nav-mobile a').forEach(function (a) {
    if (!a.hasAttribute('data-callback')) a.addEventListener('click', function () {
      nav.classList.remove('mobile-open');
      document.body.style.overflow = '';
    });
  });

  // ---- Reveal on scroll ----
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revs = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    revs.forEach(function (el) {
      el.classList.add('in');
    });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -8% 0px'
    });
    revs.forEach(function (el) {
      io.observe(el);
    });
  }

  // ---- Video players ----
  document.querySelectorAll('.player').forEach(function (player) {
    var video = player.querySelector('video');
    var overlay = player.querySelector('.player-overlay');
    if (!video || !overlay) return;
    overlay.addEventListener('click', function () {
      document.querySelectorAll('.player video').forEach(function (v) {
        if (v !== video) {
          v.pause();
          var o = v.closest('.player').querySelector('.player-overlay');
          if (o) o.classList.remove('hidden');
          v.removeAttribute('controls');
        }
      });
      video.setAttribute('controls', '');
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
      overlay.classList.add('hidden');
    });
    video.addEventListener('ended', function () {
      overlay.classList.remove('hidden');
      video.removeAttribute('controls');
      video.currentTime = 0;
    });
  });

  // ---- Accordion (FAQ / help) ----
  document.querySelectorAll('.acc-item .acc-q').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.closest('.acc-item');
      var open = item.classList.contains('open');
      var group = q.closest('[data-accordion-single]');
      if (group) group.querySelectorAll('.acc-item.open').forEach(function (o) {
        if (o !== item) o.classList.remove('open');
      });
      item.classList.toggle('open', !open);
      q.setAttribute('aria-expanded', !open ? 'true' : 'false');
    });
  });

  // ---- Guide scroll-spy (sticky chapter index) ----
  var tocLinks = document.querySelectorAll('.guide-toc .toc-link');
  if (tocLinks.length) {
    var chapters = [].map.call(tocLinks, function (l) {
      return document.querySelector(l.getAttribute('href'));
    }).filter(Boolean);
    var spy = function () {
      var pos = window.scrollY + 120;
      var current = chapters[0];
      chapters.forEach(function (c) {
        if (c.offsetTop <= pos) current = c;
      });
      tocLinks.forEach(function (l) {
        l.classList.toggle('active', l.getAttribute('href') === '#' + (current && current.id));
      });
    };
    window.addEventListener('scroll', spy, {
      passive: true
    });
    spy();
    tocLinks.forEach(function (l) {
      l.addEventListener('click', function (e) {
        var t = document.querySelector(l.getAttribute('href'));
        if (t) {
          e.preventDefault();
          window.scrollTo({
            top: t.offsetTop - 88,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ---- Callback modal ----
  var modal = document.getElementById('callbackModal');
  if (modal) {
    var formPane = document.getElementById('cbForm');
    var successPane = document.getElementById('cbSuccess');
    var form = document.getElementById('callbackForm');
    var roleInput = document.getElementById('cbRole');
    var segBtns = modal.querySelectorAll('.seg-btn');
    var lastFocus = null;
    function setRole(role) {
      roleInput.value = role || '';
      segBtns.forEach(function (b) {
        b.classList.toggle('active', b.dataset.val === role);
      });
    }
    function openModal(role) {
      lastFocus = document.activeElement;
      formPane.hidden = false;
      successPane.hidden = true;
      setRole(role || '');
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      nav.classList.remove('mobile-open');
      document.body.style.overflow = 'hidden';
      setTimeout(function () {
        document.getElementById('cbName').focus();
      }, 120);
    }
    function closeModal() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    document.querySelectorAll('[data-callback]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        openModal(el.getAttribute('data-role') || '');
      });
    });
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-done').addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });
    segBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        setRole(b.dataset.val);
      });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name.value.trim(),
        phone = form.phone.value.trim(),
        email = form.email.value.trim();
      var ok = true;
      if (!name) {
        form.name.classList.add('invalid');
        ok = false;
      } else form.name.classList.remove('invalid');
      if (!phone || phone.replace(/[^0-9]/g, '').length < 7) {
        form.phone.classList.add('invalid');
        ok = false;
      } else form.phone.classList.remove('invalid');
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        form.email.classList.add('invalid');
        ok = false;
      } else form.email.classList.remove('invalid');
      if (!ok) return;
      var lead = {
        name: name,
        phone: phone,
        email: email,
        role: roleInput.value || 'unspecified',
        company: form.company.value.trim(),
        at: new Date().toISOString()
      };
      try {
        var s = JSON.parse(localStorage.getItem('subtrada_callbacks') || '[]');
        s.push(lead);
        localStorage.setItem('subtrada_callbacks', JSON.stringify(s));
      } catch (err) {}
      var subject = 'Callback request — ' + lead.name + (lead.role !== 'unspecified' ? ' (' + lead.role + ')' : '');
      var body = 'Name: ' + lead.name + '\nPhone: ' + lead.phone + '\nEmail: ' + lead.email + '\nRole: ' + lead.role + '\nCompany: ' + (lead.company || '—') + '\nRequested: ' + lead.at;
      function mailtoSend() {
        var a = document.createElement('a');
        a.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        a.target = '_blank';
        a.rel = 'noopener';
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
      if (CALLBACK_ENDPOINT) {
        fetch(CALLBACK_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(lead)
        }).then(function (r) {
          if (!r.ok) mailtoSend();
        }).catch(mailtoSend);
      } else mailtoSend();
      document.getElementById('cbEchoPhone').textContent = phone;
      formPane.hidden = true;
      successPane.hidden = false;
      form.reset();
      setRole('');
    });
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "site/site.js", error: String((e && e.message) || e) }); }

// ui_kits/contractor/dashboard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Dashboard screen. Attaches to window. */

function ProjectRow({
  p,
  onOpen
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onClick: () => onOpen(p),
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 16px',
      margin: '0 -16px',
      borderRadius: 'var(--radius-md)',
      borderBottom: '1px solid var(--border-subtle)',
      cursor: 'pointer',
      background: hover ? 'var(--surface-sunken)' : 'transparent',
      transition: 'background var(--dur-fast)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14.5,
      fontWeight: 600,
      color: 'var(--st-paper-ink)'
    }
  }, p.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--st-paper-ink-dim)',
      marginTop: 2
    }
  }, p.loc)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: statusTone(p.status),
    solid: p.status === 'Active'
  }, p.status), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      color: 'var(--st-paper-ink)',
      minWidth: 110,
      textAlign: 'right'
    }
  }, p.value)));
}
function OutboundTable() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: 13.5
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      textAlign: 'left',
      color: 'var(--st-paper-ink-dim)'
    }
  }, ['Project › Trade', 'Issue Date', 'Return Date', 'Returned / Invited', 'Status'].map((h, i) => /*#__PURE__*/React.createElement("th", {
    key: h,
    style: {
      padding: '0 16px 12px 0',
      fontWeight: 500,
      fontSize: 11.5,
      fontFamily: 'var(--font-mono)',
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      textAlign: i === 4 ? 'right' : 'left'
    }
  }, h)))), /*#__PURE__*/React.createElement("tbody", null, CD.outbound.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i,
    style: {
      borderTop: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '13px 16px 13px 0'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      color: 'var(--st-paper-ink)'
    }
  }, r.proj), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--st-paper-ink-dim)'
    }
  }, " \u203A ", r.trade)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '13px 16px 13px 0',
      fontFamily: 'var(--font-mono)',
      fontSize: 12.5,
      color: 'var(--st-paper-ink-dim)'
    }
  }, r.issue), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '13px 16px 13px 0',
      fontFamily: 'var(--font-mono)',
      fontSize: 12.5,
      color: 'var(--st-paper-ink-dim)'
    }
  }, r.ret), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '13px 16px 13px 0',
      fontFamily: 'var(--font-mono)',
      fontSize: 12.5,
      color: 'var(--st-paper-ink)'
    }
  }, r.returned), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '13px 0 13px 0',
      textAlign: 'right'
    }
  }, r.status === '—' ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--st-paper-ink-dim)'
    }
  }, "\u2014") : /*#__PURE__*/React.createElement(Badge, {
    tone: statusTone(r.status),
    dot: true,
    size: "sm"
  }, r.status)))))));
}
function Dashboard({
  onOpenProject
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 40px 56px',
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: 12
    }
  }, CD.stats.map((s, i) => /*#__PURE__*/React.createElement(StatCard, _extends({
    key: i
  }, s)))), /*#__PURE__*/React.createElement(Card, {
    title: "My Projects",
    action: /*#__PURE__*/React.createElement("a", {
      className: "st-link"
    }, "View All")
  }, /*#__PURE__*/React.createElement("div", null, CD.projects.map(p => /*#__PURE__*/React.createElement(ProjectRow, {
    key: p.id,
    p: p,
    onOpen: onOpenProject
  })))), /*#__PURE__*/React.createElement(Card, {
    title: "Procurement (Outbound)",
    action: /*#__PURE__*/React.createElement("a", {
      className: "st-link"
    }, "View All")
  }, /*#__PURE__*/React.createElement(OutboundTable, null)));
}
Object.assign(window, {
  Dashboard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/contractor/dashboard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/contractor/data.jsx
try { (() => {
/* Mock data for the SubTrada main-contractor (client) UI kit. Attaches to window. */
window.CD = {
  user: {
    name: 'Ryan Willson',
    role: 'Client',
    initials: 'RW',
    company: 'Mayfair Construction'
  },
  stats: [{
    icon: 'clipboard',
    value: '7',
    label: 'Active Projects'
  }, {
    icon: 'inbox',
    value: '2',
    label: 'Inbound Tenders'
  }, {
    icon: 'clock',
    value: '1',
    label: 'Upcoming Deadlines'
  }, {
    icon: 'check-circle',
    value: '0',
    label: 'Awarded Trades',
    tone: 'neutral'
  }, {
    icon: 'mail',
    value: '22',
    label: 'Outbound — Live Tasks',
    tone: 'neutral'
  }],
  projects: [{
    id: 'p1',
    name: 'Cut & Carve Office Refurb, Central London',
    loc: 'London',
    status: 'Active',
    value: '£85,000,000',
    desc: 'Cat-A office refurbishment over 9 floors.',
    start: '02 Sep 2025',
    end: '14 Aug 2026',
    trades: 12,
    procured: 58
  }, {
    id: 'p2',
    name: 'Hotel Fit Out',
    loc: 'London',
    status: 'Active',
    value: '£150,000,000',
    desc: '220-key hotel, full fit-out.',
    start: '11 Jun 2025',
    end: '20 Dec 2026',
    trades: 18,
    procured: 41
  }, {
    id: 'p3',
    name: 'Rayne Gardens',
    loc: 'South East',
    status: 'Active',
    value: '£30,000,000',
    desc: '127 units in Essex.',
    start: '06 Oct 2025',
    end: '21 Oct 2026',
    trades: 3,
    procured: 0
  }, {
    id: 'p4',
    name: 'Tottenham Regeneration',
    loc: 'London',
    status: 'Active',
    value: '£75,000,000',
    desc: 'Mixed-use regeneration, phase 1.',
    start: '01 Mar 2025',
    end: '30 Jun 2027',
    trades: 22,
    procured: 67
  }, {
    id: 'p5',
    name: 'Prime Residential New Build — Kent',
    loc: 'East of England',
    status: 'Completed',
    value: '£2,000,000',
    desc: '8 detached homes.',
    start: '10 Jan 2024',
    end: '18 Nov 2024',
    trades: 6,
    procured: 100
  }],
  outbound: [{
    proj: 'Prime Residential New Build — Kent',
    trade: 'Carpentry',
    issue: '24 May 2026',
    ret: '—',
    returned: '24 May 2026',
    status: '—'
  }, {
    proj: 'Lewisham Regeneration',
    trade: 'Ceramic',
    issue: '24 May 2026',
    ret: '—',
    returned: '24 May 2026',
    status: 'Sent'
  }, {
    proj: 'Rayne Gardens',
    trade: 'Brickwork',
    issue: '21 May 2026',
    ret: '04 Jun 2026',
    returned: '3 / 5',
    status: 'Sent'
  }, {
    proj: 'Hotel Fit Out',
    trade: 'Metalwork',
    issue: '18 May 2026',
    ret: '01 Jun 2026',
    returned: '2 / 5',
    status: 'Submitted'
  }, {
    proj: 'Tottenham Regeneration',
    trade: 'Groundworks',
    issue: '12 May 2026',
    ret: '26 May 2026',
    returned: '4 / 6',
    status: 'Won'
  }],
  trades: ['All Trades', 'Groundworks', 'Brickwork', 'Carpentry', 'Ceramic', 'Cladding', 'Demolition', 'Drainage', 'Metalwork', 'Roofing'],
  locations: ['All Locations', 'London', 'South East', 'East of England', 'Midlands', 'North West'],
  subbies: [{
    id: 's1',
    name: 'GHDS',
    initials: 'G',
    tier: 4,
    verified: false,
    trades: ['Cladding', 'Demolition', 'Drainage'],
    more: 46,
    rating: 0,
    reviews: 0,
    open: true,
    featured: true,
    turnover: '£5m – £10m',
    years: 12,
    regions: 'London · South East',
    contact: 'Tom Hale',
    email: 'tom@ghds.co.uk',
    phone: '020 7946 1122',
    website: 'ghds.co.uk'
  }, {
    id: 's2',
    name: 'Byrne Contractors Ltd',
    initials: 'B',
    tier: 4,
    verified: true,
    trades: ['Groundworks'],
    more: 0,
    rating: 0,
    reviews: 0,
    open: true,
    featured: false,
    reg: '01994275',
    turnover: '£5m – £10m',
    years: 8,
    regions: 'South East',
    contact: 'Ryan Boyes',
    email: 'ryan@byrne-contractors.co.uk',
    phone: '01634 811229',
    website: 'byrne-contractors.co.uk'
  }, {
    id: 's3',
    name: 'Bolton Steel & Fabrication',
    initials: 'BS',
    tier: 3,
    verified: true,
    trades: ['Metalwork', 'Cladding'],
    more: 2,
    rating: 4.6,
    reviews: 18,
    open: true,
    featured: false,
    reg: '04421190',
    turnover: '£10m – £25m',
    years: 21,
    regions: 'North West · Midlands',
    contact: 'Dawn Petrie',
    email: 'dawn@boltonsteel.co.uk',
    phone: '01204 552210',
    website: 'boltonsteel.co.uk'
  }, {
    id: 's4',
    name: 'Elco Group',
    initials: 'EL',
    tier: 3,
    verified: true,
    trades: ['Electrical', 'EV Charging'],
    more: 4,
    rating: 4.9,
    reviews: 31,
    open: true,
    featured: false,
    reg: '07781204',
    turnover: '£25m+',
    years: 16,
    regions: 'National',
    contact: 'Priya Shah',
    email: 'priya@elcogroup.co.uk',
    phone: '0161 200 4410',
    website: 'elcogroup.co.uk'
  }],
  // Tender comparison — Kings Heights · Metalwork
  comparison: {
    project: 'Kings Heights — Metalwork',
    trade: 'Metalwork',
    status: 'In Progress',
    counts: {
      submitted: 2,
      sent: 1,
      viewed: 1,
      declined: 1,
      total: 5
    },
    bidders: [{
      name: 'Steelworks Ltd',
      state: 'Submitted',
      total: '£133,760.00'
    }, {
      name: 'Bolton Steel & Fabrication',
      state: 'Submitted',
      total: '£136,005.00'
    }, {
      name: 'MetalPro Engineering',
      state: 'Viewed',
      total: null
    }, {
      name: 'Harrison Fabrications',
      state: 'Declined',
      total: null
    }],
    sections: [{
      title: 'STRUCTURAL METALWORK',
      rows: [{
        ref: 'M01',
        desc: 'Supply structural beams',
        unit: 'kg',
        qty: '2500',
        bids: [{
          rate: '2.50',
          total: '£6,250.00'
        }, {
          rate: '2.35',
          total: '£5,875.00'
        }]
      }, {
        ref: 'M02',
        desc: 'Supply columns',
        unit: 'kg',
        qty: '1800',
        bids: [{
          rate: '2.50',
          total: '£4,500.00'
        }, {
          rate: '2.35',
          total: '£4,230.00'
        }]
      }, {
        ref: 'M03',
        desc: 'Supply bracing',
        unit: 'kg',
        qty: '3200',
        bids: [{
          rate: '2.80',
          total: '£8,960.00'
        }, {
          rate: '2.84',
          total: '£9,100.00'
        }]
      }, {
        ref: 'M04',
        desc: 'Lintels',
        unit: 'nr',
        qty: '95',
        bids: [{
          rate: '150.00',
          total: '£14,250.00'
        }, {
          rate: '145.26',
          total: '£13,800.00'
        }]
      }, {
        ref: 'M05',
        desc: 'Galv finish',
        unit: 'item',
        qty: '1',
        bids: [{
          rate: '3500.00',
          total: '£3,500.00',
          note: 'Includes hot-dip galv finish'
        }, {
          rate: '3200.00',
          total: '£3,200.00'
        }]
      }]
    }, {
      title: 'MISCELLANEOUS METALWORK',
      rows: [{
        ref: 'M06',
        desc: 'Balustrade',
        unit: 'nr',
        qty: '32',
        bids: [{
          rate: '1500.00',
          total: '£48,000.00',
          note: 'Powder-coated'
        }, {
          rate: '1625.00',
          total: '£52,000.00',
          note: 'Premium finish'
        }]
      }, {
        ref: 'M07',
        desc: 'Handrail',
        unit: 'm',
        qty: '180',
        bids: [{
          rate: '150.00',
          total: '£27,000.00'
        }, {
          rate: '141.67',
          total: '£25,500.00'
        }]
      }, {
        ref: 'M08',
        desc: 'Stairs',
        unit: 'nr',
        qty: '4',
        bids: [{
          rate: '4625.00',
          total: '£18,500.00',
          note: 'Includes handrails'
        }, {
          rate: '4800.00',
          total: '£19,200.00'
        }]
      }, {
        ref: 'M09',
        desc: 'Delivery',
        unit: 'item',
        qty: '1',
        bids: [{
          rate: '2800.00',
          total: '£2,800.00',
          note: 'Single delivery, no crane'
        }, {
          rate: '3100.00',
          total: '£3,100.00'
        }]
      }]
    }],
    grand: ['£133,760.00', '£136,005.00']
  },
  // Recommended subbies on a project
  recommended: [{
    name: 'Elco Group — Solar PV & EV Charging Specialists',
    initials: 'EL',
    match: 60,
    tier: 4
  }, {
    name: "Daniel's Contractors & Development Ltd.",
    initials: 'DA',
    match: 60,
    tier: 4
  }, {
    name: 'Northgate Civils',
    initials: 'NC',
    match: 55,
    tier: 3
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/contractor/data.jsx", error: String((e && e.message) || e) }); }

// ui_kits/contractor/directory.jsx
try { (() => {
/* Subcontractor Directory + profile drawer. Attaches to window. */

function SubbieCard({
  s,
  onView,
  featured
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      background: 'var(--surface-card)',
      border: featured ? '1px solid var(--st-gold-line)' : '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-xl)',
      padding: 20,
      boxShadow: 'var(--shadow-sm)'
    }
  }, featured ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: -1,
      left: 18,
      right: 18,
      height: 3,
      background: 'var(--st-gold)',
      borderRadius: '0 0 3px 3px'
    }
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: s.name,
    shape: "square",
    tone: "neutral",
    size: 42
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--st-paper-ink)'
    }
  }, s.name), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement(TierBadge, {
    tier: s.tier,
    verified: s.verified
  })))), featured ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--st-gold)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "star",
    size: 18,
    style: {
      fill: 'var(--st-gold)'
    }
  })) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6,
      margin: '14px 0'
    }
  }, s.trades.map(t => /*#__PURE__*/React.createElement(Tag, {
    key: t
  }, t)), s.more ? /*#__PURE__*/React.createElement(Tag, {
    muted: true
  }, "+", s.more, " more") : null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 12.5,
      color: s.open ? 'var(--st-success)' : 'var(--st-paper-ink-dim)',
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: s.open ? 'var(--st-success)' : 'var(--st-neutral)'
    }
  }), s.open ? 'Open to Tenders' : 'Not currently tendering'), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    fullWidth: true,
    onClick: () => onView(s)
  }, "View Profile"));
}
function Field({
  label,
  value,
  link
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--st-paper-ink-dim)',
      marginBottom: 4
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 500,
      color: link ? 'var(--st-mint-deep)' : 'var(--st-paper-ink)'
    }
  }, value || /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--st-paper-ink-dim)',
      fontStyle: 'italic',
      fontWeight: 400
    }
  }, "Not provided")));
}
function SectionTitle({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--st-paper-ink)',
      margin: '22px 0 12px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 3,
      height: 15,
      background: 'var(--st-mint-strong)',
      borderRadius: 2
    }
  }), children);
}
function ProfileDrawer({
  s,
  onClose,
  onShortlist,
  shortlisted
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(10,20,23,0.35)',
      zIndex: 50,
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: 460,
      maxWidth: '90%',
      height: '100%',
      background: 'var(--surface-page)',
      boxShadow: 'var(--shadow-lg)',
      display: 'flex',
      flexDirection: 'column',
      animation: 'stslide 240ms var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 24px',
      borderBottom: '1px solid var(--st-paper-line)',
      display: 'flex',
      gap: 14,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: s.name,
    shape: "square",
    tone: "neutral",
    size: 44
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 600,
      color: 'var(--st-paper-ink)'
    }
  }, s.name), s.reg ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11.5,
      color: 'var(--st-paper-ink-dim)',
      marginTop: 2
    }
  }, "Reg: ", s.reg) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'center',
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(TierBadge, {
    tier: s.tier,
    verified: s.verified
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 5,
      fontSize: 12.5,
      color: 'var(--st-success)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: 'var(--st-success)'
    }
  }), "Open to Tenders"))), /*#__PURE__*/React.createElement(IconButton, {
    icon: "x",
    label: "Close",
    tone: "muted",
    onClick: onClose
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '4px 24px 20px'
    }
  }, /*#__PURE__*/React.createElement(SectionTitle, null, "Company Overview"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '0 20px'
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Turnover Band",
    value: s.turnover
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Years in Business",
    value: s.years + ' years'
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Trades",
    value: /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6
      }
    }, s.trades.map(t => /*#__PURE__*/React.createElement(Tag, {
      key: t
    }, t)))
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Regions Covered",
    value: s.regions
  })), /*#__PURE__*/React.createElement(SectionTitle, null, "Tender Contact Details"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      border: '1px solid var(--st-paper-line)',
      borderRadius: 'var(--radius-lg)',
      padding: 16
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Contact Name",
    value: s.contact
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Email",
    value: s.email,
    link: true
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Phone",
    value: s.phone
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Website",
    value: /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5
      }
    }, s.website, " ", /*#__PURE__*/React.createElement(Icon, {
      name: "external-link",
      size: 13
    })),
    link: true
  })), /*#__PURE__*/React.createElement(SectionTitle, null, "RIDDOR & Safety Statistics"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 10
    }
  }, [['0', 'RIDDOR Reportable'], ['0', 'Lost Time Incidents'], ['0', 'Near Misses']].map(([n, l]) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      background: '#fff',
      border: '1px solid var(--st-paper-line)',
      borderRadius: 'var(--radius-lg)',
      padding: '14px 10px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 600,
      color: 'var(--st-success)'
    }
  }, n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--st-paper-ink-dim)',
      marginTop: 2
    }
  }, l)))), /*#__PURE__*/React.createElement(SectionTitle, null, "Compliance Progress"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 10
    }
  }, [4, 3, 2, 1].map(t => {
    const done = t >= s.tier;
    return /*#__PURE__*/React.createElement("div", {
      key: t,
      style: {
        background: done ? 'var(--st-success-soft)' : '#fff',
        border: `1px solid ${done ? 'var(--st-success-line)' : 'var(--st-paper-line)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '16px 8px',
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        placeItems: 'center',
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 30,
        height: 30,
        borderRadius: '50%',
        display: 'grid',
        placeItems: 'center',
        background: done ? 'var(--st-success)' : 'transparent',
        color: done ? '#fff' : 'var(--st-paper-ink-dim)',
        border: done ? 'none' : '1.5px solid var(--st-paper-line-2)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: done ? 'check' : 'lock',
      size: 15,
      strokeWidth: done ? 3 : 2
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5,
        fontWeight: 600,
        color: done ? 'var(--st-success)' : 'var(--st-paper-ink-dim)'
      }
    }, "Tier ", t));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      padding: 18,
      borderTop: '1px solid var(--st-paper-line)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    iconLeft: "mail",
    style: {
      flex: 1
    }
  }, "Send Tender Invitation"), /*#__PURE__*/React.createElement(Button, {
    variant: shortlisted ? 'accent' : 'secondary',
    iconLeft: shortlisted ? 'check' : 'plus',
    onClick: () => onShortlist(s)
  }, shortlisted ? 'Shortlisted' : 'Add to Shortlist'))));
}
function Directory() {
  const [active, setActive] = React.useState(null);
  const [shortlist, setShortlist] = React.useState({});
  const [q, setQ] = React.useState('');
  const featured = CD.subbies.filter(s => s.featured);
  const rest = CD.subbies.filter(s => !s.featured && s.name.toLowerCase().includes(q.toLowerCase()));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 40px 56px',
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: 18
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 14,
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--st-paper-ink)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "filter",
    size: 16,
    style: {
      color: 'var(--st-mint-deep)'
    }
  }), " Filter Directory"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Input, {
    icon: "search",
    placeholder: "Search by name\u2026",
    value: q,
    onChange: e => setQ(e.target.value)
  }), /*#__PURE__*/React.createElement(Select, {
    options: CD.trades
  }), /*#__PURE__*/React.createElement(Select, {
    options: CD.locations
  }), /*#__PURE__*/React.createElement(Select, {
    options: ['All Accreditations', 'CHAS', 'SafeContractor', 'Constructionline', 'ISO 9001']
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      fontSize: 12.5,
      color: 'var(--st-paper-ink-dim)'
    }
  }, "Showing ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--st-paper-ink)'
    }
  }, rest.length + featured.length), " subcontractors")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12,
      fontSize: 16,
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "star",
    size: 16,
    style: {
      color: 'var(--st-gold)',
      fill: 'var(--st-gold)'
    }
  }), " Featured Subcontractors", /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral",
    size: "sm"
  }, featured.length)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: 14
    }
  }, featured.map(s => /*#__PURE__*/React.createElement(SubbieCard, {
    key: s.id,
    s: s,
    featured: true,
    onView: setActive
  })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12,
      fontSize: 16,
      fontWeight: 600
    }
  }, "Subcontractors ", /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral",
    size: "sm"
  }, rest.length)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: 14
    }
  }, rest.map(s => /*#__PURE__*/React.createElement(SubbieCard, {
    key: s.id,
    s: s,
    onView: setActive
  }))))), active ? /*#__PURE__*/React.createElement(ProfileDrawer, {
    s: active,
    onClose: () => setActive(null),
    shortlisted: !!shortlist[active.id],
    onShortlist: s => setShortlist(m => ({
      ...m,
      [s.id]: !m[s.id]
    }))
  }) : null);
}
Object.assign(window, {
  Directory
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/contractor/directory.jsx", error: String((e && e.message) || e) }); }

// ui_kits/contractor/project.jsx
try { (() => {
/* Project page: details, progress, quick actions, tabs, procurement tracker. */

function MiniRow({
  label,
  value,
  strong
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      padding: '7px 0'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--st-paper-ink-dim)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: strong ? 18 : 13.5,
      fontWeight: strong ? 700 : 500,
      color: 'var(--st-paper-ink)',
      fontFamily: strong ? 'var(--font-mono)' : 'var(--font-sans)'
    }
  }, value));
}
function TrackerTable() {
  const rows = [{
    trade: 'Ceramic',
    budget: '£420,000',
    site: '12 Jan 2026',
    due: '5 days',
    status: 'Pending',
    award: '—'
  }, {
    trade: 'Brickwork',
    budget: '£1,150,000',
    site: '02 Feb 2026',
    due: '—',
    status: 'Not started',
    award: '—'
  }, {
    trade: 'Appliances',
    budget: '£280,000',
    site: '20 Feb 2026',
    due: '12 days',
    status: 'Pending',
    award: '—'
  }];
  return /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: 13.5
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      color: 'var(--st-paper-ink-dim)'
    }
  }, ['Trade Category', 'Budget', 'Start on Site', 'Due In', 'Status', 'Award Value', 'Actions'].map((h, i) => /*#__PURE__*/React.createElement("th", {
    key: h,
    style: {
      padding: '0 14px 12px 0',
      fontWeight: 500,
      fontSize: 11,
      fontFamily: 'var(--font-mono)',
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      textAlign: i >= 5 ? 'right' : 'left'
    }
  }, h)))), /*#__PURE__*/React.createElement("tbody", null, rows.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i,
    style: {
      borderTop: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 14px 14px 0',
      fontWeight: 600,
      color: 'var(--st-paper-ink)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 14,
    style: {
      color: 'var(--st-paper-ink-dim)'
    }
  }), r.trade)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 14px 14px 0',
      fontFamily: 'var(--font-mono)',
      fontSize: 12.5
    }
  }, r.budget), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 14px 14px 0',
      fontFamily: 'var(--font-mono)',
      fontSize: 12.5,
      color: 'var(--st-paper-ink-dim)'
    }
  }, r.site), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 14px 14px 0',
      fontFamily: 'var(--font-mono)',
      fontSize: 12.5,
      color: 'var(--st-paper-ink-dim)'
    }
  }, r.due), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 14px 14px 0'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: statusTone(r.status),
    size: "sm"
  }, r.status)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 14px 14px 0',
      textAlign: 'right',
      color: 'var(--st-paper-ink-dim)'
    }
  }, r.award), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 0',
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      gap: 2,
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "eye",
    label: "View",
    tone: "accent",
    size: "sm"
  }), /*#__PURE__*/React.createElement(IconButton, {
    icon: "user-plus",
    label: "Invite",
    size: "sm"
  }), /*#__PURE__*/React.createElement(IconButton, {
    icon: "trash",
    label: "Delete",
    tone: "danger",
    size: "sm"
  })))))));
}
function ProjectPage({
  project,
  onBack,
  onCompare
}) {
  const p = project || CD.projects[2];
  const [tab, setTab] = React.useState('Trades');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 40px 56px',
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("a", {
    className: "st-link",
    onClick: onBack,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 13,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-left",
    size: 15
  }), " Back to Dashboard"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.1fr 1fr 1fr',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Project Details"
  }, /*#__PURE__*/React.createElement(MiniRow, {
    label: "Description",
    value: p.desc
  }), /*#__PURE__*/React.createElement(MiniRow, {
    label: "Start Date",
    value: p.start
  }), /*#__PURE__*/React.createElement(MiniRow, {
    label: "Completion Date",
    value: p.end
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--border-subtle)',
      marginTop: 6,
      paddingTop: 4
    }
  }, /*#__PURE__*/React.createElement(MiniRow, {
    label: "Total Value",
    value: p.value,
    strong: true
  }))), /*#__PURE__*/React.createElement(Card, {
    title: "Procurement Progress"
  }, /*#__PURE__*/React.createElement(MiniRow, {
    label: "Total Trades",
    value: `0 / ${p.trades}`,
    strong: true
  }), /*#__PURE__*/React.createElement(MiniRow, {
    label: "% of Total Value Procured",
    value: `${p.procured}%`
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 6,
      borderRadius: 3,
      background: 'var(--surface-sunken)',
      overflow: 'hidden',
      margin: '4px 0 12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${p.procured}%`,
      height: '100%',
      background: 'linear-gradient(90deg, var(--st-mint-strong), var(--st-mint))'
    }
  })), /*#__PURE__*/React.createElement(MiniRow, {
    label: "Total Awarded Value",
    value: "\xA30.00",
    strong: true
  })), /*#__PURE__*/React.createElement(Card, {
    title: "Quick Actions"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    iconLeft: "plus",
    fullWidth: true
  }, "Add New Trade"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    iconLeft: "edit",
    fullWidth: true
  }, "Edit Project"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    iconLeft: "download",
    fullWidth: true
  }, "Export Data")))), /*#__PURE__*/React.createElement(Tabs, {
    tabs: ['Trades', 'Documents', 'Team', 'Interested Subcontractors'],
    value: tab,
    onChange: setTab
  }), tab === 'Trades' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Card, {
    title: "Procurement Tracker",
    action: /*#__PURE__*/React.createElement("div", {
      style: {
        width: 220
      }
    }, /*#__PURE__*/React.createElement(Input, {
      icon: "search",
      placeholder: "Search trades\u2026"
    }))
  }, /*#__PURE__*/React.createElement(TrackerTable, null)), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 4,
      fontSize: 16,
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "zap",
    size: 17,
    style: {
      color: 'var(--st-mint-deep)'
    }
  }), " Recommended Subcontractors", /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral",
    size: "sm"
  }, "20")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 14px',
      fontSize: 13,
      color: 'var(--st-paper-ink-dim)'
    }
  }, "Matched on this project's trades, location and required accreditations."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, CD.recommended.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '10px 12px',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: r.name,
    shape: "square",
    tone: "neutral",
    size: 36
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--st-paper-ink)'
    }
  }, r.name), /*#__PURE__*/React.createElement(Badge, {
    tone: "warn",
    size: "sm"
  }, r.match, "% match"), /*#__PURE__*/React.createElement(TierBadge, {
    tier: r.tier
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    onClick: onCompare
  }, "Invite")))))) : /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '40px 0',
      textAlign: 'center',
      color: 'var(--st-paper-ink-dim)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: tab === 'Documents' ? 'file-text' : tab === 'Team' ? 'users' : 'directory',
    size: 28,
    style: {
      opacity: 0.5
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      fontSize: 14
    }
  }, tab, " \u2014 nothing to show in this demo view."))));
}
Object.assign(window, {
  ProjectPage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/contractor/project.jsx", error: String((e && e.message) || e) }); }

// ui_kits/contractor/shell.jsx
try { (() => {
/* SubTrada contractor shell: Sidebar + Topbar. Attaches to window. */

function STBrand() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 11,
      padding: '20px 22px 18px'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logos/subtrada-icon-light.svg",
    alt: "",
    style: {
      width: 30,
      height: 'auto'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 19,
      fontWeight: 600,
      letterSpacing: '-0.02em',
      color: 'var(--st-cream)'
    }
  }, "Sub", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--st-teal)'
    }
  }, "Trada")));
}
function NavItem({
  icon,
  label,
  active,
  hasChild,
  onClick
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      width: '100%',
      padding: '9px 12px',
      borderRadius: 'var(--radius-md)',
      border: 'none',
      cursor: 'pointer',
      textAlign: 'left',
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5,
      fontWeight: active ? 600 : 500,
      color: active ? 'var(--st-mint)' : hover ? 'var(--st-on-ink)' : 'var(--st-on-ink-dim)',
      background: active ? 'var(--st-mint-soft)' : hover ? 'rgba(255,255,255,0.04)' : 'transparent',
      transition: 'background var(--dur-fast), color var(--dur-fast)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 18
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, label), hasChild ? /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 15,
    style: {
      opacity: 0.6
    }
  }) : null);
}
function NavGroup({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 12px',
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--st-on-ink-faint)',
      padding: '0 12px 8px',
      fontWeight: 500
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, children));
}
function Sidebar({
  route,
  go
}) {
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 'var(--sidebar-w)',
      flexShrink: 0,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--st-ink-800)',
      borderRight: '1px solid var(--st-line-on-ink)'
    }
  }, /*#__PURE__*/React.createElement(STBrand, null), /*#__PURE__*/React.createElement("nav", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '8px 0'
    }
  }, /*#__PURE__*/React.createElement(NavGroup, {
    label: "Main"
  }, /*#__PURE__*/React.createElement(NavItem, {
    icon: "home",
    label: "Dashboard",
    active: route === 'dashboard',
    onClick: () => go('dashboard')
  }), /*#__PURE__*/React.createElement(NavItem, {
    icon: "directory",
    label: "Subcontractor Directory",
    active: route === 'directory',
    onClick: () => go('directory')
  }), /*#__PURE__*/React.createElement(NavItem, {
    icon: "users",
    label: "Team & Admin",
    active: route === 'team',
    onClick: () => go('team')
  }), /*#__PURE__*/React.createElement(NavItem, {
    icon: "settings",
    label: "Settings",
    active: route === 'settings',
    onClick: () => go('settings')
  })), /*#__PURE__*/React.createElement(NavGroup, {
    label: "Projects"
  }, /*#__PURE__*/React.createElement(NavItem, {
    icon: "clipboard",
    label: "Project Dashboard",
    hasChild: true,
    active: route === 'project',
    onClick: () => go('project')
  }), /*#__PURE__*/React.createElement(NavItem, {
    icon: "mail",
    label: "Tendering",
    hasChild: true,
    active: route === 'comparison',
    onClick: () => go('comparison')
  }), /*#__PURE__*/React.createElement(NavItem, {
    icon: "inbox",
    label: "Inbound Tenders",
    active: route === 'inbound',
    onClick: () => go('inbound')
  }), /*#__PURE__*/React.createElement(NavItem, {
    icon: "check-square",
    label: "PQQ",
    active: route === 'pqq',
    onClick: () => go('pqq')
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 12,
      borderTop: '1px solid var(--st-line-on-ink)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: 10,
      borderRadius: 'var(--radius-md)',
      background: 'rgba(255,255,255,0.03)'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: CD.user.name,
    size: 34
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--st-on-ink)'
    }
  }, CD.user.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--st-on-ink-faint)'
    }
  }, CD.user.role)))));
}
function Topbar({
  title,
  subtitle,
  onBell,
  bellOpen,
  actions
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 20,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 24,
      padding: '26px 40px 18px',
      background: 'var(--surface-page)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 30,
      fontWeight: 600,
      letterSpacing: '-0.025em',
      color: 'var(--st-paper-ink)'
    }
  }, title), subtitle ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '5px 0 0',
      fontSize: 14.5,
      color: 'var(--st-paper-ink-dim)'
    }
  }, subtitle) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      flexShrink: 0
    }
  }, actions, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBell,
    style: {
      position: 'relative',
      width: 40,
      height: 40,
      borderRadius: '50%',
      cursor: 'pointer',
      background: '#fff',
      border: '1px solid var(--st-paper-line-2)',
      display: 'grid',
      placeItems: 'center',
      color: 'var(--st-paper-ink)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bell",
    size: 18
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: -3,
      right: -3,
      minWidth: 17,
      height: 17,
      padding: '0 4px',
      borderRadius: 9,
      background: 'var(--st-danger)',
      color: '#fff',
      fontSize: 10,
      fontWeight: 700,
      display: 'grid',
      placeItems: 'center',
      fontFamily: 'var(--font-mono)'
    }
  }, "15")), bellOpen ? /*#__PURE__*/React.createElement(NotificationPanel, null) : null)));
}
function NotificationPanel() {
  const items = [{
    icon: 'alert-triangle',
    tone: 'var(--st-warn)',
    text: 'Byrne Contractors — Employers Liability insurance expires in 14 days.'
  }, {
    icon: 'inbox',
    tone: 'var(--st-info)',
    text: 'New tender return from Bolton Steel on Hotel Fit Out · Metalwork.'
  }, {
    icon: 'zap',
    tone: 'var(--st-mint-deep)',
    text: '3 subcontractors expressed interest in Rayne Gardens.'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 0,
      top: 48,
      width: 340,
      zIndex: 40,
      background: '#fff',
      border: '1px solid var(--st-paper-line)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-pop)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 16px',
      borderBottom: '1px solid var(--st-paper-line)',
      fontWeight: 600,
      fontSize: 14
    }
  }, "Notifications"), items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      gap: 11,
      padding: '12px 16px',
      borderBottom: i < items.length - 1 ? '1px solid var(--st-paper-line)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: it.tone,
      marginTop: 1
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: it.icon,
    size: 16
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      lineHeight: 1.45,
      color: 'var(--st-paper-ink)'
    }
  }, it.text))));
}
Object.assign(window, {
  Sidebar,
  Topbar
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/contractor/shell.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.TierBadge = __ds_scope.TierBadge;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.ICON_NAMES = __ds_scope.ICON_NAMES;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Tabs = __ds_scope.Tabs;

})();

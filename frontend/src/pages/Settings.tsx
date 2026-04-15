import { useState, useEffect, useCallback, useRef } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/ThemeToggle';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';
import {
  User,
  Sliders,
  Monitor,
  Shield,
  BookOpen,
  LogOut,
  Sun,
  Moon,
  ArrowLeft,
  Camera,
  ZoomIn,
  ZoomOut,
  RotateCw,
  X,
  Check,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

/* ═══════════════════════════════════════════════════════
   TYPES & CONSTANTS
   ═══════════════════════════════════════════════════════ */
type Section = 'profile' | 'preferences' | 'sessions';

const NAV_SECTIONS = [
  {
    title: 'Account',
    items: [
      { id: 'profile' as Section, label: 'Profile', icon: User },
      { id: 'preferences' as Section, label: 'Preferences', icon: Sliders },
    ],
  },
  {
    title: 'Security',
    items: [
      { id: 'sessions' as Section, label: 'Sessions', icon: Shield },
    ],
  },
];

const PREFS_KEY = 'quantview-notification-prefs';
const PROFILE_KEY = 'quantview-profile';

interface NotificationPrefs {
  priceAlerts: boolean;
  modelUpdates: boolean;
  marketOpenClose: boolean;
  emailDigest: boolean;
}

const DEFAULT_PREFS: NotificationPrefs = {
  priceAlerts: true,
  modelUpdates: true,
  marketOpenClose: false,
  emailDigest: false,
};

function loadPrefs(): NotificationPrefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_PREFS;
}

function savePrefsToStorage(prefs: NotificationPrefs) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

/* ═══════════════════════════════════════════════════════
   CANVAS CROP UTILITY
   ═══════════════════════════════════════════════════════ */
async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<File> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(new File([blob!], 'avatar.png', { type: 'image/png' }));
    }, 'image/png', 1);
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', (e) => reject(e));
    img.crossOrigin = 'anonymous';
    img.src = url;
  });
}

/* ═══════════════════════════════════════════════════════
   CROP MODAL COMPONENT
   ═══════════════════════════════════════════════════════ */
function CropModal({
  imageSrc,
  onCancel,
  onConfirm,
}: {
  imageSrc: string;
  onCancel: () => void;
  onConfirm: (file: File) => Promise<void>;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [applying, setApplying] = useState(false);

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    setApplying(true);
    try {
      const file = await getCroppedImg(imageSrc, croppedAreaPixels);
      await onConfirm(file);
    } catch {
      toast({ title: 'Crop failed', variant: 'destructive' });
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-card border border-border w-[90vw] max-w-lg flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
            Crop Avatar
          </span>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Crop area */}
        <div className="relative w-full aspect-square bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1}
            cropShape="rect"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
            style={{
              containerStyle: { background: '#000' },
              cropAreaStyle: { border: '2px solid hsl(0 0% 98%)' },
            }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border">
          <div className="flex items-center gap-3">
            {/* Zoom */}
            <button
              onClick={() => setZoom((z) => Math.max(1, z - 0.2))}
              className="w-7 h-7 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[10px] text-muted-foreground w-10 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(3, z + 0.2))}
              className="w-7 h-7 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            {/* Rotate */}
            <button
              onClick={() => setRotation((r) => (r + 90) % 360)}
              className="w-7 h-7 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors ml-2"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-1.5 text-xs font-mono uppercase tracking-wider border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={applying}
              className="px-4 py-1.5 text-xs font-mono uppercase tracking-wider bg-foreground text-background hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-1.5"
            >
              {applying ? (
                <div className="w-3 h-3 border-2 border-background border-t-transparent rounded-full animate-spin" />
              ) : (
                <Check className="w-3 h-3" />
              )}
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SETTINGS PAGE
   ═══════════════════════════════════════════════════════ */
export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { user, isLoaded } = useUser();
  const clerk = useClerk();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<Section>('profile');

  /* ── Profile form state ── */
  const [displayName, setDisplayName] = useState('');
  const [organization, setOrganization] = useState('');
  const [saving, setSaving] = useState(false);

  /* Load profile from Clerk (primary) or localStorage (fallback) */
  useEffect(() => {
    if (isLoaded && user) {
      setDisplayName(user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User');
      setOrganization(
        (user.unsafeMetadata?.organization as string) ||
        localStorage.getItem(PROFILE_KEY + '-org') ||
        ''
      );
    } else if (isLoaded && !user) {
      const savedProfile = localStorage.getItem(PROFILE_KEY);
      if (savedProfile) {
        try {
          const p = JSON.parse(savedProfile);
          setDisplayName(p.displayName || 'User');
          setOrganization(p.organization || '');
        } catch {}
      }
    }
  }, [isLoaded, user]);

  const email = user?.primaryEmailAddress?.emailAddress || 'user@quantview.io';
  const avatarUrl = user?.imageUrl || null;
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'QV';

  /* ── Avatar crop state ── */
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCropImageSrc(reader.result as string);
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCroppedUpload = useCallback(async (croppedFile: File) => {
    if (!user) return;
    setUploadingAvatar(true);
    try {
      await user.setProfileImage({ file: croppedFile });
      toast({ title: 'Avatar updated' });
      setCropImageSrc(null); // Close modal only on success
    } catch (err: any) {
      console.error('Avatar upload error:', err);
      toast({
        title: 'Failed to upload avatar',
        description: err?.errors?.[0]?.longMessage || err?.message || 'Try a smaller image.',
        variant: 'destructive',
      });
      throw err; // Re-throw so modal knows it failed
    } finally {
      setUploadingAvatar(false);
    }
  }, [user]);

  const handleRemoveAvatar = useCallback(async () => {
    if (!user) return;
    setUploadingAvatar(true);
    try {
      await user.setProfileImage({ file: null });
      toast({ title: 'Avatar removed' });
    } catch (err: any) {
      console.error('Avatar remove error:', err);
      toast({ title: 'Failed to remove avatar', description: err?.message, variant: 'destructive' });
    } finally {
      setUploadingAvatar(false);
    }
  }, [user]);

  /* ── Save profile ── */
  const handleSaveProfile = useCallback(async () => {
    setSaving(true);

    /* Always save to localStorage as source of truth */
    localStorage.setItem(PROFILE_KEY, JSON.stringify({ displayName, organization }));
    localStorage.setItem(PROFILE_KEY + '-org', organization);

    /* Try to save to Clerk */
    if (user) {
      try {
        const nameParts = displayName.trim().split(' ').filter(Boolean);
        const newFirst = nameParts[0] || '';
        const newLast = nameParts.slice(1).join(' ') || '';
        await user.update({
          firstName: newFirst,
          lastName: newLast,
          unsafeMetadata: {
            ...user.unsafeMetadata,
            organization,
          },
        });
        toast({
          title: 'Profile saved',
          description: 'Changes synced to your account.',
        });
      } catch (err: any) {
        console.error('Clerk profile save error:', err);
        toast({
          title: 'Profile saved locally',
          description: 'Could not sync to Clerk: ' + (err?.errors?.[0]?.longMessage || err?.message || 'Unknown error'),
        });
      }
    } else {
      toast({
        title: 'Profile saved',
        description: 'Changes saved locally.',
      });
    }

    setSaving(false);
  }, [user, displayName, organization]);

  /* ── Notification preferences ── */
  const [notifPrefs, setNotifPrefs] = useState<NotificationPrefs>(loadPrefs);

  const updatePref = useCallback((key: keyof NotificationPrefs, value: boolean) => {
    setNotifPrefs((prev) => {
      const next = { ...prev, [key]: value };
      savePrefsToStorage(next);
      const labels: Record<string, string> = {
        priceAlerts: 'Price Alerts',
        modelUpdates: 'Model Updates',
        marketOpenClose: 'Market Open/Close',
        emailDigest: 'Email Digest',
      };
      toast({ title: `${labels[key]} ${value ? 'enabled' : 'disabled'}` });
      return next;
    });
  }, []);

  /* ── Sessions ── */
  const [sessions, setSessions] = useState<any[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  const fetchSessions = useCallback(async () => {
    if (!clerk?.client) return;
    setLoadingSessions(true);
    try {
      const allSessions = clerk.client.sessions;
      setSessions(
        allSessions.map((s: any) => ({
          id: s.id,
          status: s.status,
          lastActiveAt: s.lastActiveAt ? new Date(s.lastActiveAt).toLocaleString() : 'Unknown',
          createdAt: s.createdAt ? new Date(s.createdAt).toLocaleString() : 'Unknown',
          isCurrent: s.id === clerk.session?.id,
        }))
      );
    } catch {
      setSessions([]);
    } finally {
      setLoadingSessions(false);
    }
  }, [clerk]);

  useEffect(() => {
    if (activeSection === 'sessions') fetchSessions();
  }, [activeSection, fetchSessions]);

  const revokeSession = useCallback(async (sessionId: string) => {
    try {
      const sessionToRevoke = clerk.client?.sessions.find((s: any) => s.id === sessionId);
      if (sessionToRevoke) {
        await sessionToRevoke.end();
        toast({ title: 'Session revoked' });
        fetchSessions();
      }
    } catch (err: any) {
      toast({ title: 'Failed to revoke session', description: err?.message, variant: 'destructive' });
    }
  }, [clerk, fetchSessions]);

  /* ── Reset preferences ── */
  const handleResetPrefs = useCallback(() => {
    setNotifPrefs(DEFAULT_PREFS);
    savePrefsToStorage(DEFAULT_PREFS);
    setTheme('system');
    toast({ title: 'Preferences reset to defaults' });
  }, [setTheme]);

  /* ── Sign out ── */
  const handleSignOut = useCallback(async () => {
    try { await clerk.signOut(); } catch {}
    navigate('/');
  }, [clerk, navigate]);

  /* ── Reusable sub-components ── */
  const Label = ({ children }: { children: React.ReactNode }) => (
    <span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground mb-2">
      {children}
    </span>
  );

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${checked ? 'bg-foreground' : 'bg-muted'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-transform duration-200 ${
          checked ? 'translate-x-5 bg-background' : 'translate-x-0 bg-muted-foreground'
        }`}
      />
    </button>
  );

  const sectionTitles: Record<Section, string> = {
    profile: 'Profile',
    preferences: 'Preferences',
    sessions: 'Sessions',
  };

  /* ── Full page render (removed isLoaded blocker to prevent infinite loading) ── */

  return (
    <>
      {/* Crop Modal */}
      {cropImageSrc && (
        <CropModal
          imageSrc={cropImageSrc}
          onCancel={() => setCropImageSrc(null)}
          onConfirm={handleCroppedUpload}
        />
      )}

      <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
        {/* ═══ LEFT SIDEBAR ═══ */}
        <aside className="hidden md:flex flex-col w-60 border-r border-border bg-background shrink-0">
          <div className="flex items-center gap-3 px-5 py-6 border-b border-border">
            <div className="w-7 h-7 flex items-center justify-center bg-foreground text-background">
              <Logo className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-medium tracking-tight">QuantView</span>
              <span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                Settings
              </span>
            </div>
          </div>

          <nav className="flex-1 overflow-auto py-4">
            {NAV_SECTIONS.map((section) => (
              <div key={section.title} className="mb-4">
                <span className="block px-5 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground mb-2">
                  {section.title}
                </span>
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-5 py-2 text-sm transition-colors ${
                      activeSection === item.id
                        ? 'bg-muted border-l-2 border-foreground text-foreground font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border-l-2 border-transparent'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </div>
            ))}

            <div className="mb-4">
              <span className="block px-5 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground mb-2">
                System
              </span>
              <a
                href="/about"
                className="w-full flex items-center gap-3 px-5 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 border-l-2 border-transparent transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                Docs
              </a>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-5 py-2 text-sm transition-colors border-l-2 border-transparent"
                style={{ color: '#bb3333' }}
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </nav>
        </aside>

        {/* ═══ MAIN CONTENT ═══ */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="flex items-center justify-between px-6 py-3 border-b border-border shrink-0">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-xs font-medium">Back</span>
              </button>
              <div className="w-px h-4 bg-border" />
              <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                Settings{' '}
                <span className="text-foreground/30 mx-1">/</span>{' '}
                <span className="text-foreground">{sectionTitles[activeSection]}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
                <span className="font-mono text-[11px] text-muted-foreground">{email}</span>
              </span>
              <ThemeToggle />
            </div>
          </header>

          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-3xl space-y-6">

              {/* ═══════ PROFILE ═══════ */}
              {activeSection === 'profile' && (
                <div className="border border-border bg-card p-6 space-y-6">
                  <Label>Profile</Label>

                  <div className="flex items-start gap-5">
                    {/* Avatar with crop */}
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      <div
                        className="relative w-20 h-20 cursor-pointer group"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        {avatarUrl ? (
                          <img src={avatarUrl} alt={displayName} className="w-20 h-20 object-cover" />
                        ) : (
                          <div className="w-20 h-20 flex items-center justify-center bg-foreground text-background text-xl font-bold">
                            {initials}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          {uploadingAvatar ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Camera className="w-5 h-5 text-white" />
                          )}
                        </div>
                      </div>
                      <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">
                        Click to change
                      </span>
                      {avatarUrl && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleRemoveAvatar(); }}
                          disabled={uploadingAvatar}
                          className="font-mono text-[9px] uppercase tracking-wider hover:text-foreground transition-colors"
                          style={{ color: '#bb3333' }}
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="flex-1 space-y-4">
                      <div>
                        <Label>Display Name</Label>
                        <input
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-secondary border border-border text-foreground focus:border-foreground focus:outline-none transition-colors"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <input
                          type="email"
                          value={email}
                          readOnly
                          className="w-full px-3 py-2 text-sm bg-secondary border border-border text-muted-foreground cursor-not-allowed"
                        />
                        <span className="font-mono text-[9px] text-muted-foreground mt-1 block">
                          Managed by your authentication provider
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Organization</Label>
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-secondary border border-border text-foreground focus:border-foreground focus:outline-none transition-colors"
                      placeholder="Company or team name"
                    />
                  </div>

                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="w-full py-2.5 text-xs font-medium uppercase tracking-wider bg-foreground text-background hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="w-3 h-3 border-2 border-background border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              )}

              {/* ═══════ PREFERENCES ═══════ */}
              {activeSection === 'preferences' && (
                <>
                  <div className="border border-border bg-card p-6 space-y-4">
                    <Label>Theme</Label>
                    <div className="flex border border-border">
                      {[
                        { id: 'light' as const, label: 'Light', icon: Sun },
                        { id: 'dark' as const, label: 'Dark', icon: Moon },
                        { id: 'system' as const, label: 'System', icon: Monitor },
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => {
                            setTheme(t.id);
                            toast({ title: `Theme set to ${t.label}` });
                          }}
                          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-medium uppercase tracking-wider transition-all ${
                            theme === t.id
                              ? 'bg-foreground text-background border border-foreground'
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                          }`}
                        >
                          <t.icon className="w-3.5 h-3.5" />
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border border-border bg-card p-6 space-y-5">
                    <Label>Notifications</Label>
                    {([
                      { key: 'priceAlerts' as const, label: 'Price Alerts', sub: 'Notify on threshold breaks' },
                      { key: 'modelUpdates' as const, label: 'Model Updates', sub: 'New prediction runs' },
                      { key: 'marketOpenClose' as const, label: 'Market Open / Close', sub: 'US market hours' },
                      { key: 'emailDigest' as const, label: 'Email Digest', sub: 'Daily summary at 18:00 UTC' },
                    ]).map((n, i) => (
                      <div
                        key={n.key}
                        className={`flex items-center justify-between pb-4 ${i < 3 ? 'border-b border-border' : ''}`}
                      >
                        <div>
                          <span className="text-sm font-medium text-foreground">{n.label}</span>
                          <span className="block font-mono text-[10px] text-muted-foreground mt-0.5">{n.sub}</span>
                        </div>
                        <Toggle checked={notifPrefs[n.key]} onChange={(v) => updatePref(n.key, v)} />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* ═══════ SESSIONS ═══════ */}
              {activeSection === 'sessions' && (
                <>
                  <div className="border border-border bg-card p-6 space-y-0">
                    <div className="flex items-center justify-between mb-3">
                      <Label>Active Sessions</Label>
                      <button
                        onClick={fetchSessions}
                        className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Refresh
                      </button>
                    </div>
                    {loadingSessions ? (
                      <div className="py-8 flex justify-center">
                        <div className="w-5 h-5 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : sessions.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-4">No active sessions found.</p>
                    ) : (
                      sessions.map((s, i) => (
                        <div
                          key={s.id}
                          className={`flex items-center justify-between py-4 ${i < sessions.length - 1 ? 'border-b border-border' : ''}`}
                        >
                          <div>
                            <span className="text-sm font-medium text-foreground">
                              Session {s.id.slice(-6).toUpperCase()}
                            </span>
                            <span className="block font-mono text-[10px] text-muted-foreground mt-0.5">
                              Last active: {s.lastActiveAt} · Created: {s.createdAt}
                            </span>
                          </div>
                          {s.isCurrent ? (
                            <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider border border-foreground text-foreground">
                              Current
                            </span>
                          ) : (
                            <button
                              onClick={() => revokeSession(s.id)}
                              className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                            >
                              Revoke
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Danger Zone */}
                  <div className="space-y-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-px flex-1 bg-border" />
                      <span className="font-mono text-[9px] uppercase tracking-[0.16em]" style={{ color: '#bb3333' }}>
                        Danger Zone
                      </span>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                    <div
                      className="border p-6 space-y-4"
                      style={{ backgroundColor: 'hsl(0 30% 97%)', borderColor: 'hsl(0 20% 82%)' }}
                    >
                      <div
                        className="flex items-center justify-between pb-4 border-b"
                        style={{ borderColor: 'hsl(0 20% 82%)' }}
                      >
                        <div>
                          <span className="text-sm font-medium text-foreground">Reset Preferences</span>
                          <span className="block font-mono text-[10px] text-muted-foreground mt-0.5">
                            Reset theme and notification settings to defaults
                          </span>
                        </div>
                        <button
                          onClick={handleResetPrefs}
                          className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider border transition-colors"
                          style={{ color: '#bb3333', borderColor: 'hsl(0 20% 82%)' }}
                        >
                          Reset
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-foreground">Delete Account</span>
                          <span className="block font-mono text-[10px] text-muted-foreground mt-0.5">
                            Permanently delete your account and all data
                          </span>
                        </div>
                        <button
                          onClick={async () => {
                            if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                              try {
                                await user?.delete();
                                navigate('/');
                              } catch (err: any) {
                                toast({ title: 'Error', description: err?.message || 'Could not delete account.', variant: 'destructive' });
                              }
                            }
                          }}
                          className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider border transition-colors"
                          style={{ color: '#bb3333', borderColor: 'hsl(0 20% 82%)' }}
                        >
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

            </div>
          </div>
        </main>
      </div>
    </>
  );
}


import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Terminal,
  Layers,
  FolderArchive,
  ArrowLeft,
  Sliders,
  HelpCircle,
  Compass,
  Zap
} from 'lucide-react';
import { PlayerProfile, CaseData } from '../types/game';
import { sound } from '../audio/soundEngine';

interface DetectiveOfficeProps {
  profile: PlayerProfile;
  activeCase: CaseData | null;
  onOpenTerminal: () => void;
  onOpenBoard: () => void;
  onOpenFilingCabinet: () => void;
  onOpenCases: () => void;
  onOpenSettings: () => void;
  onReturnToMenu: () => void;
}

interface GameObject {
  id: string;
  name: string;
  actionName: string;
  x: number;
  y: number;
  width: number;
  height: number;
  interactRadius: number;
  icon: string;
}

export const DetectiveOffice: React.FC<DetectiveOfficeProps> = ({
  profile,
  activeCase,
  onOpenTerminal,
  onOpenBoard,
  onOpenFilingCabinet,
  onOpenCases,
  onOpenSettings,
  onReturnToMenu
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const playerRef = useRef({
    x: 400,
    y: 350,
    vx: 0,
    vy: 0,
    speed: 3.5,
    size: 24,
    direction: 'down' as 'up' | 'down' | 'left' | 'right',
    animFrame: 0,
    animTimer: 0
  });

  const keysPressed = useRef<{ [key: string]: boolean }>({});

  const [nearbyObject, setNearbyObject] = useState<GameObject | null>(null);
  const [coffeeDialog, setCoffeeDialog] = useState<string | null>(null);
  const [rainDrops, setRainDrops] = useState<
    { x: number; y: number; speed: number; len: number }[]
  >([]);

  // Interactive objects
  const objects = useMemo<GameObject[]>(() => [
    {
      id: 'terminal',
      name: 'CRT Computer Terminal',
      actionName: 'Access Debugger & Case Files',
      x: 340,
      y: 160,
      width: 120,
      height: 70,
      interactRadius: 85,
      icon: 'terminal'
    },
    {
      id: 'board',
      name: 'Investigation Corkboard',
      actionName: 'Inspect Clues & Yarn Network',
      x: 100,
      y: 80,
      width: 140,
      height: 60,
      interactRadius: 85,
      icon: 'layers'
    },
    {
      id: 'cabinet',
      name: 'Archive Filing Cabinet',
      actionName: 'Review Solved Cases & Badges',
      x: 620,
      y: 90,
      width: 60,
      height: 90,
      interactRadius: 85,
      icon: 'folder'
    },
    {
      id: 'coffee',
      name: 'Espresso Coffee Machine',
      actionName: 'Brew Midnight Roast',
      x: 710,
      y: 330,
      width: 50,
      height: 50,
      interactRadius: 75,
      icon: 'coffee'
    }
  ], []);

  // Furniture collision boundaries
  const colliders = useMemo(() => [
    { x: 330, y: 150, w: 140, h: 80 },
    { x: 90, y: 70, w: 160, h: 50 },
    { x: 610, y: 80, w: 80, h: 100 },
    { x: 700, y: 320, w: 70, h: 70 },
    { x: 40, y: 220, w: 50, h: 160 },
    { x: 700, y: 220, w: 50, h: 60 }
  ], []);

  // Generate window rain
  useEffect(() => {
    const drops = [];

    for (let i = 0; i < 55; i++) {
      drops.push({
        x: Math.random() * 110 + 480,
        y: Math.random() * 50 + 28,
        speed: 1.5 + Math.random() * 3,
        len: 4 + Math.random() * 7
      });
    }

    setRainDrops(drops);
  }, []);

  // Interactions
  const triggerInteraction = () => {
    if (!nearbyObject) return;

    sound.playConfirm();

    switch (nearbyObject.id) {
      case 'terminal':
        onOpenTerminal();
        break;

      case 'board':
        onOpenBoard();
        break;

      case 'cabinet':
        onOpenFilingCabinet();
        break;

      case 'coffee':
        sound.playCoffee();

        setCoffeeDialog(
          'You sip a steaming cup of midnight roast coffee. Logic power +100%!'
        );

        setTimeout(() => setCoffeeDialog(null), 4000);
        break;
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (
        ['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)
      ) {
        e.preventDefault();
      }

      keysPressed.current[key] = true;

      if (key === 'e' || key === ' ') {
        triggerInteraction();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    const handleBlur = () => {
      keysPressed.current = {};
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  });

  // Main game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let stepSoundTimer = 0;

    const checkCollision = (nx: number, ny: number, r: number) => {
      const minX = 70;
      const maxX = 730;
      const minY = 140;
      const maxY = 480;

      if (
        nx - r < minX ||
        nx + r > maxX ||
        ny - r < minY ||
        ny + r > maxY
      ) {
        return true;
      }

      for (const col of colliders) {
        if (
          nx + r > col.x &&
          nx - r < col.x + col.w &&
          ny + r > col.y &&
          ny - r < col.y + col.h
        ) {
          return true;
        }
      }

      return false;
    };

    const drawGlow = (
      x: number,
      y: number,
      radius: number,
      color: string
    ) => {
      const gradient = ctx.createRadialGradient(
        x, y, 2, x, y, radius
      );

      gradient.addColorStop(0, color);
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const render = () => {
      const p = playerRef.current;

      // Movement input
      let dx = 0;
      let dy = 0;

      const keys = keysPressed.current;

      if (keys['w'] || keys['arrowup']) dy -= 1;
      if (keys['s'] || keys['arrowdown']) dy += 1;
      if (keys['a'] || keys['arrowleft']) dx -= 1;
      if (keys['d'] || keys['arrowright']) dx += 1;

      if (dx !== 0 && dy !== 0) {
        dx *= 0.7071;
        dy *= 0.7071;
      }

      const isMoving = dx !== 0 || dy !== 0;

      if (isMoving) {
        if (Math.abs(dx) > Math.abs(dy)) {
          p.direction = dx > 0 ? 'right' : 'left';
        } else {
          p.direction = dy > 0 ? 'down' : 'up';
        }

        const nextX = p.x + dx * p.speed;

        if (!checkCollision(nextX, p.y, p.size / 2)) {
          p.x = nextX;
        }

        const nextY = p.y + dy * p.speed;

        if (!checkCollision(p.x, nextY, p.size / 2)) {
          p.y = nextY;
        }

        p.animTimer++;

        if (p.animTimer % 8 === 0) {
          p.animFrame = (p.animFrame + 1) % 4;
        }

        stepSoundTimer++;

        if (stepSoundTimer % 18 === 0) {
          sound.playHover();
        }
      } else {
        p.animFrame = 0;
      }

      // Find nearby interactive object
      let foundNear: GameObject | null = null;

      for (const obj of objects) {
        const cx = obj.x + obj.width / 2;
        const cy = obj.y + obj.height / 2;

        const dist = Math.hypot(p.x - cx, p.y - cy);

        if (dist <= obj.interactRadius) {
          foundNear = obj;
          break;
        }
      }

      setNearbyObject((previous) =>
        previous?.id === foundNear?.id ? previous : foundNear
      );

      // Draw canvas
      ctx.save();

      // Enlarge the entire original office drawing by 20%
      ctx.setTransform(1.2, 0, 0, 1.2, 0, 0);

      // Background
      ctx.fillStyle = '#080c10';
      ctx.fillRect(0, 0, 800, 520);

      // Floor
      ctx.fillStyle = '#172129';
      ctx.fillRect(50, 60, 700, 440);

      // Floor lighting
      drawGlow(400, 270, 360, 'rgba(0, 255, 157, 0.035)');

      // Floor planks
      ctx.strokeStyle = '#202d37';
      ctx.lineWidth = 1;

      for (let y = 60; y < 500; y += 24) {
        ctx.beginPath();
        ctx.moveTo(50, y);
        ctx.lineTo(750, y);
        ctx.stroke();
      }

      for (let x = 80; x < 750; x += 90) {
        ctx.beginPath();
        ctx.moveTo(x, 90);
        ctx.lineTo(x, 490);
        ctx.stroke();
      }

      // Floor rug
      ctx.fillStyle = '#291923';
      ctx.fillRect(290, 200, 220, 160);

      ctx.strokeStyle = '#8b333d';
      ctx.lineWidth = 4;
      ctx.strokeRect(290, 200, 220, 160);

      ctx.strokeStyle = '#c18a43';
      ctx.lineWidth = 1;
      ctx.strokeRect(298, 208, 204, 144);

      // Walls
      ctx.fillStyle = '#101923';
      ctx.fillRect(50, 20, 700, 70);

      ctx.fillStyle = '#253341';
      ctx.fillRect(50, 85, 700, 6);

      ctx.fillStyle = '#0b121a';
      ctx.fillRect(30, 20, 30, 480);
      ctx.fillRect(740, 20, 30, 480);
      ctx.fillRect(30, 490, 740, 30);

      // Wall lighting
      drawGlow(400, 100, 250, 'rgba(0, 255, 157, 0.025)');

      // Rainy window
      ctx.fillStyle = '#071018';
      ctx.fillRect(480, 25, 110, 55);

      ctx.strokeStyle = '#526477';
      ctx.lineWidth = 3;
      ctx.strokeRect(480, 25, 110, 55);

      const windowGrad = ctx.createLinearGradient(480, 25, 480, 80);

      windowGrad.addColorStop(0, 'rgba(6, 182, 212, 0.35)');
      windowGrad.addColorStop(1, 'rgba(236, 72, 153, 0.22)');

      ctx.fillStyle = windowGrad;
      ctx.fillRect(482, 27, 106, 51);

      // City lights
      ctx.fillStyle = 'rgba(0, 255, 157, 0.55)';
      ctx.fillRect(490, 45, 5, 5);
      ctx.fillRect(510, 55, 8, 3);
      ctx.fillRect(540, 40, 5, 5);

      ctx.fillStyle = 'rgba(236, 72, 153, 0.6)';
      ctx.fillRect(560, 60, 7, 4);
      ctx.fillRect(525, 32, 4, 5);

      // Animated rain
      ctx.strokeStyle = 'rgba(186, 220, 235, 0.65)';
      ctx.lineWidth = 1.5;

      rainDrops.forEach((d) => {
        d.y += d.speed;

        if (d.y > 75) d.y = 28;

        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 2, d.y + d.len);
        ctx.stroke();
      });

      // Window blinds
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.8)';
      ctx.lineWidth = 2;

      for (let wy = 32; wy < 78; wy += 8) {
        ctx.beginPath();
        ctx.moveTo(482, wy);
        ctx.lineTo(588, wy);
        ctx.stroke();
      }

      // Corkboard frame
      ctx.fillStyle = '#422414';
      ctx.fillRect(90, 70, 160, 50);

      ctx.fillStyle = '#a16207';
      ctx.fillRect(94, 73, 152, 39);

      ctx.strokeStyle = '#c28b44';
      ctx.lineWidth = 2;
      ctx.strokeRect(94, 73, 152, 39);

      // Corkboard notes
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(100, 78, 16, 14);

      ctx.fillStyle = '#bfdbfe';
      ctx.fillRect(125, 82, 18, 16);

      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(155, 76, 15, 18);

      ctx.fillStyle = '#f87171';
      ctx.fillRect(180, 80, 16, 16);

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(210, 78, 22, 18);

      // Evidence strings
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(108, 85);
      ctx.lineTo(134, 90);
      ctx.lineTo(188, 88);
      ctx.lineTo(221, 87);
      ctx.stroke();

      // Filing cabinet
      ctx.fillStyle = '#263849';
      ctx.fillRect(620, 80, 60, 95);

      ctx.fillStyle = '#34495d';
      ctx.fillRect(623, 83, 54, 89);

      ctx.strokeStyle = '#101a25';
      ctx.lineWidth = 2;
      ctx.strokeRect(620, 80, 60, 95);

      for (let d = 0; d < 3; d++) {
        const drawerY = 85 + d * 30;

        ctx.fillStyle = '#1c2937';
        ctx.fillRect(624, drawerY, 52, 26);

        ctx.strokeStyle = '#526477';
        ctx.strokeRect(624, drawerY, 52, 26);

        ctx.fillStyle = '#d6a34b';
        ctx.fillRect(645, drawerY + 11, 10, 4);
      }

      // Main desk
      ctx.fillStyle = '#321d15';
      ctx.fillRect(330, 150, 140, 80);

      ctx.fillStyle = '#54301d';
      ctx.fillRect(334, 154, 132, 72);

      ctx.strokeStyle = '#21110b';
      ctx.lineWidth = 3;
      ctx.strokeRect(330, 150, 140, 80);

      // Wood detailing
      ctx.strokeStyle = 'rgba(218, 157, 91, 0.25)';
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.moveTo(340, 185);
      ctx.lineTo(460, 185);
      ctx.moveTo(340, 210);
      ctx.lineTo(460, 210);
      ctx.stroke();

      // Desk pad
      ctx.fillStyle = '#064e3b';
      ctx.fillRect(350, 165, 100, 55);

      ctx.strokeStyle = '#0f766e';
      ctx.strokeRect(350, 165, 100, 55);

      // CRT monitor
      ctx.fillStyle = '#172b32';
      ctx.fillRect(375, 155, 50, 36);

      ctx.fillStyle = '#022c22';
      ctx.fillRect(379, 158, 42, 28);

      drawGlow(400, 172, 45, 'rgba(0, 255, 157, 0.2)');

      ctx.fillStyle = '#00ff9d';
      ctx.fillRect(382, 162, 14, 2);
      ctx.fillRect(382, 167, 24, 2);
      ctx.fillRect(382, 172, 18, 2);
      ctx.fillRect(382, 177, 8, 2);

      // Monitor stand
      ctx.fillStyle = '#253b43';
      ctx.fillRect(394, 191, 12, 5);
      ctx.fillRect(388, 195, 24, 3);

      // Banker's lamp
      ctx.fillStyle = '#047857';
      ctx.fillRect(338, 160, 16, 8);

      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(344, 168, 4, 8);

      drawGlow(346, 168, 48, 'rgba(0, 255, 157, 0.18)');

      // Desk papers
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(435, 185, 14, 18);

      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(432, 165, 8, 8);

      // Bookshelf
      ctx.fillStyle = '#24150f';
      ctx.fillRect(40, 220, 45, 160);

      ctx.strokeStyle = '#0f0907';
      ctx.strokeRect(40, 220, 45, 160);

      const bookColors = [
        '#dc2626',
        '#2563eb',
        '#16a34a',
        '#d97706',
        '#9333ea',
        '#0284c7'
      ];

      for (let s = 0; s < 4; s++) {
        const sy = 230 + s * 38;

        for (let b = 0; b < 5; b++) {
          ctx.fillStyle = bookColors[(s + b) % bookColors.length];
          ctx.fillRect(44 + b * 7, sy, 6, 26);

          ctx.fillStyle = 'rgba(255,255,255,0.15)';
          ctx.fillRect(45 + b * 7, sy + 3, 1, 18);
        }
      }

      // Coffee counter
      ctx.fillStyle = '#263849';
      ctx.fillRect(700, 320, 65, 60);

      ctx.fillStyle = '#34495d';
      ctx.fillRect(703, 323, 59, 54);

      // Espresso machine
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(712, 324, 34, 32);

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(716, 332, 26, 16);

      ctx.fillStyle = '#ef4444';
      ctx.fillRect(738, 326, 4, 4);

      // Coffee machine glow
      drawGlow(730, 340, 35, 'rgba(0, 255, 157, 0.09)');

      // Coffee steam
      const steamY = 310 + Math.sin(Date.now() / 250) * 4;

      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(725, 324);
      ctx.quadraticCurveTo(720, steamY, 726, steamY - 10);
      ctx.stroke();

      // Interactive markers
      objects.forEach((obj) => {
        const cx = obj.x + obj.width / 2;
        const cy = obj.y + obj.height / 2;

        const pulse = Math.sin(Date.now() / 300) * 4;
        const isNearby = obj.id === nearbyObject?.id;

        drawGlow(
          cx,
          cy,
          isNearby ? 34 : 24,
          isNearby
            ? 'rgba(0,255,157,0.18)'
            : 'rgba(0,255,157,0.06)'
        );

        ctx.strokeStyle = isNearby
          ? '#00ff9d'
          : 'rgba(0,255,157,0.5)';

        ctx.lineWidth = isNearby ? 2 : 1.5;

        ctx.beginPath();
        ctx.arc(cx, cy, 18 + pulse, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = isNearby
          ? '#00ff9d'
          : 'rgba(0,255,157,0.85)';

        ctx.font = '13px "VT323", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('[E]', cx, cy + 4);
      });

      // Detective character
      const px = p.x;
      const py = p.y;

      // Character glow
      drawGlow(px, py, 90, 'rgba(0,255,157,0.12)');

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.beginPath();
      ctx.ellipse(px, py + 14, 12, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Trenchcoat
      ctx.fillStyle = '#78350f';
      ctx.fillRect(px - 9, py - 4, 18, 16);

      ctx.fillStyle = '#92400e';
      ctx.fillRect(px - 7, py - 2, 14, 10);

      // Belt
      ctx.fillStyle = '#451a03';
      ctx.fillRect(px - 9, py + 4, 18, 3);

      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(px - 2, py + 4, 4, 3);

      // Legs
      ctx.fillStyle = '#1e293b';

      if (isMoving && (p.animFrame === 1 || p.animFrame === 3)) {
        const offset = p.animFrame === 1 ? 4 : -4;

        ctx.fillRect(px - 7 + offset, py + 12, 5, 8);
        ctx.fillRect(px + 2 - offset, py + 12, 5, 8);
      } else {
        ctx.fillRect(px - 7, py + 12, 5, 8);
        ctx.fillRect(px + 2, py + 12, 5, 8);
      }

      // Head
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(px - 6, py - 14, 12, 10);

      // Fedora
      ctx.fillStyle = '#451a03';
      ctx.fillRect(px - 8, py - 20, 16, 7);
      ctx.fillRect(px - 12, py - 14, 24, 3);

      ctx.fillStyle = '#b45309';
      ctx.fillRect(px - 8, py - 16, 16, 2);

      // Eyes
      ctx.fillStyle = '#00ff9d';

      if (p.direction === 'right') {
        ctx.fillRect(px + 2, py - 10, 2, 2);
      } else if (p.direction === 'left') {
        ctx.fillRect(px - 4, py - 10, 2, 2);
      } else if (p.direction === 'down') {
        ctx.fillRect(px - 3, py - 10, 2, 2);
        ctx.fillRect(px + 2, py - 10, 2, 2);
      }

      // Subtle screen vignette
      const vignette = ctx.createRadialGradient(
        400, 260, 180,
        400, 260, 490
      );

      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(1, 'rgba(0,0,0,0.42)');

      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, 800, 520);

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [colliders, objects, rainDrops, nearbyObject]);

  // Mobile controls
  const handleDirectionPress = (dir: string, isDown: boolean) => {
    keysPressed.current[dir] = isDown;
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden select-none bg-slate-950">

      {/* TOP HUD */}
      <div className="w-full flex items-center justify-between gap-3 px-5 py-4 bg-slate-900/95 border-b border-emerald-900/40 z-20 backdrop-blur-md shadow-lg">

        {/* Detective information */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              sound.playBack();
              onReturnToMenu();
            }}
            onMouseEnter={() => sound.playHover()}
            className="btn-pixel btn-secondary py-2 px-4 text-sm flex items-center gap-2"
            title="Return to Main Menu"
          >
            <ArrowLeft className="w-4 h-4" />
            MENU
          </button>

          <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-slate-700">
            <div className="flex flex-col">
              <span className="font-terminal text-xl text-emerald-400">
                {profile.name}
              </span>
              <span className="text-xs text-slate-500 font-terminal">
                DETECTIVE
              </span>
            </div>

            <span className="text-sm font-pixel px-3 py-1 bg-slate-800 text-slate-300 border border-slate-700">
              {profile.rank}
            </span>
          </div>
        </div>

        {/* Active mission */}
        <div className="flex-1 flex justify-center min-w-0">
          {activeCase ? (
            <div
              onClick={onOpenCases}
              className="flex items-center gap-3 px-4 py-2 bg-amber-950/40 border border-amber-500/50 text-amber-300 text-sm font-pixel cursor-pointer hover:bg-amber-900/40 transition-colors shadow-[0_0_15px_rgba(245,158,11,0.08)] max-w-full"
            >
              <Zap className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
              <span className="truncate">
                ACTIVE: {activeCase.number} — {activeCase.title}
              </span>
            </div>
          ) : (
            <div
              onClick={onOpenCases}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 text-slate-400 text-sm font-pixel cursor-pointer hover:border-emerald-500 hover:text-emerald-400"
            >
              <Compass className="w-4 h-4" />
              SELECT CASE
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-2 shrink-0">

          <button
            onClick={() => {
              sound.playClick();
              onOpenTerminal();
            }}
            onMouseEnter={() => sound.playHover()}
            className="btn-pixel py-2 px-4 text-sm hidden md:flex items-center gap-2"
            title="Open Computer Terminal"
          >
            <Terminal className="w-4 h-4" />
            TERMINAL
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenBoard();
            }}
            onMouseEnter={() => sound.playHover()}
            className="btn-pixel btn-secondary py-2 px-4 text-sm hidden md:flex items-center gap-2"
            title="Open Investigation Board"
          >
            <Layers className="w-4 h-4 text-amber-400" />
            BOARD
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenFilingCabinet();
            }}
            onMouseEnter={() => sound.playHover()}
            className="btn-pixel btn-secondary py-2 px-4 text-sm hidden md:flex items-center gap-2"
            title="Open Filing Cabinet"
          >
            <FolderArchive className="w-4 h-4 text-cyan-400" />
            ARCHIVE
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenSettings();
            }}
            onMouseEnter={() => sound.playHover()}
            className="btn-pixel btn-secondary py-2 px-3 text-sm"
            title="Settings"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MAIN OFFICE */}
      <div className="relative flex-1 flex items-center justify-center p-4 bg-slate-950 overflow-hidden">

        {/* Ambient background lighting */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,255,157,0.045),transparent_65%)]" />

        <canvas
          ref={canvasRef}
          width={960}
          height={624}
          className="border-2 border-slate-700 shadow-[0_0_65px_rgba(0,255,157,0.12)] max-w-full max-h-full object-contain"
          style={{ imageRendering: 'pixelated' }}
        />

        {/* Interaction tooltip */}
        {nearbyObject && (
          <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-30 animate-bounce">
            <button
              onClick={triggerInteraction}
              className="btn-pixel py-3 px-7 text-sm flex items-center gap-3 bg-slate-900 border-2 border-emerald-400 text-emerald-400 shadow-[0_0_25px_rgba(0,255,157,0.35)]"
            >
              <span className="px-2 py-1 bg-emerald-400 text-black font-pixel text-sm">
                [E]
              </span>

              <span>
                {nearbyObject.name.toUpperCase()} — {nearbyObject.actionName}
              </span>
            </button>
          </div>
        )}

        {/* Coffee popup */}
        {coffeeDialog && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 max-w-md w-11/12 bg-slate-900 border-2 border-amber-500 p-5 text-center font-terminal text-xl text-amber-300 shadow-[0_0_30px_rgba(245,158,11,0.25)]">
            {coffeeDialog}
          </div>
        )}

        {/* Controls panel */}
        <div className="hidden lg:flex absolute bottom-5 left-5 z-20 flex-col gap-2 p-4 bg-slate-900/95 border border-emerald-900/50 text-slate-300 font-terminal text-base shadow-[0_0_25px_rgba(0,0,0,0.5)] pointer-events-none">

          <div className="flex items-center gap-2 text-emerald-400 font-pixel text-sm mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>OFFICE CONTROLS</span>
          </div>

          <div>W, A, S, D or ARROWS: Move Detective</div>
          <div>E or SPACE: Interact with Object</div>
        </div>

        {/* Mobile controls */}
        <div className="flex lg:hidden absolute bottom-4 right-4 z-20 flex-col items-center gap-1 select-none opacity-90">

          <button
            onPointerDown={() => handleDirectionPress('arrowup', true)}
            onPointerUp={() => handleDirectionPress('arrowup', false)}
            onPointerLeave={() => handleDirectionPress('arrowup', false)}
            className="w-12 h-12 bg-slate-800 border border-slate-600 text-slate-200 font-pixel text-sm flex items-center justify-center active:bg-emerald-500 active:text-black"
          >
            ▲
          </button>

          <div className="flex gap-1">
            <button
              onPointerDown={() => handleDirectionPress('arrowleft', true)}
              onPointerUp={() => handleDirectionPress('arrowleft', false)}
              onPointerLeave={() => handleDirectionPress('arrowleft', false)}
              className="w-12 h-12 bg-slate-800 border border-slate-600 text-slate-200 font-pixel text-sm flex items-center justify-center active:bg-emerald-500 active:text-black"
            >
              ◀
            </button>

            <button
              onPointerDown={() => handleDirectionPress('arrowdown', true)}
              onPointerUp={() => handleDirectionPress('arrowdown', false)}
              onPointerLeave={() => handleDirectionPress('arrowdown', false)}
              className="w-12 h-12 bg-slate-800 border border-slate-600 text-slate-200 font-pixel text-sm flex items-center justify-center active:bg-emerald-500 active:text-black"
            >
              ▼
            </button>

            <button
              onPointerDown={() => handleDirectionPress('arrowright', true)}
              onPointerUp={() => handleDirectionPress('arrowright', false)}
              onPointerLeave={() => handleDirectionPress('arrowright', false)}
              className="w-12 h-12 bg-slate-800 border border-slate-600 text-slate-200 font-pixel text-sm flex items-center justify-center active:bg-emerald-500 active:text-black"
            >
              ▶
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

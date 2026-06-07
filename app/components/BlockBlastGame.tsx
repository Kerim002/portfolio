"use client";
import { useEffect, useRef, useState, useCallback } from "react";

const COLS = 10;
const ROWS = 10;

const COLORS = [
  "#6c5ce7", "#fd79a8", "#00cec9", "#fdcb6e",
  "#a29bfe", "#55efc4", "#ff7675", "#74b9ff",
];

const SHAPE_DEFS = [
  [[1,1,1]],
  [[1],[1],[1]],
  [[1,1],[1,1]],
  [[1,1,0],[0,1,1]],
  [[0,1,1],[1,1,0]],
  [[1,1,1],[0,1,0]],
  [[1,0],[1,0],[1,1]],
  [[0,1],[0,1],[1,1]],
  [[1,1,1,1]],
  [[1],[1],[1],[1]],
  [[1,0],[1,1]],
  [[0,1],[1,1]],
  [[1,1],[1,0]],
  [[1,1],[0,1]],
  [[1,0,0],[1,1,1]],
  [[0,0,1],[1,1,1]],
  [[1,1,1],[1,0,0]],
  [[1,1,1],[0,0,1]],
  [[1,1,0],[0,1,0],[0,1,1]],
  [[1,0],[1,1],[0,1]],
];

type Grid = (string | 0)[][];
type ShapeDef = number[][];

interface Shape {
  id: number;
  def: ShapeDef;
  color: string;
  placed: boolean;
}

// Cells that will flash after clearing
interface ClearAnim {
  cells: { r: number; c: number; color: string }[];
  t: number;
}

function makeGrid(): Grid {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

function randomShape(id: number): Shape {
  const def = SHAPE_DEFS[Math.floor(Math.random() * SHAPE_DEFS.length)];
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  return { id, def, color, placed: false };
}

function canPlace(grid: Grid, def: ShapeDef, gr: number, gc: number): boolean {
  for (let r = 0; r < def.length; r++) {
    for (let c = 0; c < (def[r]?.length ?? 0); c++) {
      if (!def[r][c]) continue;
      const nr = gr + r, nc = gc + c;
      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) return false;
      if (grid[nr][nc]) return false;
    }
  }
  return true;
}

const TRAY_CELL = 30;
const TRAY_PAD  = 4;

function drawShapeToCtx(
  ctx: CanvasRenderingContext2D,
  def: ShapeDef,
  color: string,
  cs: number,
  pad: number,
  alpha = 1,
) {
  ctx.globalAlpha = alpha;
  def.forEach((row, r) =>
    row.forEach((cell, col) => {
      if (!cell) return;
      const x = pad + col * cs;
      const y = pad + r * cs;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(x + 2, y + 2, cs - 4, cs - 4, 4);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.18)";
      ctx.beginPath();
      ctx.roundRect(x + 2, y + 2, cs - 4, (cs - 4) * 0.38, 2);
      ctx.fill();
    })
  );
  ctx.globalAlpha = 1;
}

export default function BlockBlastGame() {
  const containerRef   = useRef<HTMLDivElement>(null);
  const canvasRef      = useRef<HTMLCanvasElement>(null);
  const trayRefs       = useRef<(HTMLCanvasElement | null)[]>([]);
  const floatCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [score, setScore]           = useState(0);
  const [gameOver, setGameOver]     = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const gridRef      = useRef<Grid>(makeGrid());
  const shapesRef    = useRef<Shape[]>([]);
  const cellRef      = useRef(38);
  const padRef       = useRef(3);
  const ghostRef     = useRef<[number, number, string][]>([]);
  const dragRef      = useRef<{ slotIndex: number; cursorX: number; cursorY: number } | null>(null);
  const scoreRef     = useRef(0);
  const gameOverRef  = useRef(false);
  const animFrameRef = useRef<number>(0);
  const clearAnimRef = useRef<ClearAnim | null>(null);
  const dragCleanupsRef = useRef<(() => void)[]>([]);

  // ─── Draw main grid ───────────────────────────────────────────────────────
  const drawMainCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const CELL = cellRef.current;
    const PAD  = padRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0f0f1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const flashAnim = clearAnimRef.current;
    const flashAmt  = flashAnim ? flashAnim.t / 10 : 0;

    // Draw normal cells
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const x    = c * CELL;
        const y    = r * CELL;
        const cell = gridRef.current[r][c];

        if (cell) {
          ctx.globalAlpha = 1;
          ctx.fillStyle   = cell as string;
          ctx.beginPath();
          ctx.roundRect(x + PAD, y + PAD, CELL - PAD * 2, CELL - PAD * 2, 4);
          ctx.fill();
          ctx.fillStyle = "rgba(255,255,255,0.14)";
          ctx.beginPath();
          ctx.roundRect(x + PAD, y + PAD, CELL - PAD * 2, (CELL - PAD * 2) * 0.38, 2);
          ctx.fill();
        } else {
          ctx.strokeStyle = "rgba(255,255,255,0.05)";
          ctx.lineWidth   = 1;
          ctx.beginPath();
          ctx.roundRect(x + PAD, y + PAD, CELL - PAD * 2, CELL - PAD * 2, 3);
          ctx.stroke();
        }
      }
    }

    // Flash overlay (cells already removed from grid)
    if (flashAnim && flashAmt > 0) {
      flashAnim.cells.forEach(({ r, c, color }) => {
        const x = c * CELL;
        const y = r * CELL;
        ctx.globalAlpha = 1 - flashAmt;
        ctx.fillStyle   = "#ffffff";
        ctx.beginPath();
        ctx.roundRect(x + PAD, y + PAD, CELL - PAD * 2, CELL - PAD * 2, 4);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    }

    // Ghost
    if (!gameOverRef.current) {
      ghostRef.current.forEach(([gr, gc, color]) => {
        ctx.globalAlpha = 0.38;
        ctx.fillStyle   = color;
        ctx.beginPath();
        ctx.roundRect(gc * CELL + PAD, gr * CELL + PAD, CELL - PAD * 2, CELL - PAD * 2, 4);
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    }
  }, []);

  // ─── Floating piece canvas ────────────────────────────────────────────────
  const drawFloatCanvas = useCallback(() => {
    const fc = floatCanvasRef.current;
    if (!fc) return;
    const ctx = fc.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, fc.width, fc.height);
    const drag = dragRef.current;
    if (!drag) return;

    const shape = shapesRef.current[drag.slotIndex];
    if (!shape) return;

    const CELL = cellRef.current;
    const PAD  = padRef.current;
    const rows = shape.def.length;
    const cols = Math.max(...shape.def.map(r => r.length));
    const offX = drag.cursorX - (cols * CELL) / 2;
    const offY = drag.cursorY - (rows * CELL) / 2;

    shape.def.forEach((row, r) =>
      row.forEach((cell, c) => {
        if (!cell) return;
        const x = offX + c * CELL;
        const y = offY + r * CELL;
        ctx.globalAlpha = 0.92;
        ctx.fillStyle   = shape.color;
        ctx.beginPath();
        ctx.roundRect(x + PAD, y + PAD, CELL - PAD * 2, CELL - PAD * 2, 4);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.18)";
        ctx.beginPath();
        ctx.roundRect(x + PAD, y + PAD, CELL - PAD * 2, (CELL - PAD * 2) * 0.38, 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      })
    );
  }, []);

  // ─── Tray drawing ─────────────────────────────────────────────────────────
  const drawTrayShape = useCallback((sc: HTMLCanvasElement, shape: Shape, dim: boolean) => {
    const rows = shape.def.length;
    const cols = Math.max(...shape.def.map(r => r.length));
    sc.width        = cols * TRAY_CELL + TRAY_PAD * 2;
    sc.height       = rows * TRAY_CELL + TRAY_PAD * 2;
    sc.style.width  = sc.width  + "px";
    sc.style.height = sc.height + "px";
    const c = sc.getContext("2d");
    if (!c) return;
    c.clearRect(0, 0, sc.width, sc.height);
    drawShapeToCtx(c, shape.def, shape.color, TRAY_CELL, TRAY_PAD, dim ? 0.18 : 1);
  }, []);

  const redrawTray = useCallback(() => {
    shapesRef.current.forEach((s, i) => {
      const sc = trayRefs.current[i];
      if (sc) drawTrayShape(sc, s, s.placed);
    });
  }, [drawTrayShape]);

  // ─── Ghost helper ─────────────────────────────────────────────────────────
  const getGhostAnchor = useCallback((shape: Shape, clientX: number, clientY: number): [number, number] => {
    const canvas = canvasRef.current;
    if (!canvas) return [0, 0];
    const rect = canvas.getBoundingClientRect();
    const CELL = cellRef.current;
    const rows = shape.def.length;
    const cols = Math.max(...shape.def.map(r => r.length));
    const cx = clientX - rect.left;
    const cy = clientY - rect.top;
    return [
      Math.round(cy / CELL - rows / 2),
      Math.round(cx / CELL - cols / 2),
    ];
  }, []);

  // ─── Game logic ───────────────────────────────────────────────────────────
  const checkGameOver = useCallback(() => {
    const active = shapesRef.current.filter(s => !s.placed);
    if (active.length === 0) return;
    const any = active.some(s => {
      for (let r = 0; r < ROWS; r++)
        for (let c = 0; c < COLS; c++)
          if (canPlace(gridRef.current, s.def, r, c)) return true;
      return false;
    });
    if (!any) {
      gameOverRef.current = true;
      setGameOver(true);
      setFinalScore(scoreRef.current);
    }
  }, []);

  // ⚡ KEY FIX: instantly clear rows/cols, only flash visually
  const clearLines = useCallback(() => {
    const rowsToClear: number[] = [];
    const colsToClear: number[] = [];
    for (let r = 0; r < ROWS; r++)
      if (gridRef.current[r].every(c => c !== 0)) rowsToClear.push(r);
    for (let c = 0; c < COLS; c++)
      if (gridRef.current.every(r => r[c] !== 0)) colsToClear.push(c);
    if (!rowsToClear.length && !colsToClear.length) return;

    // Collect all cells that will be cleared (deduplicated)
    const cellSet = new Set<string>();
    const clearCells: { r: number; c: number; color: string }[] = [];
    rowsToClear.forEach(r => {
      for (let c = 0; c < COLS; c++) {
        const key = `${r},${c}`;
        if (!cellSet.has(key)) {
          cellSet.add(key);
          clearCells.push({ r, c, color: gridRef.current[r][c] as string });
        }
      }
    });
    colsToClear.forEach(c => {
      for (let r = 0; r < ROWS; r++) {
        const key = `${r},${c}`;
        if (!cellSet.has(key)) {
          cellSet.add(key);
          clearCells.push({ r, c, color: gridRef.current[r][c] as string });
        }
      }
    });

    // ✅ Clear the grid instantly
    rowsToClear.forEach(r => { gridRef.current[r] = Array(COLS).fill(0); });
    colsToClear.forEach(c => { for (let r2 = 0; r2 < ROWS; r2++) gridRef.current[r2][c] = 0; });

    const cleared = rowsToClear.length + colsToClear.length;
    scoreRef.current += cleared === 1 ? 100 : cleared === 2 ? 300 : cleared * 200;
    setScore(scoreRef.current);

    // Start a purely visual flash animation
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    clearAnimRef.current = { cells: clearCells, t: 0 };

    const tick = () => {
      if (!clearAnimRef.current) return;
      clearAnimRef.current.t += 1;
      if (clearAnimRef.current.t >= 10) {
        clearAnimRef.current = null;
        drawMainCanvas();
        return;
      }
      drawMainCanvas();
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
  }, [drawMainCanvas]);

  // Forward-declared via ref so setupDrag can call it without circular dep
  const wireDragListenersRef = useRef<() => void>(() => {});

  const placeShape = useCallback((slotIndex: number, gr: number, gc: number) => {
    const shape = shapesRef.current[slotIndex];
    if (!shape || shape.placed) return;

    shape.def.forEach((row, r) =>
      row.forEach((cell, c) => {
        if (cell) gridRef.current[gr + r][gc + c] = shape.color;
      })
    );
    shape.placed = true;
    clearLines(); // instant clear + visual flash

    const allPlaced = shapesRef.current.every(s => s.placed);
    if (allPlaced) {
      // ✅ Spawn fresh shapes
      shapesRef.current = [randomShape(0), randomShape(1), randomShape(2)];
      redrawTray();
      // ✅ Re-wire drag listeners so new pieces are interactive
      wireDragListenersRef.current();
    } else {
      redrawTray();
    }

    // Game over check happens AFTER grid is already cleaned
    checkGameOver();
    drawMainCanvas();
  }, [clearLines, checkGameOver, drawMainCanvas, redrawTray]);

  // ─── Drag wiring ─────────────────────────────────────────────────────────
  const wireDragListeners = useCallback(() => {
    // Tear down previous listeners
    dragCleanupsRef.current.forEach(fn => fn());
    dragCleanupsRef.current = [];

    [0, 1, 2].forEach(slotIndex => {
      const sc = trayRefs.current[slotIndex];
      if (!sc) return;

      const shape = shapesRef.current[slotIndex];
      if (shape) drawTrayShape(sc, shape, shape.placed);

      const updateGhost = (clientX: number, clientY: number) => {
        const s = shapesRef.current[slotIndex];
        if (!s) return;
        const [gr, gc] = getGhostAnchor(s, clientX, clientY);
        ghostRef.current = [];
        if (canPlace(gridRef.current, s.def, gr, gc)) {
          s.def.forEach((row, r) =>
            row.forEach((cell, c) => {
              if (cell) ghostRef.current.push([gr + r, gc + c, s.color]);
            })
          );
        }
      };

      const onStart = (e: MouseEvent | TouchEvent) => {
        const s = shapesRef.current[slotIndex];
        if (!s || s.placed || gameOverRef.current) return;
        e.preventDefault();
        const pt = (e as TouchEvent).touches ? (e as TouchEvent).touches[0] : (e as MouseEvent);
        dragRef.current = { slotIndex, cursorX: pt.clientX, cursorY: pt.clientY };
        drawTrayShape(sc, s, true); // dim while dragging
        const fc = floatCanvasRef.current;
        if (fc) {
          fc.width = window.innerWidth;
          fc.height = window.innerHeight;
        }
        updateGhost(pt.clientX, pt.clientY);
        drawMainCanvas();
        drawFloatCanvas();
      };

      const onMove = (e: MouseEvent | TouchEvent) => {
        if (!dragRef.current || dragRef.current.slotIndex !== slotIndex) return;
        e.preventDefault();
        const pt = (e as TouchEvent).touches ? (e as TouchEvent).touches[0] : (e as MouseEvent);
        dragRef.current.cursorX = pt.clientX;
        dragRef.current.cursorY = pt.clientY;
        updateGhost(pt.clientX, pt.clientY);
        drawMainCanvas();
        drawFloatCanvas();
      };

      const onEnd = (e: MouseEvent | TouchEvent) => {
        if (!dragRef.current || dragRef.current.slotIndex !== slotIndex) return;
        e.preventDefault();
        const s = shapesRef.current[slotIndex];
        const pt = (e as TouchEvent).changedTouches
          ? (e as TouchEvent).changedTouches[0]
          : (e as MouseEvent);

        if (s && !s.placed) {
          const [gr, gc] = getGhostAnchor(s, pt.clientX, pt.clientY);
          if (canPlace(gridRef.current, s.def, gr, gc)) {
            placeShape(slotIndex, gr, gc);
          } else {
            drawTrayShape(sc, s, false); // restore opacity on failed drop
          }
        }

        ghostRef.current = [];
        dragRef.current  = null;
        const fc = floatCanvasRef.current;
        if (fc) fc.getContext("2d")?.clearRect(0, 0, fc.width, fc.height);
        drawMainCanvas();
      };

      sc.addEventListener("mousedown",  onStart);
      sc.addEventListener("touchstart", onStart, { passive: false });
      window.addEventListener("mousemove",  onMove);
      window.addEventListener("touchmove",  onMove, { passive: false });
      window.addEventListener("mouseup",    onEnd);
      window.addEventListener("touchend",   onEnd);

      dragCleanupsRef.current.push(() => {
        sc.removeEventListener("mousedown",  onStart);
        sc.removeEventListener("touchstart", onStart);
        window.removeEventListener("mousemove",  onMove);
        window.removeEventListener("touchmove",  onMove);
        window.removeEventListener("mouseup",    onEnd);
        window.removeEventListener("touchend",   onEnd);
      });
    });
  }, [drawTrayShape, getGhostAnchor, drawMainCanvas, drawFloatCanvas, placeShape]);

  // Keep the ref in sync
  useEffect(() => {
    wireDragListenersRef.current = wireDragListeners;
  }, [wireDragListeners]);

  // ─── Resize ───────────────────────────────────────────────────────────────
  const resizeCanvas = useCallback(() => {
    const wrap   = containerRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const avail = wrap.getBoundingClientRect().width;
    const CELL  = Math.max(26, Math.floor(avail / COLS));
    cellRef.current = CELL;
    padRef.current  = Math.max(2, Math.floor(CELL * 0.07));
    canvas.width        = CELL * COLS;
    canvas.height       = CELL * ROWS;
    canvas.style.width  = CELL * COLS + "px";
    canvas.style.height = CELL * ROWS + "px";
    drawMainCanvas();
  }, [drawMainCanvas]);

  // ─── Init ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fc = document.createElement("canvas");
    fc.style.cssText = "position:fixed;top:0;left:0;pointer-events:none;z-index:9999;";
    fc.width  = window.innerWidth;
    fc.height = window.innerHeight;
    document.body.appendChild(fc);
    floatCanvasRef.current = fc;

    gridRef.current     = makeGrid();
    scoreRef.current    = 0;
    gameOverRef.current = false;
    shapesRef.current   = [randomShape(0), randomShape(1), randomShape(2)];

    resizeCanvas();
    drawMainCanvas();
    wireDragListeners(); // initial wiring

    const onResize = () => {
      resizeCanvas();
      fc.width  = window.innerWidth;
      fc.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      dragCleanupsRef.current.forEach(fn => fn());
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (document.body.contains(fc)) document.body.removeChild(fc);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-wire after game-over is cleared (restart)
  useEffect(() => {
    if (!gameOver) wireDragListeners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver]);

  // ─── Restart ──────────────────────────────────────────────────────────────
  const restart = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    clearAnimRef.current = null;
    gridRef.current      = makeGrid();
    scoreRef.current     = 0;
    gameOverRef.current  = false;
    ghostRef.current     = [];
    dragRef.current      = null;
    shapesRef.current    = [randomShape(0), randomShape(1), randomShape(2)];
    setScore(0);
    setGameOver(false); // triggers the effect above which re-wires
    setFinalScore(0);
    resizeCanvas();
    drawMainCanvas();
  }, [resizeCanvas, drawMainCanvas]);

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div ref={containerRef} style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text2)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          ⬛ Block Blast
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "1.2rem", color: "var(--accent)", fontWeight: 700 }}>
          {score.toLocaleString()}
        </span>
      </div>

      <div style={{
        position: "relative", display: "block", borderRadius: 10, overflow: "hidden",
        boxShadow: "0 0 30px rgba(108,92,231,0.2), inset 0 0 60px rgba(0,0,0,0.6)",
        border: "1px solid var(--border2)", lineHeight: 0,
      }}>
        <canvas ref={canvasRef} style={{ display: "block", touchAction: "none" }} />

        {gameOver && (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: "1rem",
            backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
            background: "rgba(8,8,16,0.82)", borderRadius: 10,
          }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "1.1rem", color: "var(--accent2)", letterSpacing: "0.12em", fontWeight: 700 }}>
              GAME OVER
            </p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text2)" }}>
              Score: {finalScore.toLocaleString()}
            </p>
            <button
              onClick={restart}
              style={{
                fontFamily: "var(--font-mono)", fontSize: "0.8rem",
                background: "var(--accent)", color: "#fff",
                border: "none", padding: "0.6rem 1.5rem",
                borderRadius: 5, cursor: "pointer", letterSpacing: "0.05em", fontWeight: 700,
              }}
            >
              ↺ Restart
            </button>
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        <p style={{
          fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--text3)",
          letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "center",
        }}>
          Drag pieces onto the grid
        </p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          {[0, 1, 2].map(i => (
            <canvas
              key={i}
              ref={el => { trayRefs.current[i] = el; }}
              style={{
                display: "block", touchAction: "none", cursor: "grab",
                borderRadius: 6, border: "1px solid var(--border)",
                background: "var(--bg3)", userSelect: "none",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
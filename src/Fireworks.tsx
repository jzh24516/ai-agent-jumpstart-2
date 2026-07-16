import { useEffect, useRef } from 'react'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
}

type Rocket = {
  x: number
  y: number
  vy: number
  targetY: number
  color: string
  exploded: boolean
}

const COLORS = [
  '#ff5252', '#ffb142', '#ffd32a', '#7bed9f', '#70a1ff',
  '#a29bfe', '#ff6b81', '#e84393', '#00d2d3', '#fffa65',
]

const rand = (min: number, max: number) => min + Math.random() * (max - min)
const pick = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)]

// A self-contained canvas fireworks overlay. Every time `trigger` increases,
// it launches a fresh celebratory burst and animates until all particles fade.
export default function Fireworks({ trigger }: { trigger: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const rocketsRef = useRef<Rocket[]>([])
  const rafRef = useRef<number | null>(null)
  const runningRef = useRef(false)

  useEffect(() => {
    if (trigger <= 0) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const w = () => window.innerWidth
    const h = () => window.innerHeight

    const explode = (x: number, y: number, color: string) => {
      const count = Math.floor(rand(38, 60))
      const baseSpeed = rand(2.6, 4.4)
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + rand(-0.08, 0.08)
        const speed = baseSpeed * rand(0.5, 1.1)
        const maxLife = rand(55, 85)
        particlesRef.current.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: maxLife,
          maxLife,
          color: Math.random() < 0.2 ? '#ffffff' : color,
          size: rand(1.5, 3),
        })
      }
    }

    const launch = (count: number) => {
      for (let i = 0; i < count; i++) {
        const x = rand(w() * 0.15, w() * 0.85)
        rocketsRef.current.push({
          x,
          y: h(),
          vy: rand(-11, -8.5),
          targetY: rand(h() * 0.12, h() * 0.42),
          color: pick(COLORS),
          exploded: false,
        })
      }
    }

    // Stagger a few volleys for a fuller, more impressive celebration.
    launch(3)
    const t1 = window.setTimeout(() => launch(3), 260)
    const t2 = window.setTimeout(() => launch(4), 620)

    window.addEventListener('resize', resize)

    const gravity = 0.045

    const tick = () => {
      // Fade only the previously drawn particles (not the page) for glowing trails.
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = 'rgba(0, 0, 0, 0.22)'
      ctx.fillRect(0, 0, w(), h())
      ctx.globalCompositeOperation = 'lighter'

      const rockets = rocketsRef.current
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i]
        r.y += r.vy
        ctx.beginPath()
        ctx.arc(r.x, r.y, 2.4, 0, Math.PI * 2)
        ctx.fillStyle = r.color
        ctx.fill()
        if (r.y <= r.targetY) {
          explode(r.x, r.y, r.color)
          rockets.splice(i, 1)
        }
      }

      const particles = particlesRef.current
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.vx *= 0.985
        p.vy = p.vy * 0.985 + gravity
        p.x += p.vx
        p.y += p.vy
        p.life -= 1
        if (p.life <= 0) {
          particles.splice(i, 1)
          continue
        }
        const alpha = Math.max(0, p.life / p.maxLife)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = alpha
        ctx.fill()
        ctx.globalAlpha = 1
      }

      if (particles.length || rockets.length) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        // Clear the canvas and stop.
        ctx.globalCompositeOperation = 'source-over'
        ctx.clearRect(0, 0, w(), h())
        runningRef.current = false
        rafRef.current = null
      }
    }

    if (!runningRef.current) {
      runningRef.current = true
      rafRef.current = requestAnimationFrame(tick)
    }

    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.removeEventListener('resize', resize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      runningRef.current = false
      particlesRef.current = []
      rocketsRef.current = []
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    }
  }, [trigger])

  return <canvas ref={canvasRef} className="fireworks-canvas" aria-hidden="true" />
}

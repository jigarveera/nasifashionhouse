import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import fashionModel from '../../assets/model/fashion-icon.png';

const PETAL_COLORS = ['#dfa9f0', '#eccdf7', '#ce7be5', '#f5eef8', '#bb58d8'];

export default function QuoteSection() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!section || !canvas || !context) return undefined;

    let width = 0;
    let height = 0;
    let frame = 0;
    let started = false;
    let finished = false;
    let startTime = 0;
    let previousTime = 0;
    let petals = [];
    let seed = 4187;
    const random = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };

    function sizeCanvas() {
      const previousWidth = width;
      const previousHeight = height;
      const bounds = section.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      if (previousWidth && previousHeight) {
        petals.forEach((petal) => {
          petal.x *= width / previousWidth;
          petal.y *= height / previousHeight;
          petal.ground *= height / previousHeight;
        });
      }
      draw();
    }

    function drawPetal(petal) {
      context.save();
      context.translate(petal.x, petal.y);
      context.rotate(petal.angle);
      context.scale(.72 + Math.sin(petal.age * 7 + petal.phase) * .28, 1);
      context.fillStyle = PETAL_COLORS[petal.color];
      context.globalAlpha = petal.opacity;
      context.beginPath();
      context.moveTo(0, -petal.size);
      context.bezierCurveTo(petal.size, -petal.size * .55, petal.size * .9, petal.size * .55, 0, petal.size);
      context.bezierCurveTo(-petal.size * .9, petal.size * .55, -petal.size, -petal.size * .55, 0, -petal.size);
      context.fill();
      context.strokeStyle = 'rgba(108,48,122,.28)';
      context.lineWidth = .6;
      context.beginPath();
      context.moveTo(0, -petal.size * .7);
      context.lineTo(0, petal.size * .7);
      context.stroke();
      context.restore();
    }

    function draw() {
      context.clearRect(0, 0, width, height);
      petals.forEach((petal) => {
        if (petal.visible) drawPetal(petal);
      });
    }

    function tick(time) {
      if (!startTime) startTime = time;
      const elapsed = (time - startTime) / 1000;
      const dt = Math.min((time - (previousTime || time)) / 1000, .035);
      previousTime = time;

      petals.forEach((petal) => {
        if (elapsed < petal.delay) return;
        petal.visible = true;
        if (petal.resting) return;

        // Gravity, air drag, shifting wind, and an inelastic floor collision.
        petal.age += dt;
        petal.vy += (160 - petal.vy * .8 + Math.sin(elapsed * 2.3 + petal.phase) * 22) * dt;
        petal.vx += (Math.sin(elapsed * 2.7 + petal.phase) * 72 - petal.vx * 1.1) * dt;
        petal.x += petal.vx * dt;
        if (petal.x < petal.size || petal.x > width - petal.size) {
          petal.x = Math.max(petal.size, Math.min(width - petal.size, petal.x));
          petal.vx *= -.35;
        }
        petal.y += petal.vy * dt;
        petal.angle += (petal.spin + Math.sin(petal.age * 5 + petal.phase) * .7) * dt;

        if (petal.y >= petal.ground) {
          petal.y = petal.ground;
          petal.vx *= .52;
          petal.spin *= .68;
          if (petal.vy > 22) petal.vy *= -.18;
          else { petal.vy = 0; petal.resting = true; }
        }
      });

      if (elapsed >= 5.7) {
        petals.forEach((petal) => { petal.visible = true; petal.y = petal.ground; petal.resting = true; });
        finished = true;
        draw();
        return;
      }
      draw();
      frame = window.requestAnimationFrame(tick);
    }

    function start() {
      if (started || !width || !height) return;
      started = true;
      petals = Array.from({ length: 108 }, (_, index) => {
        const size = 3.5 + random() * 4.5;
        const ground = height * (.87 + random() * .1) - size;
        return {
          x: width * (.025 + random() * .95), y: reducedMotion ? ground : -size - random() * 65,
          ground, vx: (random() - .5) * 30, vy: random() * 15,
          angle: random() * Math.PI * 2, spin: (random() - .5) * 5,
          phase: random() * Math.PI * 2, age: 0, delay: random() * 2.15,
          size, color: index % PETAL_COLORS.length, opacity: .67 + random() * .3,
          visible: Boolean(reducedMotion), resting: Boolean(reducedMotion),
        };
      });
      if (reducedMotion) { finished = true; draw(); }
      else frame = window.requestAnimationFrame(tick);
    }

    sizeCanvas();
    const resizeObserver = new ResizeObserver(sizeCanvas);
    resizeObserver.observe(section);
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) { start(); observer.disconnect(); }
    }, { threshold: .4 });
    observer.observe(section);

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      if (!finished) window.cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} className="home-quote" aria-labelledby="home-quote-heading">
      <div className="home-quote-composition">
        <img className="home-quote-model" src={fashionModel} alt="Woman in a floral blouse and plum skirt" loading="lazy" />
        <div className="home-quote-type"><h2 id="home-quote-heading" className="home-quote-text"><span>STYLE</span><span>WITHOUT</span><span>COMPROMISE</span></h2></div>
      </div>
      <canvas ref={canvasRef} className="home-quote-petals" aria-hidden="true" />
    </section>
  );
}

"use client";

import React, { useRef, useEffect } from 'react';

// Types for component props
export interface HeroProps {
  trustBadge?: {
    text: string;
    icon?: React.ReactNode;
  };
  headline: {
    line1: string;
    line2: string;
  };
  subtitle: string;
  buttons?: {
    primary?: {
      text: string;
      onClick?: () => void;
      icon?: React.ReactNode;
    };
    secondary?: {
      text: string;
      onClick?: () => void;
      icon?: React.ReactNode;
    };
  };
  className?: string;
  children?: React.ReactNode; // For mockups or other elements
}

// Slightly darker clouds to match the style of Devpluse
const defaultShaderSource = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)
float rnd(vec2 p) {
  p=fract(p*vec2(12.9898,78.233));
  p+=dot(p,p+34.56);
  return fract(p.x*p.y);
}
float noise(in vec2 p) {
  vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);
  float a=rnd(i), b=rnd(i+vec2(1,0)), c=rnd(i+vec2(0,1)), d=rnd(i+1.);
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}
float fbm(vec2 p) {
  float t=.0, a=1.; mat2 m=mat2(1.,-.5,.2,1.2);
  for (int i=0; i<5; i++) {
    t+=a*noise(p);
    p*=2.*m;
    a*=.5;
  }
  return t;
}
float clouds(vec2 p) {
	float d=1., t=.0;
	for (float i=.0; i<3.; i++) {
		float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);
		t=mix(t,d,a);
		d=a;
		p*=2./(i+1.);
	}
	return t;
}
void main(void) {
	vec2 uv=(FC-.5*R)/MN,st=uv*vec2(2,1);
	vec3 col=vec3(0);
	float bg=clouds(vec2(st.x+T*.5,-st.y));
	uv*=1.-.3*(sin(T*.2)*.5+.5);
	for (float i=1.; i<12.; i++) {
		uv+=.1*cos(i*vec2(.1+.01*i, .8)+i*i+T*.5+.1*uv.x);
		vec2 p=uv;
		float d=length(p);
		// Changed colors to match primary/cyan theme instead of random colors
		col+=.00125/d*(cos(sin(i)*vec3(0.5, 0.8, 1.0))+1.);
		float b=noise(i+p+bg*1.731);
		col+=.002*b/length(max(p,vec2(b*p.x*.02,p.y)));
		col=mix(col,vec3(bg*.15,bg*.2,bg*.3),d); // dark bluish tint
	}
	O=vec4(col,1);
}`;

// Reusable Shader Background Hook
const useShaderBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(null);
  const rendererRef = useRef<any>(null);
  const pointersRef = useRef<any>(null);

  // WebGL Renderer class
  class WebGLRenderer {
    private canvas: HTMLCanvasElement;
    private gl: WebGL2RenderingContext;
    private program: WebGLProgram | null = null;
    private vs: WebGLShader | null = null;
    private fs: WebGLShader | null = null;
    private buffer: WebGLBuffer | null = null;
    private scale: number;
    private shaderSource: string;
    private mouseMove: [number, number] = [0, 0];
    private mouseCoords: [number, number] = [0, 0];
    private pointerCoords: number[] = [0, 0];
    private nbrOfPointers = 0;

    private vertexSrc = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;

    private vertices = [-1, 1, -1, -1, 1, 1, 1, -1];

    constructor(canvas: HTMLCanvasElement, scale: number) {
      this.canvas = canvas;
      this.scale = scale;
      this.gl = canvas.getContext('webgl2')!;
      this.gl.viewport(0, 0, canvas.width * scale, canvas.height * scale);
      this.shaderSource = defaultShaderSource;
    }

    updateShader(source: string) {
      this.reset();
      this.shaderSource = source;
      this.setup();
      this.init();
    }

    updateMove(deltas: [number, number]) {
      this.mouseMove = deltas;
    }

    updateMouse(coords: [number, number]) {
      this.mouseCoords = coords;
    }

    updatePointerCoords(coords: number[]) {
      this.pointerCoords = coords || [0, 0];
    }

    updatePointerCount(nbr: number) {
      this.nbrOfPointers = nbr;
    }

    updateScale(scale: number) {
      this.scale = scale;
      this.gl.viewport(0, 0, this.canvas.width * scale, this.canvas.height * scale);
    }

    compile(shader: WebGLShader, source: string) {
      const gl = this.gl;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const error = gl.getShaderInfoLog(shader);
        console.error('Shader compilation error:', error);
      }
    }

    test(source: string) {
      let result = null;
      const gl = this.gl;
      const shader = gl.createShader(gl.FRAGMENT_SHADER)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        result = gl.getShaderInfoLog(shader);
      }
      gl.deleteShader(shader);
      return result;
    }

    reset() {
      const gl = this.gl;
      if (this.program && !gl.getProgramParameter(this.program, gl.DELETE_STATUS)) {
        if (this.vs) {
          gl.detachShader(this.program, this.vs);
          gl.deleteShader(this.vs);
        }
        if (this.fs) {
          gl.detachShader(this.program, this.fs);
          gl.deleteShader(this.fs);
        }
        gl.deleteProgram(this.program);
      }
    }

    setup() {
      const gl = this.gl;
      this.vs = gl.createShader(gl.VERTEX_SHADER)!;
      this.fs = gl.createShader(gl.FRAGMENT_SHADER)!;
      this.compile(this.vs, this.vertexSrc);
      this.compile(this.fs, this.shaderSource);
      this.program = gl.createProgram()!;
      gl.attachShader(this.program, this.vs);
      gl.attachShader(this.program, this.fs);
      gl.linkProgram(this.program);

      if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(this.program));
      }
    }

    init() {
      const gl = this.gl;
      const program = this.program!;

      this.buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

      const position = gl.getAttribLocation(program, 'position');
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

      (program as any).resolution = gl.getUniformLocation(program, 'resolution');
      (program as any).time = gl.getUniformLocation(program, 'time');
      (program as any).move = gl.getUniformLocation(program, 'move');
      (program as any).touch = gl.getUniformLocation(program, 'touch');
      (program as any).pointerCount = gl.getUniformLocation(program, 'pointerCount');
      (program as any).pointers = gl.getUniformLocation(program, 'pointers');
    }

    render(now = 0) {
      const gl = this.gl;
      const program = this.program;

      if (!program || gl.getProgramParameter(program, gl.DELETE_STATUS)) return;

      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

      gl.uniform2f((program as any).resolution, this.canvas.width, this.canvas.height);
      gl.uniform1f((program as any).time, now * 1e-3);
      gl.uniform2f((program as any).move, this.mouseMove[0], this.mouseMove[1]);
      gl.uniform2f((program as any).touch, this.mouseCoords[0], this.mouseCoords[1]);
      gl.uniform1i((program as any).pointerCount, this.nbrOfPointers);
      gl.uniform2fv((program as any).pointers, this.pointerCoords);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  }

  // Pointer Handler class
  class PointerHandler {
    private scale: number;
    private active = false;
    private pointers = new Map<number, [number, number]>();
    private lastCoords: [number, number] = [0, 0];
    private moves: [number, number] = [0, 0];

    constructor(element: HTMLCanvasElement, scale: number) {
      this.scale = scale;

      const map = (element: HTMLCanvasElement, scale: number, x: number, y: number): [number, number] =>
        [x * scale, element.height - y * scale];

      element.addEventListener('pointerdown', (e) => {
        this.active = true;
        this.pointers.set(e.pointerId, map(element, this.getScale(), e.clientX, e.clientY));
      });

      element.addEventListener('pointerup', (e) => {
        if (this.count === 1) {
          this.lastCoords = this.first;
        }
        this.pointers.delete(e.pointerId);
        this.active = this.pointers.size > 0;
      });

      element.addEventListener('pointerleave', (e) => {
        if (this.count === 1) {
          this.lastCoords = this.first;
        }
        this.pointers.delete(e.pointerId);
        this.active = this.pointers.size > 0;
      });

      element.addEventListener('pointermove', (e) => {
        if (!this.active) return;
        this.lastCoords = [e.clientX, e.clientY];
        this.pointers.set(e.pointerId, map(element, this.getScale(), e.clientX, e.clientY));
        this.moves = [this.moves[0] + e.movementX, this.moves[1] + e.movementY];
      });
    }

    getScale() {
      return this.scale;
    }

    updateScale(scale: number) {
      this.scale = scale;
    }

    get count() {
      return this.pointers.size;
    }

    get move() {
      return this.moves;
    }

    get coords() {
      return this.pointers.size > 0
        ? Array.from(this.pointers.values()).flat()
        : [0, 0];
    }

    get first(): [number, number] {
      return this.pointers.values().next().value || this.lastCoords;
    }
  }

  const resize = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const dpr = Math.max(1, 0.5 * window.devicePixelRatio);

    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    if (rendererRef.current) {
      rendererRef.current.updateScale(dpr);
    }
  };

  const loop = (now: number) => {
    if (!rendererRef.current || !pointersRef.current) return;

    rendererRef.current.updateMouse(pointersRef.current.first);
    rendererRef.current.updatePointerCount(pointersRef.current.count);
    rendererRef.current.updatePointerCoords(pointersRef.current.coords);
    rendererRef.current.updateMove(pointersRef.current.move);
    rendererRef.current.render(now);
    animationFrameRef.current = requestAnimationFrame(loop) as any;
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const dpr = Math.max(1, 0.5 * window.devicePixelRatio);

    rendererRef.current = new WebGLRenderer(canvas, dpr);
    pointersRef.current = new PointerHandler(canvas, dpr);

    rendererRef.current.setup();
    rendererRef.current.init();

    resize();

    if (rendererRef.current.test(defaultShaderSource) === null) {
      rendererRef.current.updateShader(defaultShaderSource);
    }

    loop(0);

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.reset();
      }
    };
  }, []);

  return canvasRef;
};

// Reusable Hero Component
const Hero: React.FC<HeroProps> = ({
  trustBadge,
  headline,
  subtitle,
  buttons,
  className = "",
  children
}) => {
  const canvasRef = useShaderBackground();

  return (
    <div className={`relative w-full min-h-screen overflow-hidden bg-slate-950 ${className}`}>
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.8s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; opacity: 0; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-800 { animation-delay: 0.8s; }
      `}} />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-contain touch-none"
        style={{ background: 'transparent' }}
      />

      {/* Hero Content Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white pt-20 pb-10">

        {/* Trust Badge */}
        {trustBadge && (
          <div className="mb-8 animate-fade-in-down">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 w-fit">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                {trustBadge.icon && (
                  <span className="text-primary flex items-center justify-center">
                    {trustBadge.icon}
                  </span>
                )}
                {trustBadge.text}
              </span>
            </div>
          </div>
        )}

        <div className="text-center space-y-6 max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left Column Text */}
          <div className="flex flex-col gap-8 text-left">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-white animate-fade-in-up animation-delay-200">
                {headline.line1} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">
                  {headline.line2}
                </span>
              </h1>
            </div>

            {/* Subtitle with Animation */}
            <div className="max-w-xl animate-fade-in-up animation-delay-400">
              <p className="text-lg lg:text-xl text-slate-400 leading-relaxed">
                {subtitle}
              </p>
            </div>

            {/* CTA Buttons with Animation */}
            {buttons && (
              <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in-up animation-delay-600">
                {buttons.primary && (
                  <button
                    onClick={buttons.primary.onClick}
                    className="bg-primary hover:bg-primary/90 text-white text-lg font-bold px-8 py-6 rounded-xl hover:shadow-[0_0_30px_rgba(91,43,238,0.5)] transition-all flex items-center justify-center gap-2"
                  >
                    {buttons.primary.text}
                    {buttons.primary.icon}
                  </button>
                )}
                {buttons.secondary && (
                  <button
                    onClick={buttons.secondary.onClick}
                    className="glass-card bg-transparent text-lg font-bold px-8 py-6 rounded-xl hover:bg-white/5 transition-all flex items-center justify-center gap-2 border border-white/10 text-white backdrop-blur-sm"
                  >
                    {buttons.secondary.text}
                    {buttons.secondary.icon}
                  </button>
                )}
              </div>
            )}

            <div className="flex items-center gap-6 pt-4 text-slate-500 animate-fade-in-up animation-delay-800">
              <div className="flex -space-x-3">
                <img alt="Avatar 1" className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0bI43DQu8tHDoEPHxnwlXnkjqqHFUlKfC5iO6nruKz-o2lari0Yrsdvw0-6Ho-SUFZ0A8CEh94WbJFEfMjWvaLPdk0oXj34l9Jb6bVm2jgGmsGpgdME0ZsQicZZqVWrcbIYP6iNp-dNLhhqHayjPISnDTuESVmtVNqhrVC9lkQdJoIeYFVBF9oxOixcUBvU4uJGAChq-B6lo5j-rF6j7KbweQrot9ZaRul1Qw_OGhe7iEqnNdjTB6maPpiqHZfog7iXlR5YWpeqw" />
                <img alt="Avatar 2" className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlR7yiLjqdqEhDhV4Pn8G9WQh1RfsoASNFKVlCTzrryizdHm0rDqSuTJH2k-hx2ROUBeCvdmcxtx2OopqgOcF4_tzCAdyikfQm9FLZyue0ZWeIkSLQMyywe1801MCDIcbqP1c41r2ELxUO--owPftvWYeTIIxxHbo0y3dOEwqQ_UnhZkiHLGCqaSQCxEa21OIRqxbn0sEwwjXIxaC5YaTNGRnOXqZxGJhMHjZbumx_WVMKtc_dhi7UMSRTs4pvrbrqDnPcWHwvVfM" />
                <img alt="Avatar 3" className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBT2f_FKiKB4hfTQXpV4HyBFbot2ecesXee9cOoVtgAZNbExpqKr4hemkDhuUiCkk3-fcGSazZg8Wmg5nicCNb-Qy0pYaJVTusbb4V48XcGWhXzqb3LKaUWVc7v57d4e-CCzKML8QXT8uz_NQX5any0Q0qOakBl5sBTubswhIxTi3j_43x72eN7aHwq6174CCz7tL31hnqKIVNaO3Tlm87MKSwzlceX837jSfnZ_E6GhcRX2k5fiVDPtU_NkkwGEcxfmX4lqGUNy7k" />
              </div>
              <p className="text-sm italic">Trusted by 500+ engineering leads</p>
            </div>
          </div>

          {/* Right Column Content / Mockup */}
          <div className="animate-fade-in-up animation-delay-600">
            {children}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;

"use client";
import { TimelineContent } from "@/components/ui/timeline-animation";
import Image from "next/image";
import { useRef } from "react";

function ClientFeedback() {
    const testimonialRef = useRef<HTMLDivElement>(null);

    const revealVariants = {
        visible: (i: number) => ({
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            transition: {
                delay: i * 0.4,
                duration: 0.5,
            },
        }),
        hidden: {
            filter: "blur(10px)",
            y: -20,
            opacity: 0,
        },
    };

    return (
        <main className="w-full bg-slate-950 py-32 px-6 relative z-10">
            <section className="relative h-full max-w-7xl mx-auto rounded-lg" ref={testimonialRef}>
                <article className="max-w-screen-md mx-auto text-center space-y-4 mb-16">
                    <TimelineContent as="h2" className="text-4xl font-bold tracking-tight text-white" animationNum={0} customVariants={revealVariants} timelineRef={testimonialRef}>
                        Trusted by Engineering Leaders
                    </TimelineContent>
                    <TimelineContent as="p" className="text-slate-500 max-w-2xl mx-auto" animationNum={1} customVariants={revealVariants} timelineRef={testimonialRef}>
                        See how top teams are transforming their development culture with DevPulse.
                    </TimelineContent>
                </article>

                <div className="lg:grid lg:grid-cols-3 gap-6 flex flex-col w-full px-4">
                    <div className="md:flex lg:flex-col lg:space-y-6 h-full lg:gap-0 gap-6">
                        <TimelineContent animationNum={0} customVariants={revealVariants} timelineRef={testimonialRef} className="lg:flex-[7] flex-[6] flex flex-col justify-between relative bg-primary overflow-hidden rounded-2xl border border-white/10 p-8 shadow-xl">
                            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:50px_56px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] z-0"></div>
                            <article className="mt-auto relative z-10 text-white">
                                <p className="text-lg leading-relaxed font-medium mb-8">
                                    "DevPulse gave us the 'calm' we were missing. No more hunting for metrics across 50 repos; the AI just tells us where we need to focus each morning."
                                </p>
                                <div className="flex items-center gap-4 pt-4 border-t border-white/20">
                                    <Image
                                        src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&auto=format&fit=crop"
                                        alt="Marcus Thorne"
                                        width={200}
                                        height={200}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                                    />
                                    <div>
                                        <h2 className="font-bold text-lg">Marcus Thorne</h2>
                                        <p className="text-sm text-cyan-200">VP Engineering, StellarScale</p>
                                    </div>
                                </div>
                            </article>
                        </TimelineContent>
                        <TimelineContent animationNum={1} customVariants={revealVariants} timelineRef={testimonialRef} className="lg:flex-[3] flex-[4] lg:h-fit lg:shrink-0 flex flex-col justify-between relative bg-slate-900 border border-white/5 rounded-2xl p-8 shadow-xl">
                            <article className="mt-auto text-slate-300">
                                <p className="leading-relaxed mb-6">
                                    "The AI insights are scary accurate. It spots bottlenecks in PR reviews before they become an issue."
                                </p>
                                <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                                    <Image
                                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop"
                                        alt="Sarah Jenkins"
                                        width={200}
                                        height={200}
                                        className="w-12 h-12 rounded-full object-cover border border-white/10 grayscale hover:grayscale-0 transition-all"
                                    />
                                    <div>
                                        <h2 className="font-bold text-white">Sarah Jenkins</h2>
                                        <p className="text-sm text-slate-500">Director of Engineering, Nexus</p>
                                    </div>
                                </div>
                            </article>
                        </TimelineContent>
                    </div>

                    <div className="lg:h-full md:flex lg:flex-col h-fit lg:space-y-6 lg:gap-0 gap-6">
                        <TimelineContent animationNum={2} customVariants={revealVariants} timelineRef={testimonialRef} className="flex flex-col justify-between relative bg-slate-900 overflow-hidden rounded-2xl border border-white/5 p-8 shadow-xl">
                            <article className="mt-auto text-slate-300">
                                <p className="text-base leading-relaxed mb-6">
                                    "The Repo Health Score changed how we prioritize technical debt. It's no longer a guessing game; it's a data-backed roadmap that everyone trusts."
                                </p>
                                <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                                    <Image
                                        src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=256&auto=format&fit=crop"
                                        alt="Elena Rodriguez"
                                        width={200}
                                        height={200}
                                        className="w-12 h-12 rounded-full object-cover border border-white/10 grayscale hover:grayscale-0 transition-all"
                                    />
                                    <div>
                                        <h2 className="font-bold text-lg text-white">Elena Rodriguez</h2>
                                        <p className="text-sm text-slate-500">Engineering Manager, CloudFlow</p>
                                    </div>
                                </div>
                            </article>
                        </TimelineContent>
                        <TimelineContent animationNum={3} customVariants={revealVariants} timelineRef={testimonialRef} className="flex flex-col justify-between relative bg-slate-900 border border-white/5 rounded-2xl p-8 shadow-xl">
                            <article className="mt-auto text-slate-300">
                                <p className="text-base leading-relaxed mb-6">
                                    "Integrating DevPulse with our GitHub and Slack workflow was seamless. The Weekly AI Reports have reduced our sync meeting time by nearly 30%."
                                </p>
                                <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                                    <Image
                                        src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=256&auto=format&fit=crop"
                                        alt="David Chen"
                                        width={200}
                                        height={200}
                                        className="w-12 h-12 rounded-full object-cover border border-white/10 grayscale hover:grayscale-0 transition-all"
                                    />
                                    <div>
                                        <h2 className="font-bold text-lg text-white">David Chen</h2>
                                        <p className="text-sm text-slate-500">CTO, PulsePay</p>
                                    </div>
                                </div>
                            </article>
                        </TimelineContent>
                        <TimelineContent animationNum={4} customVariants={revealVariants} timelineRef={testimonialRef} className="flex flex-col justify-between relative bg-slate-900 border border-white/5 rounded-2xl p-8 shadow-xl">
                            <article className="mt-auto text-slate-300">
                                <p className="text-base leading-relaxed mb-6">
                                    "It finally gives non-technical founders an objective way to see what the engineering team is actually accomplishing every week."
                                </p>
                                <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                                    <Image
                                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&auto=format&fit=crop"
                                        alt="Steven Sunny"
                                        width={200}
                                        height={200}
                                        className="w-12 h-12 rounded-full object-cover border border-white/10 grayscale hover:grayscale-0 transition-all"
                                    />
                                    <div>
                                        <h2 className="font-bold text-lg text-white">Steven Sunny</h2>
                                        <p className="text-sm text-slate-500">CEO, Boxefi</p>
                                    </div>
                                </div>
                            </article>
                        </TimelineContent>
                    </div>

                    <div className="h-full md:flex lg:flex-col lg:space-y-6 lg:gap-0 gap-6">
                        <TimelineContent animationNum={5} customVariants={revealVariants} timelineRef={testimonialRef} className="lg:flex-[3] flex-[4] flex flex-col justify-between relative bg-slate-800 border-l-[4px] border-cyan-400 rounded-2xl p-8 shadow-xl">
                            <article className="mt-auto text-slate-200">
                                <p className="leading-relaxed mb-6">
                                    "DevPulse has been a key partner in our growth journey to IPO."
                                </p>
                                <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                                    <Image
                                        src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=256&auto=format&fit=crop"
                                        alt="Guillermo Rauch"
                                        width={200}
                                        height={200}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-cyan-400"
                                    />
                                    <div>
                                        <h2 className="font-bold text-white">Guillermo Rauch</h2>
                                        <p className="text-sm text-cyan-300">CEO, OdeaoLabs</p>
                                    </div>
                                </div>
                            </article>
                        </TimelineContent>
                        <TimelineContent animationNum={6} customVariants={revealVariants} timelineRef={testimonialRef} className="lg:flex-[7] flex-[6] flex flex-col justify-between relative bg-cyan-950 overflow-hidden rounded-2xl border border-cyan-800/50 p-8 shadow-xl">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-20 -mt-20 z-0"></div>
                            <article className="mt-auto relative z-10 text-cyan-50">
                                <p className="text-lg leading-relaxed font-medium mb-8">
                                    "Understanding team velocity and impact through advanced AI-driven behavioral analysis and collaboration patterns changed everything for us. We ship 2x faster now."
                                </p>
                                <div className="flex items-center gap-4 pt-4 border-t border-cyan-800/50">
                                    <Image
                                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop"
                                        alt="Paul Brauch"
                                        width={200}
                                        height={200}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-cyan-400/50"
                                    />
                                    <div>
                                        <h2 className="font-bold text-lg">Paul Brauch</h2>
                                        <p className="text-sm text-cyan-300">CTO, Spectrum</p>
                                    </div>
                                </div>
                            </article>
                        </TimelineContent>
                    </div>
                </div>

                <div className="absolute border-b border-white/10 bottom-4 h-16 w-[90%] md:w-full md:left-0 left-[5%] pt-10">
                    <div className="container mx-auto w-full h-full relative"></div>
                </div>
            </section>
        </main>
    );
}

export default ClientFeedback;

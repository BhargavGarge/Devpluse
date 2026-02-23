"use client";

import { Quote, Star } from "lucide-react";

export function Testimonials() {
    return (
        <section className="py-32 px-6 bg-white/[0.01]">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20 space-y-4">
                    <h2 className="text-4xl font-bold tracking-tight">Voices of Excellence</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto">See how top engineering leaders are transforming their development culture with DevPulse.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <TestimonialCard
                        quote="DevPulse gave us the 'calm' we were missing. No more hunting for metrics across 50 repos; the AI just tells us where we need to focus each morning."
                        name="Marcus Thorne"
                        role="VP Engineering, StellarScale"
                        image="https://lh3.googleusercontent.com/aida-public/AB6AXuD7VokJrE8a9cKdUijcf5AJm-cRj7rzDATqRlwkvwMZbNzsJJw0ZV2uR3yuhXx3qfipTN6P4_-o80ugdvAb4suBXHUJo09qrLa8-SZdmQN21LR8yBE8snww9Is9rbYNE_yxL3-4Xbt-Urdy3dPNqjYOgxAK0hgl76fR7Y5xE4LqoPm9trxtNOgjZhzvdluWSMm4pfCdPcwMSoWnqk1r783oiMwrbcijZu6f3tpj4CBEwk5U_E66oPZIv3kx4Yh3uDGYT6EMV2ZX1V8"
                    />
                    <TestimonialCard
                        quote="The Repo Health Score changed how we prioritize technical debt. It's no longer a guessing game; it's a data-backed roadmap that everyone trusts."
                        name="Elena Rodriguez"
                        role="Engineering Manager, CloudFlow"
                        image="https://lh3.googleusercontent.com/aida-public/AB6AXuDHsld3cWj4yxj8DG6_o67YknLGRNHTvjW1ixSL2n_cGy2XtSKqNn5_z1dpdPUAV3GF8CxZs3kw41lj6Ci0dCTPyYQ8jVD-X20auL7hptWvEYcLa6776KIB-sU8AlCkoAyPlPZss63rnocqyswzXnmBvpeKm93l3i0bmMxmhSPeD4sjwNYzM3kr25mV3ieKKtyUbspn6t1SdGGpvNhhy2CWKMmBl0GVQ_4q8C4eDr9KnQ4GbaSAK5SytmE8U0SYS7eZ6kWTfP6tnaQ"
                    />
                    <TestimonialCard
                        quote="Integrating DevPulse with our GitHub and Slack workflow was seamless. The Weekly AI Reports have reduced our sync meeting time by nearly 30%."
                        name="David Chen"
                        role="CTO, PulsePay"
                        image="https://lh3.googleusercontent.com/aida-public/AB6AXuCQ_7EnK7VSNrHsQr1RQW9ySbBw2hSSp1pvAFgbVssiBiwvVHB2zJ7H6ufW79Y2vUvRLFRXK6XOkkDo3PtHCxPFY-g5kzgxKuJ6NxH24fdEgJHzSCKXNVwAS-MoDtQcU7c47h2tA6-3fo200BZtRgQtBtafmvqzeZapS13nmBeXqQvbQCqbWqVl_ehhH1L2BuYRnN5EcUYyvG0ARLeQff9zREhiueYQfe0ZznoVZGkcl3wZijVmwzd8q9HlAUMbrEXg8PJZmcs-NfY"
                    />
                </div>
            </div>
        </section>
    );
}

function TestimonialCard({ quote, name, role, image }: { quote: string, name: string, role: string, image: string }) {
    return (
        <div className="glass-card p-8 rounded-2xl border-white/5 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Quote className="w-16 h-16" />
            </div>
            <div className="relative z-10">
                <div className="flex gap-1 mb-6 text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                </div>
                <p className="text-lg text-slate-300 leading-relaxed italic mb-8">
                    "{quote}"
                </p>
            </div>
            <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                <img alt={name} className="w-12 h-12 rounded-full object-cover grayscale" src={image} />
                <div>
                    <p className="font-bold text-white">{name}</p>
                    <p className="text-xs text-primary uppercase font-bold tracking-wider">{role}</p>
                </div>
            </div>
        </div>
    );
}

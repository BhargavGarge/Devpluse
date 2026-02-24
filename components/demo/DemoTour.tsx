"use client";

import { useEffect, useState } from "react";
import Joyride, { Step } from "react-joyride";

export function DemoTour() {
    const [run, setRun] = useState(false);

    useEffect(() => {
        // slight delay to let the UI mount properly
        const timer = setTimeout(() => {
            setRun(true);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const steps: Step[] = [
        {
            target: "body",
            content: "Welcome to DevPulse! Let's take a quick tour of our AI-powered engineering insights.",
            placement: "center",
            disableBeacon: true,
        },
        {
            target: "#tour-health-score",
            content: "Instantly see the overall health and risk level of your team's code review process.",
            placement: "right",
            disableBeacon: true,
        },
        {
            target: "#tour-metrics-grid",
            content: "Dive into specific metrics like average PR size, review time, and large PR ratio. We highlight bottlenecks automatically.",
            placement: "bottom",
            disableBeacon: true,
        },
        {
            target: "#tour-contributor-risk",
            content: "Our AI analyzes contributor discipline to evaluate bus factor and ownership risks.",
            placement: "right",
            disableBeacon: true,
        },
        {
            target: "#tour-tech-stack",
            content: "Understand your repository's tech stack complexity and fragmentation score at a glance.",
            placement: "left",
            disableBeacon: true,
        },
        {
            target: "#tour-deep-dive",
            content: "Deep dive into team collaboration habits—like multi-reviewer PRs and fast merge ratios.",
            placement: "top",
            disableBeacon: true,
        },
        {
            target: "#tour-ai-insights",
            content: "That's it! DevPulse actively analyzes your data to surface insights without missing a beat.",
            placement: "bottom",
            disableBeacon: true,
        }
    ];

    return (
        <Joyride
            steps={steps}
            run={run}
            continuous={true}
            showSkipButton={true}
            showProgress={true}
            styles={{
                options: {
                    primaryColor: '#5b2bee',
                    zIndex: 1000,
                },
                tooltipContainer: {
                    textAlign: "left"
                }
            }}
        />
    );
}

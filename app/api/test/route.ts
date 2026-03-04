import { NextResponse } from "next/server";

export function GET() {
    return NextResponse.json({ message: "Test works" }, { status: 200 });
}

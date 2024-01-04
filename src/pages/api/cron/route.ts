import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse, NextRequest } from 'next/server';

export default function handler(request: NextRequest, response: NextResponse) {
    const authHeader = request.headers.get('authorization');
    if (
        !process.env.CRON_SECRET ||
        authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
        return NextResponse.json({ success: false });
        // return response.status(401).json({ success: false });
    }

    NextResponse.json({ success: true });

    // return response.status(200).json({ success: true });
}

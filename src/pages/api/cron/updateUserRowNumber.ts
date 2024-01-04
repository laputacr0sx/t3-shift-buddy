// import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse, type NextRequest } from 'next/server';

import { clerkClient } from '@clerk/nextjs/server';

export default async function handler(
    request: NextRequest
    // response: NextResponse
) {
    const authHeader = request.headers.get('authorization');
    if (
        !process.env.CRON_SECRET ||
        authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
        return NextResponse.json({ success: false });
        // return response.status(401).json({ success: false });
    }

    const allUsers = await clerkClient.users.getUserList();
    allUsers.map(async (user) => {
        const userMetadata = await clerkClient.users
            .getUser(user.id)
            .then((user) => user.privateMetadata);

        return clerkClient.users.updateUserMetadata(user.id, {
            privateMetadata: { ...userMetadata, row: +userMetadata.row + 1 }
        });
    });
    NextResponse.json({ success: true });
}

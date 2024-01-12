// import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse, type NextRequest } from 'next/server';

import { clerkClient } from '@clerk/nextjs/server';
import { userPrivateMetadataSchema } from '~/utils/zodSchemas';

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
        const userMetadata = userPrivateMetadataSchema.parse(
            await clerkClient.users
                .getUser(user.id)
                .then((user) => user.privateMetadata)
        );

        const rowCategory = userMetadata.row.match(/[ABCS]/)?.[0] as string;
        let rowSequence = +(userMetadata.row.match(/\d{1,3}/)?.[0] as string);

        return clerkClient.users.updateUserMetadata(user.id, {
            privateMetadata: {
                ...userMetadata,
                row: `${rowCategory}${rowSequence++}`
            }
        });
    });
    NextResponse.json({ success: true });
}

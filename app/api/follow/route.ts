import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    const currentUserEmail = session?.user?.email!;
    const { tagetUserId } = await request.json();

    const currentUserId = await prisma.user.findUnique({
        where: {
            email: currentUserEmail
        }
    }).then((user) => user?.id!);

    const record = await prisma.follows.create({
        data: {
            followerId: currentUserId,
            followingId: tagetUserId
        }
    });

    return NextResponse.json(record);
}

export async function DELETE(request: NextRequest) {
    const session = await getServerSession(authOptions);
    const currentUserEmail = session?.user?.email!;
    const tagetUserId = request.nextUrl.searchParams.get('tagetUserId');

    const currentUserId = await prisma.user.findUnique({
        where: {
            email: currentUserEmail
        }
    }).then((user) => user?.id!);

    const record = await prisma.follows.delete({
        where: {
            followerId_followingId: {
                followerId: currentUserId,
                followingId: tagetUserId!
            }
        }
    });

    return NextResponse.json(record);
}
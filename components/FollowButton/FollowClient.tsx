'use client';

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface Props {
    targetUserId: string;
    isFollowing: boolean;
}

export default function FollowClient({ targetUserId, isFollowing }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isFetching, setIsFetching] = useState(false);
    const isMutating = isPending || isFetching;

    const follow = async (targetUserId: string) => {
        setIsFetching(true);
        const res = await fetch(`/api/follow`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                targetUserId
            })
        })

        setIsFetching(false);

        console.log(res);

        startTransition(() => {
            router.refresh();
        });
    };

    const unfollow = async (tagretUserId: string) => {
        setIsFetching(true);
        const res = await fetch(`/api/follow?tagetUserId=${tagretUserId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        setIsFetching(false);
        console.log(res);
        startTransition(() => {
            router.refresh();
        });
    }

    if (isFollowing) {
        return <button onClick={() => unfollow(targetUserId)}>{!isMutating ? 'Unfollow' : 'Unfollowing...'}</button>;
    }
    return <button onClick={() => follow(targetUserId)}>{!isMutating ? 'Follow' : 'Following...'}</button>;

}




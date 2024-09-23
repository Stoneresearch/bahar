import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { email } = await request.json();
    console.log('Attempting to set admin rights for email:', email);

    try {
        const users = await clerkClient.users.getUserList({
            emailAddress: [email],
        });
        console.log('Users found:', users.data.length);

        if (users.data.length === 0) {
            console.log('No user found for email:', email);
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const user = users.data[0];
        console.log('Updating user:', user.id);

        await clerkClient.users.updateUser(user.id, {
            publicMetadata: { role: "admin" },
        });
        console.log('User updated successfully');

        return NextResponse.json({ message: "Admin rights assigned successfully" });
    } catch (error) {
        console.error("Error assigning admin rights:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
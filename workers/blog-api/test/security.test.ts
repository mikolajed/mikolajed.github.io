import { test, expect } from "bun:test";
import { privateKeyToAccount, generatePrivateKey } from "viem/accounts";

const OWNER_PRIVATE_KEY = process.env.OWNER_PRIVATE_KEY;
const API_URL = process.env.NEXT_PUBLIC_BLOG_API_URL;

if (!OWNER_PRIVATE_KEY) throw new Error("OWNER_PRIVATE_KEY not found in root .env");
if (!API_URL) throw new Error("NEXT_PUBLIC_BLOG_API_URL not found in root .env"); 

test("Should REJECT creation with RANDOM address", async () => {
    const randomAccount = privateKeyToAccount(generatePrivateKey());
    console.log("Testing Random Address:", randomAccount.address);

    const timestamp = Date.now();
    const message = `Authorize Blog Action\nTimestamp: ${timestamp}`;
    const signature = await randomAccount.signMessage({ message });

    const res = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Signature": signature,
            "X-Timestamp": timestamp.toString(),
        },
        body: JSON.stringify({
            slug: "test-random-" + Date.now(),
            title: "Unauthorized Post",
            content: "Should not be created.",
            excerpt: "Unauthorized",
            published: true,
            id: crypto.randomUUID()
        })
    });

    console.log("Random Account Response:", res.status, await res.text());
    expect(res.status).toBe(403);
});

test("Should ALLOW creation with OWNER address", async () => {
    const ownerAccount = privateKeyToAccount(OWNER_PRIVATE_KEY as `0x${string}`);
    console.log("Testing Owner Address:", ownerAccount.address);

    const timestamp = Date.now();
    const message = `Authorize Blog Action\nTimestamp: ${timestamp}`;
    const signature = await ownerAccount.signMessage({ message });
    
    const slug = "test-owner-" + Date.now();

    const res = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Signature": signature,
            "X-Timestamp": timestamp.toString(),
        },
        body: JSON.stringify({
            slug: slug,
            title: "Authorized Post",
            content: "This post was created by the owner via automated test.",
            excerpt: "Authorized",
            published: false,
            id: crypto.randomUUID()
        })
    });

    console.log("Owner Account Response:", res.status);
    if (!res.ok) console.log(await res.text());
    expect(res.status).toBe(201);

    // Cleanup
    const delTimestamp = Date.now();
    const delMessage = `Authorize Blog Action\nTimestamp: ${delTimestamp}`;
    const delSignature = await ownerAccount.signMessage({ message: delMessage });

    await fetch(`${API_URL}/posts/${slug}`, {
        method: "DELETE",
        headers: {
            "X-Signature": delSignature,
            "X-Timestamp": delTimestamp.toString(),
        }
    });
});

test("Should REJECT replay attack (old timestamp)", async () => {
    const ownerAccount = privateKeyToAccount(OWNER_PRIVATE_KEY as `0x${string}`);
    const oldTimestamp = Date.now() - (10 * 60 * 1000); // 10 minutes ago
    const message = `Authorize Blog Action\nTimestamp: ${oldTimestamp}`;
    const signature = await ownerAccount.signMessage({ message });

    const res = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Signature": signature,
            "X-Timestamp": oldTimestamp.toString(),
        },
        body: JSON.stringify({
            slug: "test-replay-" + Date.now(),
            title: "Replay Post",
            content: "Should be rejected.",
            excerpt: "Replay",
            published: true,
            id: crypto.randomUUID()
        })
    });

    console.log("Replay Attack Response:", res.status);
    expect(res.status).toBe(401);
});

test("Should REJECT tampered signature (message mismatch)", async () => {
    const ownerAccount = privateKeyToAccount(OWNER_PRIVATE_KEY as `0x${string}`);
    const timestamp = Date.now();
    
    // Sign for a different action/message
    const fakeMessage = `Authorize Other Action\nTimestamp: ${timestamp}`;
    const signature = await ownerAccount.signMessage({ message: fakeMessage });

    const res = await fetch(`${API_URL}/posts`, { // Sending to /posts
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Signature": signature,
            "X-Timestamp": timestamp.toString(),
        },
        body: JSON.stringify({
            slug: "test-tamper-" + Date.now(),
            title: "Tampered Post",
            content: "Should be rejected.",
            excerpt: "Tampered",
            published: true,
            id: crypto.randomUUID()
        })
    });

    console.log("Tampered Signature Response:", res.status);
    expect(res.status).toBe(403);
});

test("Should REJECT missing headers", async () => {
    const res = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // Missing Signature and Timestamp
        },
        body: JSON.stringify({
            slug: "test-missing-" + Date.now(),
            title: "Missing Headers Post",
            content: "Should be rejected.",
            excerpt: "Missing",
            published: true,
            id: crypto.randomUUID()
        })
    });

    console.log("Missing Headers Response:", res.status);
    expect(res.status).toBe(401);
});

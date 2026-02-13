import { verifyMessage } from 'viem';

export interface Env {
	DB: D1Database;
    BUCKET: R2Bucket;
    OWNER_ADDRESS: string;
}

// CORS headers for all responses
const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, HEAD, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Signature, X-Timestamp, X-Address",
};

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const url = new URL(request.url);
        const path = url.pathname;
        const method = request.method;

        // Handle CORS preflight
        if (method === "OPTIONS") {
            return new Response(null, {
                headers: CORS_HEADERS
            });
        }

        // --- Auth Middleware ---
        const isMutation = ["POST", "PUT", "DELETE"].includes(method);
        if (isMutation) {
            const signature = request.headers.get("X-Signature");
            const timestamp = request.headers.get("X-Timestamp");
            
            if (!signature || !timestamp) {
                 return new Response("Missing signature or timestamp", { status: 401, headers: CORS_HEADERS });
            }

            // Verify timestamp (5 min window)
            const now = Date.now();
            const ts = parseInt(timestamp);
            if (Math.abs(now - ts) > 5 * 60 * 1000) {
                 return new Response("Request expired", { status: 401, headers: CORS_HEADERS });
            }

            // Verify signature
            // Message format: "Authorize Blog Action\nTimestamp: 123456789"
            const message = `Authorize Blog Action\nTimestamp: ${timestamp}`;
            try {
                const isValid = await verifyMessage({
                    address: env.OWNER_ADDRESS as `0x${string}`,
                    message: message,
                    signature: signature as `0x${string}`,
                });

                if (!isValid) {
                    return new Response("Invalid signature", { status: 403, headers: CORS_HEADERS });
                }
            } catch (e) {
                return new Response("Signature verification failed", { status: 403, headers: CORS_HEADERS });
            }
        }

        // --- GET /posts ---
        if (method === "GET" && path === "/posts") {
            const { results } = await env.DB.prepare(
                "SELECT * FROM posts WHERE published = TRUE ORDER BY created_at DESC"
            ).all();
            return Response.json(results, { headers: CORS_HEADERS });
        }

        // --- GET /posts/:slug ---
        // Regex to match /posts/some-slug
        const matchPost = path.match(/^\/posts\/([a-zA-Z0-9-]+)$/);
        if (method === "GET" && matchPost) {
            const slug = matchPost[1];
            const post = await env.DB.prepare(
                "SELECT * FROM posts WHERE slug = ?"
            ).bind(slug).first();

            if (!post) {
                return new Response("Post not found", { status: 404, headers: CORS_HEADERS });
            }
            return Response.json(post, { headers: CORS_HEADERS });
        }

        // --- POST /posts ---
        if (method === "POST" && path === "/posts") {
            try {
                const body = await request.json() as any;
                const { slug, title, content, excerpt, published } = body;
                
                if (!slug || !title || !content) {
                    return new Response("Missing required fields", { status: 400, headers: CORS_HEADERS });
                }

                const now = Date.now();
                await env.DB.prepare(
                    `INSERT INTO posts (id, slug, title, content, excerpt, published, created_at, updated_at) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
                ).bind(
                    crypto.randomUUID(), 
                    slug, 
                    title, 
                    content, 
                    excerpt || "", 
                    published ? 1 : 0, 
                    now, 
                    now
                ).run();

                return Response.json({ message: "Created" }, { status: 201, headers: CORS_HEADERS });
            } catch (e) {
                return new Response("Error creating post: " + e, { status: 500, headers: CORS_HEADERS });
            }
        }

        // --- PUT /posts/:slug ---
        if (method === "PUT" && matchPost) {
             const slug = matchPost[1];
             try {
                const body = await request.json() as any;
                const { title, content, excerpt, published } = body;
                const now = Date.now();

                await env.DB.prepare(
                    `UPDATE posts SET title = ?, content = ?, excerpt = ?, published = ?, updated_at = ? WHERE slug = ?`
                ).bind(title, content, excerpt, published ? 1 : 0, now, slug).run();

                return Response.json({ message: "Updated" }, { status: 200, headers: CORS_HEADERS });
             } catch (e) {
                 return new Response("Error updating post", { status: 500, headers: CORS_HEADERS });
             }
        }

        // --- POST /upload ---
        if (method === "POST" && path === "/upload") {
            try {
                const formData = await request.formData();
                const file = formData.get("file") as unknown as File;
                if (!file || typeof file === "string") {
                    return new Response("No file uploaded or invalid file", { status: 400, headers: CORS_HEADERS });
                }

                const key = `${Date.now()}-${file.name}`;
                await env.BUCKET.put(key, file.stream(), {
                    httpMetadata: {
                        contentType: file.type,
                    },
                });

                const assetUrl = `${url.origin}/assets/${key}`;
                return Response.json({ url: assetUrl }, { headers: CORS_HEADERS });
            } catch (e) {
                return new Response("Error uploading file: " + e, { status: 500, headers: CORS_HEADERS });
            }
        }

        // --- GET /assets/:key ---
        const matchAsset = path.match(/^\/assets\/(.+)$/);
        if (method === "GET" && matchAsset) {
            const key = matchAsset[1];
            const object = await env.BUCKET.get(key);

            if (!object) {
                return new Response("Object Not Found", { status: 404, headers: CORS_HEADERS });
            }

            const headers = new Headers(CORS_HEADERS);
            object.writeHttpMetadata(headers);
            headers.set("etag", object.httpEtag);

            return new Response(object.body, {
                headers,
            });
        }

        // --- DELETE /posts/:slug ---
        if (method === "DELETE" && matchPost) {
            const slug = matchPost[1];
            await env.DB.prepare("DELETE FROM posts WHERE slug = ?").bind(slug).run();
            return Response.json({ message: "Deleted" }, { status: 200, headers: CORS_HEADERS });
        }


		return new Response('Not Found', { status: 404, headers: CORS_HEADERS });
	},
};

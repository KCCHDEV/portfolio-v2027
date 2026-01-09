const server = Bun.serve({
    port: 3000,
    async fetch(req) {
        const url = new URL(req.url);

        // API endpoint for GitHub data
        if (url.pathname === "/api/github") {
            try {
                const [userRes, reposRes] = await Promise.all([
                    fetch("https://api.github.com/users/KCCHDEV"),
                    fetch("https://api.github.com/users/KCCHDEV/repos?sort=updated&per_page=12")
                ]);

                const user = await userRes.json();
                const repos = await reposRes.json();

                return new Response(JSON.stringify({ user, repos }), {
                    headers: { "Content-Type": "application/json" }
                });
            } catch (error) {
                return new Response(JSON.stringify({ error: "Failed to fetch GitHub data" }), {
                    status: 500,
                    headers: { "Content-Type": "application/json" }
                });
            }
        }

        // Serve static files
        const filePath = url.pathname === "/" ? "/index.html" : url.pathname;
        const file = Bun.file(`${import.meta.dir}${filePath}`);

        if (await file.exists()) {
            return new Response(file);
        }

        return new Response("Not Found", { status: 404 });
    },
});

console.log(`🚀 Portfolio server running at http://localhost:${server.port}`);

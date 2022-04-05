import { Application } from "https://deno.land/x/oak/mod.ts";
import { Client } from "https://deno.land/x/mysql/mod.ts";

// connect to the SQL server
const settings = JSON.parse(await Deno.readTextFile('settings.json'));
const client = await new Client().connect(settings.db);

const app = new Application();

// Content delivery
app.use(async (ctx, next) => {
    try {
        await ctx.send({
            root: './static',
            index: "index.html"
        });
    } catch {
        ctx.response.status = 404;
        ctx.response.body = '404 | Page Not Found';
    } finally {
        await next();
    }
});

// View logger
app.use(async (ctx) => {
    if(ctx.request.url.pathname === '/' && ctx.response.status === 200) {
        // requesting home page, log view

        await client.execute('INSERT IGNORE INTO Views (Page, ID) VALUES (?, UUID_TO_BIN(?));', [
            'home',
            await ctx.cookies.get('viewid').then(async cookie => {
                // returns existing cookie ID if exists, else generates, sets, and returns new cookie ID
                if(typeof await cookie === 'undefined') {
                    // no cookie set, creating one
                    return await Promise.all([
                        fetch(`http://api.userstack.com/api/detect?access_key=${settings.ua_key}&ua=${ctx.request.headers.get("user-agent")}`).then(res => res.json()),
                        fetch(`http://api.ipstack.com/${ctx.request.ip}?access_key=${settings.ip_key}`).then(res => res.json())
                    ]).then(async data => {
                        await client.execute('INSERT INTO Sessions (ID, IP, Country, Region, City, Platform, Browser, Version, Format) VALUES(UUID_TO_BIN(UUID()), INET_ATON(?), ?, ?, ?, ?, ?, ?, ?);', [
                            ctx.request.ip,
                            await data[1].country_code,
                            await data[1].region_code,
                            await data[1].city,
                            await data[0].os.family,
                            await data[0].browser.name,
                            await data[0].browser.version_major,
                            (await data[0].crawler.is_crawler) ? 'crawler' : await data[0].device.type
                        ]);
                    }).then(async () => {
                        return await client.query('SELECT BIN_TO_UUID(ID) AS ID FROM Sessions ORDER BY Timestamp DESC LIMIT 1;').then(async res => {
                            // created and set cookie ID
                            await ctx.cookies.set('viewid', await res[0].ID);
                            return await res[0].ID;
                        });
                    });
                } else {
                    // cookie found, return its ID
                    return await cookie;
                }
            })
        ])
    }
})

// Shutdown process
self.addEventListener("unload", async () => {
    await client.close();
    console.log('Server is shutdown. Goodbye!');
});

app.addEventListener("listen", ({ port }) => {
    console.log(`http://azroberts.com listening on port ${port}...`);
});

await app.listen({ port: settings.port });
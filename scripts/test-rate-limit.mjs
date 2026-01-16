
const BASE_URL = "http://localhost:3000";

async function testRateLimit(endpoint, name, limit = 60, options = {}) {
    console.log(`Testing rate limit on ${name} (${endpoint})...`);
    let rateLimited = false;
    let successCount = 0;
    
    // We'll try limit + 5 requests (enough to trigger small limits)
    const totalRequests = limit + 5;
    
    // Create an array of promises to fire requests rapidly
    const promises = [];
    
    for (let i = 0; i < totalRequests; i++) {
        promises.push(
            fetch(`${BASE_URL}${endpoint}`, {
                method: options.method || "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...options.headers
                },
                body: options.body ? JSON.stringify(options.body) : undefined
            }).then(res => {
                // Better-auth might return 429 or a specific error object
                if (res.status === 429) {
                    rateLimited = true;
                } else if (res.ok || res.status === 400 || res.status === 401 || res.status === 200) {
                    // 400/401 are also "success" in terms of reaching the handler (not blocked by rate limiter)
                    // But for better-auth, if we get 429 it's blocked.
                    successCount++;
                }
                return res.status;
            })
        );
    }
    
    await Promise.all(promises);
    
    if (rateLimited) {
        console.log(`✅ ${name}: Rate limiting triggered (Success/Allowed: ${successCount}, Limited: Yes)`);
    } else {
        console.log(`❌ ${name}: Rate limiting FAILED to trigger (Success/Allowed: ${successCount})`);
    }
}

async function run() {
    console.log("Starting Rate Limit Verification...");
    
    // Test public settings (General Limit ~60)
    await testRateLimit("/api/settings", "Public Settings", 60);
    
    // Test admin settings (General Limit ~60 for GET)
    await testRateLimit("/api/admin/settings", "Admin Settings", 60);

    // Test Sign In (Strict Limit ~5)
    // We expect 429 after 5 attempts. 
    // We send dummy data, we just want to hit the rate limiter.
    await testRateLimit("/api/auth/sign-in/email", "Sign In", 5, {
        method: "POST",
        body: {
            email: "test@example.com",
            password: "password123"
        }
    });

    // Test Forgot Password (Strict Limit ~3)
    await testRateLimit("/api/auth/forget-password", "Forgot Password", 3, {
        method: "POST",
        body: {
            email: "test@example.com"
        }
    });
    
    console.log("Done.");
}

run().catch(console.error);

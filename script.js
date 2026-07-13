const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL ="nvidia/nemotron-3-ultra-550b-a55b:free";


async function askLLM(prompt) {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json", 
        }, 
        body: JSON.stringify({
            model: MODEL,
            messages: [{ role: "user", content: prompt }],
        }),
    });
    if (!res.ok) {
        throw new Error(`openrouter said ${res.status}: ${await res.text()}`);
    }

    const data = await res.json();
    return data.choices[0].message.content;

}


const reply = await askLLM("say 'victorylap is alive' and nothing else.");
 console.log(reply);
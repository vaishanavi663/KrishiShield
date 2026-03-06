import fetch from "node-fetch";

export async function translateText(text, targetLang) {
  try {
    const response = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        q: text,
        source: "en",
        target: targetLang,
        format: "text"
      })
    });

    const data = await response.json();

    return data.translatedText;

  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
}
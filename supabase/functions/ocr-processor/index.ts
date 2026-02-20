// supabase/functions/ocr-processor/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Max-Age': '86400',
};

serve(async (req: Request) => {
  console.log(`📦 ${req.method} ${req.url}`);
  
  // ========== ОБЯЗАТЕЛЬНО обрабатываем OPTIONS ==========
  if (req.method === 'OPTIONS') {
    console.log('🔄 Handling OPTIONS preflight');
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }
  
  // ========== Только POST запросы ==========
  if (req.method !== 'POST') {
    console.log(`❌ Method ${req.method} not allowed`);
    return new Response(
      JSON.stringify({ error: 'Method not allowed. Use POST.' }),
      {
        status: 405,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }

  try {
    // ========== Парсим тело запроса ==========
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }
    
    const { imageUrl } = body;
    
    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: 'imageUrl is required' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    console.log('🎯 Processing image:', imageUrl);

    // ========== Вызываем OCR API ==========
    const ocrText = await callSimpleOcrApi(imageUrl);
    
    // ========== Парсим результаты ==========
    const stats = parseGameStats(ocrText);

    console.log('✅ Success! Stats:', stats);

    return new Response(
      JSON.stringify({
        success: true,
        rawText: ocrText,
        stats: stats,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Unknown error',
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});

// ПРОСТАЯ функция OCR БЕЗ рекурсии
async function callSimpleOcrApi(imageUrl: string): Promise<string> {
  const apiKey = "helloworld"; // Демо-ключ OCR.Space
  
  console.log("Calling OCR API for URL:", imageUrl);
  
  // Простая реализация без preprocessImage
  const params = new URLSearchParams({
    url: imageUrl,
    apikey: apiKey,
    language: "eng",
    filetype: "PNG", // Явно указываем тип
    isOverlayRequired: "false",
    detectOrientation: "true",
    scale: "true",
    OCREngine: "2"
  });

  const response = await fetch(`https://api.ocr.space/parse/imageurl?${params}`);
  
  if (!response.ok) {
    throw new Error(`OCR API HTTP error: ${response.status}`);
  }

  const data = await response.json();
  console.log("OCR API response status:", data.OCRExitCode);
  
  if (data.IsErroredOnProcessing || !data.ParsedResults?.[0]) {
    const errorMsg = data.ErrorMessage || "No text found";
    console.error("OCR failed:", errorMsg);
    
    // Если это проблема с изображением iimg.su, даём полезную подсказку
    if (imageUrl.includes("iimg.su")) {
      throw new Error(`Cannot process image from iimg.su. Please upload to another service like Imgur. Original error: ${errorMsg}`);
    }
    
    throw new Error(`OCR failed: ${errorMsg}`);
  }

  return data.ParsedResults[0].ParsedText || "";
}

// Функция нормализации текста для обработки проблем кодировки
// Функция нормализации текста - УПРОЩЕННАЯ ВЕРСИЯ
function normalizeText(text: string): string {
  console.log("Original text from OCR:", text);
  
  // Убираем лишние пробелы и переносы
  let normalized = text.replace(/\r\n/g, '\n').trim();
  
  // Пробуем исправить распространенные проблемы OCR
  normalized = normalized
    .replace(/Ð£Ð±Ð¸Ð¹ÑÑÐ²/g, 'Убийства')
    .replace(/Ð¡Ð¼ÐµÑÑÐµÐ¹/g, 'Смертей')
    .replace(/ÐÐ¾Ð¼\.?\s?Ð²?\s?Ð£Ð±\.?/g, 'Помощи')
    .replace(/Ð£Ð±Ð¸Ð¹ÑÑÐ²\/Ð¡Ð¼ÐµÑÑÐµÐ¹/g, 'K/D')
    .replace(/Ð Ð°Ð½Ð³/g, 'Ранг')
    .replace(/Ð¡Ð¾Ð¾ÑÐ½\.?\s?ÐÐ±\/ÐÑ/g, 'Соотн. Поп/Выстр');
  
  console.log("Normalized text:", normalized);
  return normalized;
}

// ОБНОВЛЕННАЯ функция parseGameStats
function parseGameStats(text: string) {
  const stats = {
    kills: 0,
    deaths: 0,
    assists: 0,
    kdRatio: 0,
    score: 0,
    headshots: 0,
    accuracy: 0,
    playtime: 0,
    rank: 0,
    matches: 0,
    winrate: 0,
  };

  console.log("=== STARTING PARSER ===");
  console.log("Full text:", text);

  // Разделяем текст на строки
  const lines = text.split("\n").map(line => line.trim()).filter(line => line.length > 0);
  console.log("All lines:", lines);

  // 1. Ищем MATCHES PLAYED
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("Matches Played") || lines[i].includes("Matches")) {
      console.log("Found matches at line", i, ":", lines[i]);
      
      // Ищем число в строке "634 Matches Played"
      const matchesMatch = lines[i].match(/(\d+)\s*(Matches|матчей|игр)/i);
      if (matchesMatch) {
        stats.matches = parseInt(matchesMatch[1]);
        console.log("Parsed matches:", stats.matches);
      }
      break;
    }
  }

  // 2. Ищем KILLS
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("Player Kills") || lines[i].includes("Kills") || 
        lines[i].includes("Убийства")) {
      console.log("Found kills at line", i, ":", lines[i]);
      
      // Ищем число с запятыми "3,308"
      const killsMatch = lines[i].match(/(\d[\d,]+)/);
      if (killsMatch) {
        stats.kills = parseInt(killsMatch[0].replace(/,/g, ''));
        console.log("Parsed kills:", stats.kills);
        break;
      }
    }
  }

  // 3. Ищем DEATHS
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("Deaths") || lines[i].includes("Смертей") || 
        lines[i].includes("Смерти")) {
      console.log("Found deaths at line", i, ":", lines[i]);
      
      // Ищем число с запятыми "1,610"
      const deathsMatch = lines[i].match(/(\d[\d,]+)/);
      if (deathsMatch) {
        stats.deaths = parseInt(deathsMatch[0].replace(/,/g, ''));
        console.log("Parsed deaths:", stats.deaths);
        break;
      }
    }
  }

  // 4. Ищем ASSISTS
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("Assists") || lines[i].includes("Помощи") || 
        lines[i].includes("Помощь")) {
      console.log("Found assists at line", i, ":", lines[i]);
      
      // Ищем число с запятыми "1,538"
      const assistsMatch = lines[i].match(/(\d[\d,]+)/);
      if (assistsMatch) {
        stats.assists = parseInt(assistsMatch[0].replace(/,/g, ''));
        console.log("Parsed assists:", stats.assists);
        break;
      }
    }
  }

  // 5. Ищем K/D RATIO - ВАЖНО: исправляем логику
  // Сначала ищем Player K/D (более точное значение)
  let foundKD = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("Player K/D")) {
      console.log("Found Player K/D at line", i, ":", lines[i]);
      
      // Ищем число с точкой в ЭТОЙ строке
      const kdMatch = lines[i].match(/(\d+[.,]\d+)/);
      if (kdMatch) {
        stats.kdRatio = parseFloat(kdMatch[0].replace(',', '.'));
        console.log("Parsed Player K/D:", stats.kdRatio);
        foundKD = true;
        break;
      }
      
      // Проверяем следующую строку
      if (i + 1 < lines.length) {
        const nextLineMatch = lines[i + 1].match(/(\d+[.,]\d+)/);
        if (nextLineMatch) {
          stats.kdRatio = parseFloat(nextLineMatch[0].replace(',', '.'));
          console.log("Parsed Player K/D from next line:", stats.kdRatio);
          foundKD = true;
          break;
        }
      }
    }
  }
  
  // Если не нашли Player K/D, ищем просто K/D
  if (!foundKD) {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes("K/D") && !lines[i].includes("KDA")) {
        console.log("Found K/D at line", i, ":", lines[i]);
        
        const kdMatch = lines[i].match(/(\d+[.,]\d+)/);
        if (kdMatch) {
          stats.kdRatio = parseFloat(kdMatch[0].replace(',', '.'));
          console.log("Parsed K/D:", stats.kdRatio);
          foundKD = true;
          break;
        }
        
        if (i + 1 < lines.length) {
          const nextLineMatch = lines[i + 1].match(/(\d+[.,]\d+)/);
          if (nextLineMatch) {
            stats.kdRatio = parseFloat(nextLineMatch[0].replace(',', '.'));
            console.log("Parsed K/D from next line:", stats.kdRatio);
            foundKD = true;
            break;
          }
        }
      }
    }
  }

  // 6. Ищем RANK/LEVEL
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("Current Level") || lines[i].includes("Level") || 
        lines[i].includes("Rank") || lines[i].includes("Ранг")) {
      console.log("Found rank at line", i, ":", lines[i]);
      
      // Ищем число после метки
      for (let j = i; j < Math.min(i + 3, lines.length); j++) {
        const rankMatch = lines[j].match(/(\d+)/);
        if (rankMatch && parseInt(rankMatch[0]) > 0) {
          stats.rank = parseInt(rankMatch[0]);
          console.log("Parsed rank from line", j, ":", stats.rank);
          break;
        }
      }
      break;
    }
  }

  // 7. Ищем WIN RATE
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("Win Rate") || lines[i].includes("% Wins") || 
        (lines[i].includes("Wins") && lines[i].includes("%"))) {
      console.log("Found win rate at line", i, ":", lines[i]);
      
      // Ищем процент: "60%"
      const winrateMatch = lines[i].match(/(\d+)%/);
      if (winrateMatch) {
        stats.winrate = parseInt(winrateMatch[1]);
        console.log("Parsed win rate:", stats.winrate);
        break;
      }
    }
  }

  // 8. Ищем PLAYTIME
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("Playtime") || lines[i].includes("Time Played") || 
        (lines[i].includes("h") && lines[i].includes("Playtime"))) {
      console.log("Found playtime at line", i, ":", lines[i]);
      
      // Ищем "137h" в строке
      const playtimeMatch = lines[i].match(/(\d+)\s*h/i);
      if (playtimeMatch) {
        stats.playtime = parseInt(playtimeMatch[1]);
        console.log("Parsed playtime:", stats.playtime);
        break;
      }
    }
  }

  // 9. Ищем ACCURACY (HS%)
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("HS%") || lines[i].includes("Accuracy") || 
        lines[i].includes("Точность")) {
      console.log("Found accuracy at line", i, ":", lines[i]);
      
      // Ищем процент: "16.6%"
      const accuracyMatch = lines[i].match(/(\d+[.,]\d+)%/);
      if (accuracyMatch) {
        stats.accuracy = parseFloat(accuracyMatch[1].replace(',', '.'));
        console.log("Parsed accuracy:", stats.accuracy);
        break;
      }
    }
  }

  // 10. Вычисляем K/D если не нашли, но есть kills и deaths
  if (stats.kdRatio === 0 && stats.kills > 0 && stats.deaths > 0) {
    stats.kdRatio = parseFloat((stats.kills / stats.deaths).toFixed(2));
    console.log("Calculated K/D from kills/deaths:", stats.kdRatio);
  }

  console.log("=== FINAL STATS ===", stats);
  return stats;
}

// Обновленная вспомогательная функция extractNumber
function extractNumber(text: string): number {
  // Ищем числа с пробелами или запятыми типа "1,174" или "1 174"
  const match = text.match(/(\d[\d\s,]*\d)/);
  if (match) {
    const cleanNumber = match[0].replace(/\s|,/g, '');
    const result = parseInt(cleanNumber);
    return isNaN(result) ? 0 : result;
  }
  return 0;
}

// Обновленная extractFloat
function extractFloat(text: string): number {
  // Ищем числа с запятыми или точками типа "1.85" или "1,85"
  const match = text.match(/(\d+[,.]\d+)/);
  if (match) {
    const result = parseFloat(match[0].replace(',', '.'));
    return isNaN(result) ? 0 : result;
  }
  
  // Пробуем найти просто целое число
  const intMatch = text.match(/\d+/);
  if (intMatch) {
    const result = parseFloat(intMatch[0]);
    return isNaN(result) ? 0 : result;
  }
  
  return 0;
}
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";
import { demoReports } from "../src/data/demoReports.ts";

const FMP_API_KEY = process.env.FMP_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

let geminiClient: GoogleGenAI | null = null;

function getGeminiClient() {
  if (!geminiClient) {
    if (!GEMINI_API_KEY) {
      throw new Error("Missing GEMINI_API_KEY");
    }

    geminiClient = new GoogleGenAI({
      apiKey: GEMINI_API_KEY
    });
  }

  return geminiClient;
}


export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }


  const { company } = req.body;


  if (!company || typeof company !== "string") {
    return res.status(400).json({
      error:"Debe especificar una empresa"
    });
  }


  const queryClean = company.trim().toUpperCase();


  const matchedKey = Object.keys(demoReports).find(
    k =>
      k === queryClean ||
      demoReports[k].summary.company
      .toUpperCase()
      .includes(queryClean)
  );


  if (matchedKey) {
    return res.json({
      success:true,
      report:demoReports[matchedKey],
      source:"preloaded"
    });
  }


  return res.json({
    success:true,
    report:{
      summary:{
        company:company,
        ticker:queryClean
      },
      message:"Motor Vercel conectado. Falta migrar análisis FMP."
    },
    source:"vercel"
  });

}
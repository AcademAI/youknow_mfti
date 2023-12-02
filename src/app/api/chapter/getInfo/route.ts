// /api/chapter/getInto

import { prisma } from "@/lib/db";
//import { strict_output } from "@/lib/gpt";
import {
  //getQuestionsFromTranscript,
  getTranscript,
  searchYoutube,
} from "@/lib/youtube";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodyParser = z.object({
  chapterId: z.string(),
});

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { chapterId } = bodyParser.parse(body);
    const chapter = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
      },
    });
    if (!chapter) {
      return NextResponse.json(
        {
          success: false,
          error: "Глава не найдена",
        },
        { status: 404 }
      );
    }
    const videoId = await searchYoutube(chapter.youtubeSearchQuery);
    let transcript = await getTranscript(videoId);
    let maxLength = 500;
    transcript = transcript.split(" ").slice(0, maxLength).join(" ");
    /*
    const {summary}: {summary: string} = await strict_output(
      "Ты - помощник, способный делать краткое содержание транскрипта youtube видео. В ответе верни JSON объект.",
      "Сделай краткое содержание в 250 словах или менее, не говори о спонсорах или рекламе, не имеющих отношения к основной теме текста далее:\n" +
        transcript,
      { summary: "краткое содержания видео в типе string" }
    );
    */

    /*
    await prisma.chapter.update({
      where: { id: chapterId },
      data: {
        videoId: videoId,
        summary: summary,
      },
    });
    */
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid body",
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          error: error,
        },
        { status: 500 }
      );
    }
  }
}

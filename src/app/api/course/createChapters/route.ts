// /api/course/createChapters

import { NextResponse } from "next/server";
import { createChaptersSchema } from "@/validators/course";
import { ZodError } from "zod";
//import { strict_output } from "@/lib/gpt";

import { prisma } from "@/lib/db";
import { createUnitsNChapters, createImageSearchTerm } from "@/lib/gpt";
import { getKandinskyImage } from "@/lib/kandinsky";
//import { getAuthSession } from "@/lib/auth";
//import { getToken } from "next-auth/jwt";
//import { checkSubscription } from "@/lib/subscription";

export async function POST(req: Request, res: Response) {
  try {

    const body = await req.json();
    const { title, units } = createChaptersSchema.parse(body);

    type outputUnits = {
      title: string;
      chapters: {
        youtube_search_query: string;
        chapter_title: string;
      }[];
    }[];

    // rewrite to call_gigachat
    let output: string = await createUnitsNChapters(
      title,
      units
     );
    const output_units: outputUnits = JSON.parse(output);
    console.log(output_units)
    
    const imageOutput = await createImageSearchTerm(
      title
    );
    const imageSearchTerm = JSON.parse(imageOutput);

    const course_image = await getKandinskyImage(
      imageSearchTerm.image_search_term
    );


      
    const course = await prisma.course.create({
      data: {
        name: title,
        image: course_image,
        userId: 'mftiuser123id',
        views: 0,
      },
    });

    for (const unit of output_units) {
      const title = unit.title;
      const prismaUnit = await prisma.unit.create({
        data: {
          name: title,
          courseId: course.id,
        },
      });
      await prisma.chapter.createMany({
        data: unit.chapters.map((chapter) => {
          return {
            name: chapter.chapter_title,
            youtubeSearchQuery: chapter.youtube_search_query,
            unitId: prismaUnit.id,
          };
        }),
      });
    }
    await prisma.user.update({
      where: {
        id: 'mftiuser123id',
      },
      data: {
        credits: {
          decrement: 1,
        },
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof ZodError) {
      return new NextResponse("invalid body", { status: 400 });
    }
    console.error(error);
  }
}

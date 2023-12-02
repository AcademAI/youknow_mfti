// /api/course/createChapters

import { NextResponse } from "next/server";
import { createChaptersSchema } from "@/validators/course";
import { ZodError } from "zod";
//import { strict_output } from "@/lib/gpt";
import { getUnsplashImage } from "@/lib/unsplash";
import { prisma } from "@/lib/db";
import { createUnitsNChapters } from "@/lib/gigachat";
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

    
    for (const unit of output_units) {
    const title = unit.title;
    console.log(title);

    for (const chapter of unit.chapters) {
      console.log(chapter);

      for (const key in chapter) {
        console.log(`Key: ${key}, Value: ${chapter[key as keyof typeof chapter]}`);
      }
    }
    }

    /*
    const imageSearchTerm = await strict_output(
      "you are an AI capable of finding the most relevant image for a course",
      `Please provide a good image search term for the title of a course about ${title}. This search term will be fed into the unsplash API, so make sure it is a good search term that will return good results`,
      {
        image_search_term: "a good search term for the title of the course",
      }
    );
    */
    
    /*
    const course_image = await getUnsplashImage(
      imageSearchTerm.image_search_term
    );
    */
      /*
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
    */
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof ZodError) {
      return new NextResponse("invalid body", { status: 400 });
    }
    console.error(error);
  }
}

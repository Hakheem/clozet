import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { 
  uploadToCloudinary, 
  deleteFromCloudinary, 
  LUKKUU_FOLDERS 
} from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { 
      username, 
      shopName, 
      phoneNumber, 
      payoutMethod, 
      payoutDetails,
      role, 
      image,
      bio,
      location,
      instagram,
      facebook,
      tiktok,
      onboarded 
    } = body;

    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { image: true },
    });

    let imageUrl = image;
    if (image && image.startsWith("data:image")) {
      // 1. Delete old image if it exists
      if (existingUser?.image) {
        await deleteFromCloudinary(existingUser.image);
      }
      // 2. Upload new image
      const upload = await uploadToCloudinary(image, LUKKUU_FOLDERS.USER_IMAGES);
      imageUrl = upload.secure_url;
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        username,
        shopName,
        phoneNumber,
        payoutMethod,
        payoutDetails: payoutDetails || undefined,
        role: role || "SELLER",
        image: imageUrl,
        bio: bio || undefined,
        location: location || undefined,
        instagram: instagram || undefined,
        facebook: facebook || undefined,
        tiktok: tiktok || undefined,
        onboarded: onboarded ?? true, // Set true if coming from onboarding
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}

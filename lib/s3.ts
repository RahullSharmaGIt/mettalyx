import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    CopyObjectCommand,
    DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const REGION = process.env.AWS_REGION!;
const BUCKET = process.env.S3_BUCKET_NAME!;

/** Singleton S3 client — reused across lambda invocations */
const s3 = new S3Client({
    region: REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

/**
 * Generate a presigned PUT URL so the browser can upload directly to S3.
 * File lands in the `pending/` prefix — eligible for S3 lifecycle deletion
 * after 24h if never confirmed.
 */
export async function generateUploadUrl(
    pendingKey: string,
    mimeType: string
): Promise<string> {
    return getSignedUrl(
        s3,
        new PutObjectCommand({
            Bucket: BUCKET,
            Key: pendingKey,
            ContentType: mimeType,
        }),
        { expiresIn: 5 * 60 } // 5 minutes to complete upload
    );
}

/**
 * Generate a presigned GET URL for downloading a confirmed file.
 * Never stored — valid for 10 minutes only.
 */
export async function generateDownloadUrl(
    fileKey: string,
    originalName: string,
    expiresInSeconds: number = 10 * 60 // 10 minutes default
): Promise<string> {
    return getSignedUrl(
        s3,
        new GetObjectCommand({
            Bucket: BUCKET,
            Key: fileKey,
            ResponseContentDisposition: `attachment; filename="${encodeURIComponent(originalName)}"`,
        }),
        { expiresIn: expiresInSeconds }
    );
}

/**
 * Promote a file from `pending/` to `files/` once the OEM confirms the upload.
 * The pending version is deleted — preventing orphan accumulation.
 */
export async function promoteFile(
    pendingKey: string,
    confirmedKey: string
): Promise<void> {
    // Copy to confirmed location
    await s3.send(
        new CopyObjectCommand({
            Bucket: BUCKET,
            CopySource: `${BUCKET}/${pendingKey}`,
            Key: confirmedKey,
        })
    );

    // Delete original from pending
    await s3.send(
        new DeleteObjectCommand({
            Bucket: BUCKET,
            Key: pendingKey,
        })
    );
}

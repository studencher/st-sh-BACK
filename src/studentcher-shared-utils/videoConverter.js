const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

// S3 Configuration
const bucketName = process.env.CLOUD_BUCKET_NAME || "";
const accessKeyId = process.env.CLOUD_BUCKET_ACCESS_KEY || "";
const secretAccessKey = process.env.CLOUD_BUCKET_ACCESS_SECRET || "";
const region = process.env.CLOUD_BUCKET_REGION || "";
const s3 = new AWS.S3({
    accessKeyId,
    secretAccessKey,
    region,
    s3ForcePathStyle: true
});

// Convert AVI files to WebM
async function convertAviToWebm(fileKey) {
    const inputFile = `/tmp/${path.basename(fileKey)}`;
    const outputFile = `/tmp/${path.basename(fileKey, '.mp4')}.webm`;
    const readStream = s3.getObject({
        Bucket: bucketName,
        Key: fileKey
    }).createReadStream();

    const writeStream = fs.createWriteStream(inputFile);
    readStream.pipe(writeStream);

    await new Promise(resolve => writeStream.on('finish', resolve));
    await exec(`ffmpeg -i ${inputFile} -c:v libvpx -crf 10 -b:v 1M -c:a libvorbis ${outputFile}`);
    const convertedFileKey = fileKey.replace('.mp4', '.webm');
    const fileContent = fs.readFileSync(outputFile);
    console.log(`Uploading ${convertedFileKey} to S3...`)
    await s3.putObject({
        Bucket: bucketName,
        Key: convertedFileKey,
        Body: fileContent,
        ContentType: 'video/webm'
    }).promise();
    console.log(`${fileKey} converted to webm ---> ${convertedFileKey}`);
    fs.unlinkSync(inputFile);
    fs.unlinkSync(outputFile);
}

const settleAll = async (promises)=>{
    for (let i = 0; i< promises.length ; i++) {
        console.log(`Converting ${path.basename(promises[i].fileKey)} to webm...`);
        try{
            await promises[i].promise;
        }catch (err){
            console.log(err.message, "for - " + promises[i].fileKey)
        }
    }
}
// Get all AVI files from S3 and convert them to WebM
async function processFiles() {
    try {
        console.log("Starting processFiles...")
        const response = await s3.listObjectsV2({ Bucket: bucketName, Prefix: "studentcher-module/activities/" }).promise();
        const aviFiles = response.Contents.filter((file) => path.extname(file.Key) === '.mp4').map((file) => file.Key);
        const unConvertedFiles = [];
        console.log(`Found ${aviFiles.length} AVI files in S3 bucket`);
        if (aviFiles.length === 0) {
            console.log('No AVI files found in S3 bucket');
            return;
        }
        for (const fileKey of aviFiles) {
            const webmKey = fileKey.replace('.mp4', '.webm');
            const webmExists = response.Contents.some(file => file.Key === webmKey);
            if (!webmExists) {
                unConvertedFiles.push(fileKey);
            }
            else{
                console.log(`${fileKey} already has been converted :-) skipped`)
            }
        }
        console.log(`There are ${unConvertedFiles.length} Unconverted files that should be handled`);
        for(let i=0; i< unConvertedFiles.length; i++) {
            const fileKey = unConvertedFiles[i];
            console.log(`Converting ${fileKey} to webm...`);
            await convertAviToWebm(fileKey);
        }


    } catch (error) {
        console.error(`Error converting AVI files to WebM: ${error.message}`);
    }
}

processFiles();

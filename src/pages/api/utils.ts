export function resizeImage(file: File) {
    console.log("Starting resizeImage function");
    console.log(`Original file size: ${file.size} bytes`);

    const maxWidth = 4096;
    const maxHeight = 4096;
    const reader = new FileReader();
    const image = new Image();
    const canvas = document.createElement('canvas');

    return new Promise<string>((resolve, reject) => {
        reader.onload = (e) => {
            console.log("FileReader loaded the file");

            if (!e.target) {
                console.error("FileReader target is null");
                reject(new Error("FileReader target is null"));
                return;
            }

            image.onload = () => {
                console.log("Image loaded");

                let width = image.width;
                let height = image.height;
                console.log(`Original dimensions: width=${width}, height=${height}`);

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }
                console.log(`Resized dimensions: width=${width}, height=${height}`);

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');

                if (ctx === null) {
                    console.error("2D context not available");
                    reject(new Error("2D context not available"));
                    return;
                }

                ctx.drawImage(image, 0, 0, width, height);
                console.log("Image drawn on canvas");

                canvas.toBlob((blob) => {
                    if (blob === null) {
                        console.error("Failed to create blob");
                        reject(new Error("Failed to create blob"));
                        return;
                    }
                    console.log(`Resized image size: ${blob.size} bytes`);
                    const resizedImageUrl = URL.createObjectURL(blob);
                    console.log(`Created new image URL: ${resizedImageUrl}`);
                    resolve(resizedImageUrl);
                }, file.type);
            };

            image.onerror = () => {
                console.error("Error loading image");
                reject(new Error("Error loading image"));
            };
            image.src = e.target.result as string;
        };

        reader.onerror = () => {
            console.error("Error reading file");
            reject(new Error("Error reading file"));
        };
        reader.readAsDataURL(file);
        console.log("Started reading file with FileReader");
    });
}

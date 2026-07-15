export function compressImage(file) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = e => {

            const img = new Image();

            img.onload = () => {

                const SIZE = 150;

                const canvas =
                    document.createElement("canvas");

                canvas.width = SIZE;
                canvas.height = SIZE;

                const ctx =
                    canvas.getContext("2d");

                const scale =
                    Math.max(
                        SIZE / img.width,
                        SIZE / img.height
                    );

                const width =
                    img.width * scale;

                const height =
                    img.height * scale;

                const x =
                    (SIZE - width) / 2;

                const y =
                    (SIZE - height) / 2;

                ctx.clearRect(
                    0,
                    0,
                    SIZE,
                    SIZE
                );

                ctx.drawImage(
                    img,
                    x,
                    y,
                    width,
                    height
                );

                resolve(

                    canvas.toDataURL(
                        "image/webp",
                          0.9
                    )

                );

            };

            img.onerror = reject;

            img.src = e.target.result;

        };

        reader.onerror = reject;

        reader.readAsDataURL(file);

    });

}
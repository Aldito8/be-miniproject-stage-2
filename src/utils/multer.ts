import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: 'src/uploads',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

export const fileFilter = (
    req: any,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowed = [".jpg", ".jpeg", ".png", ".webp"];

    if (!allowed.includes(ext)) {
        return cb(new Error("Only image files are allowed"));
    }

    cb(null, true);
};

export const upload = multer({
    storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 2
    }
})
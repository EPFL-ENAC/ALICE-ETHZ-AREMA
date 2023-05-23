# verify extension/content-type is valid
pdf_mimetypes = [
    "application/acrobat", "application/pdf", "application/x-pdf", "text/pdf",
    "text/x-pdf"
]
png_mimetypes = ["image/png", "application/png", "application/x-png"]
jpg_mimetypes = [
    "image/jpg", "application/jpg", "application/x-jpg", "image/jpeg",
    "application/jpeg"
]
gif_mimetypes = ["image/gif"]
others: list[str] = ["image/bmp", "image/webp"]
image_mimetypes: list[str] = png_mimetypes + jpg_mimetypes + gif_mimetypes + others

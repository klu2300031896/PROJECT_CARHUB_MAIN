package com.carhub.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

@PostMapping("/car")
public String uploadCarImage(@RequestParam("file") MultipartFile file) throws IOException {

String uploadDir = "uploads/cars/";

Path uploadPath = Paths.get(uploadDir);

if (!Files.exists(uploadPath)) {
Files.createDirectories(uploadPath);
}

String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

Path filePath = uploadPath.resolve(fileName);

Files.copy(file.getInputStream(), filePath);

return "/uploads/cars/" + fileName;

}

}
package com.rms.backend;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                        "http://localhost:5173",
                        "https://bootcamp04.duckdns.org"
                )
                // 2. ระบุ Method ชัดเจน (ปลอดภัยกว่าการใช้ "*" ที่เปิดรับทุกอย่าง)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                // 3. สำหรับดาวน์โหลด CSV: ต้องอนุญาตให้ React มองเห็น Header "Content-Disposition"
                .exposedHeaders("Content-Disposition", "Authorization")
                .allowCredentials(true);
    }
}